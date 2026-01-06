import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Create Supabase client for production, fall back to local pg for development
const useSupabase = supabaseUrl && supabaseAnonKey;

export const supabase = useSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// For backward compatibility with existing code
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_HOST?.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
});

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  // Use Supabase if available
  if (supabase) {
    // Parse simple SELECT queries for Supabase
    const selectMatch = text.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)/i);
    if (selectMatch) {
      const table = selectMatch[2];
      let queryBuilder = supabase.from(table).select('*');
      
      // Handle WHERE clauses
      const whereMatch = text.match(/WHERE\s+(.+?)(?:\s+ORDER|\s*$)/i);
      if (whereMatch && params && params.length > 0) {
        const conditions = whereMatch[1];
        // Parse simple conditions like "column = $1"
        const conditionParts = conditions.split(/\s+AND\s+/i);
        let paramIndex = 0;
        for (const condition of conditionParts) {
          const eqMatch = condition.match(/(\w+)\s*=\s*\$\d+/);
          const neqMatch = condition.match(/(\w+)\s*!=\s*'(\w+)'/);
          if (eqMatch && params[paramIndex] !== undefined) {
            queryBuilder = queryBuilder.eq(eqMatch[1], params[paramIndex]);
            paramIndex++;
          } else if (neqMatch) {
            queryBuilder = queryBuilder.neq(neqMatch[1], neqMatch[2]);
          }
        }
      }
      
      // Handle ORDER BY
      const orderMatch = text.match(/ORDER\s+BY\s+(\w+)\s+(ASC|DESC)?/i);
      if (orderMatch) {
        queryBuilder = queryBuilder.order(orderMatch[1], { ascending: orderMatch[2]?.toUpperCase() !== 'DESC' });
      }
      
      const { data, error } = await queryBuilder;
      if (error) throw error;
      return (data || []) as T[];
    }
    
    // Handle INSERT...RETURNING
    const insertMatch = text.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)/i);
    if (insertMatch && params) {
      const table = insertMatch[1];
      const columns = insertMatch[2].split(',').map(c => c.trim());
      const insertData: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        if (params[i] !== undefined) {
          insertData[col] = params[i];
        }
      });
      
      const { data, error } = await supabase.from(table).insert(insertData).select().single();
      if (error) throw error;
      return [data] as T[];
    }
    
    // Handle UPDATE...RETURNING
    const updateMatch = text.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+id\s*=\s*\$(\d+)/i);
    if (updateMatch && params) {
      const table = updateMatch[1];
      const setPart = updateMatch[2];
      const idParamIndex = parseInt(updateMatch[3]) - 1;
      const id = params[idParamIndex];
      
      const updateData: Record<string, unknown> = {};
      const setMatches = setPart.matchAll(/(\w+)\s*=\s*\$(\d+)/g);
      for (const match of setMatches) {
        const col = match[1];
        const paramIdx = parseInt(match[2]) - 1;
        if (params[paramIdx] !== undefined) {
          updateData[col] = params[paramIdx];
        }
      }
      
      const { data, error } = await supabase.from(table).update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return [data] as T[];
    }
  }
  
  // Fall back to local PostgreSQL
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function execute(text: string, params?: unknown[]): Promise<number> {
  if (supabase) {
    // Handle UPDATE without RETURNING
    const updateMatch = text.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(\w+)\s*=\s*\$(\d+)/i);
    if (updateMatch && params) {
      const table = updateMatch[1];
      const setPart = updateMatch[2];
      const whereCol = updateMatch[3];
      const whereParamIdx = parseInt(updateMatch[4]) - 1;
      const whereValue = params[whereParamIdx];
      
      const updateData: Record<string, unknown> = {};
      
      // Handle increment operations like "column = column + 1"
      const incrMatch = setPart.match(/(\w+)\s*=\s*\1\s*\+\s*(\d+)/);
      if (incrMatch) {
        // For increment, we need to fetch current value first
        const { data: current } = await supabase.from(table).select(incrMatch[1]).eq(whereCol, whereValue).single();
        if (current) {
          updateData[incrMatch[1]] = (current[incrMatch[1]] || 0) + parseInt(incrMatch[2]);
        }
      }
      
      // Handle regular SET operations
      const setMatches = setPart.matchAll(/(\w+)\s*=\s*\$(\d+)/g);
      for (const match of setMatches) {
        const col = match[1];
        const paramIdx = parseInt(match[2]) - 1;
        if (params[paramIdx] !== undefined) {
          updateData[col] = params[paramIdx];
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase.from(table).update(updateData).eq(whereCol, whereValue);
        if (error) throw error;
      }
      return 1;
    }
    
    // Handle DELETE
    const deleteMatch = text.match(/DELETE\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*\$1/i);
    if (deleteMatch && params) {
      const { error } = await supabase.from(deleteMatch[1]).delete().eq(deleteMatch[2], params[0]);
      if (error) throw error;
      return 1;
    }
  }
  
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rowCount || 0;
  } finally {
    client.release();
  }
}

export { pool };
