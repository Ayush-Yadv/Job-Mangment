import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    return NextResponse.json({ 
      status: 'healthy', 
      service: 'Teams 24 Careers API (Next.js + PostgreSQL)',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ 
      status: 'unhealthy', 
      error: 'Database connection failed' 
    }, { status: 500 });
  }
}
