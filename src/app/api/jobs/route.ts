import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { Job, generateSlug } from '@/lib/types';

// GET all jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeArchived = searchParams.get('includeArchived') === 'true';
    
    let sql = 'SELECT * FROM jobs';
    const params: string[] = [];
    const conditions: string[] = [];
    
    if (status && status !== 'all') {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (!includeArchived) {
      conditions.push(`status != 'archived'`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const jobs = await query<Job>(sql, params);
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate slug from title
    const tempId = Date.now().toString();
    const slug = generateSlug(body.title, tempId);
    
    const sql = `
      INSERT INTO jobs (
        slug, title, type, salary_min, salary_max, location, color,
        description, requirements, responsibilities, benefits,
        status, application_deadline, meta_title, meta_description,
        template_id, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    
    const params = [
      slug,
      body.title,
      body.type || 'full-time',
      body.salary_min || '',
      body.salary_max || '',
      body.location || '',
      body.color || '#3B82F6',
      body.description || '',
      body.requirements || [],
      body.responsibilities || [],
      body.benefits || [],
      body.status || 'draft',
      body.application_deadline || null,
      body.meta_title || body.title,
      body.meta_description || body.description?.substring(0, 160),
      body.template_id || null,
      body.category || null,
    ];
    
    const jobs = await query<Job>(sql, params);
    
    return NextResponse.json(jobs[0], { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
