import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

// Bulk update applications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationIds, action, data } = body;
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json({ error: 'No applications specified' }, { status: 400 });
    }
    
    // Create placeholders for IN clause
    const placeholders = applicationIds.map((_, i) => `$${i + 1}`).join(', ');
    
    let result;
    
    switch (action) {
      case 'move':
        if (!data?.stage) {
          return NextResponse.json({ error: 'Stage is required for move action' }, { status: 400 });
        }
        result = await execute(
          `UPDATE applications SET stage = $${applicationIds.length + 1}, status = $${applicationIds.length + 1}, stage_changed_at = NOW() WHERE id IN (${placeholders})`,
          [...applicationIds, data.stage]
        );
        break;
        
      case 'archive':
        result = await execute(
          `UPDATE applications SET is_archived = true, stage_changed_at = NOW() WHERE id IN (${placeholders})`,
          applicationIds
        );
        break;
        
      case 'reject':
        result = await execute(
          `UPDATE applications SET status = 'rejected', stage = 'rejected', stage_changed_at = NOW() WHERE id IN (${placeholders})`,
          applicationIds
        );
        break;
        
      case 'export':
        const applications = await query(
          `SELECT a.*, j.title as job_title FROM applications a LEFT JOIN jobs j ON a.job_id = j.id WHERE a.id IN (${placeholders})`,
          applicationIds
        );
        return NextResponse.json({ success: true, data: applications });
        
      case 'email':
        return NextResponse.json({ 
          success: true, 
          message: `Email would be sent to ${applicationIds.length} candidates` 
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      modifiedCount: result || 0 
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json({ error: 'Bulk action failed' }, { status: 500 });
  }
}
