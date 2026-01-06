import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { Application } from '@/lib/types';

// GET all applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const stage = searchParams.get('stage');
    
    let sql = `
      SELECT a.*, j.title as job_title, j.slug as job_slug
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
    `;
    const params: string[] = [];
    const conditions: string[] = [];
    
    if (jobId) {
      conditions.push(`a.job_id = $${params.length + 1}`);
      params.push(jobId);
    }
    
    if (status) {
      conditions.push(`a.status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (stage) {
      conditions.push(`a.stage = $${params.length + 1}`);
      params.push(stage);
    }
    
    // Exclude archived by default
    conditions.push('a.is_archived = false');
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY a.applied_at DESC';
    
    const applications = await query<Application>(sql, params);
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// POST create new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const sql = `
      INSERT INTO applications (
        job_id, name, email, phone, position,
        resume_url, linkedin, portfolio, cover_letter,
        experience, status, stage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const params = [
      body.job_id || body.jobId,
      body.name,
      body.email,
      body.phone || '',
      body.position,
      body.resume_url || body.resumeUrl || null,
      body.linkedin || body.linkedIn || null,
      body.portfolio || null,
      body.cover_letter || body.coverLetter || null,
      body.experience || '',
      'new',
      'new',
    ];
    
    const applications = await query<Application>(sql, params);
    
    // Update job applications count
    await execute(
      'UPDATE jobs SET applications_count = applications_count + 1 WHERE id = $1',
      [body.job_id || body.jobId]
    );
    
    return NextResponse.json(applications[0], { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
