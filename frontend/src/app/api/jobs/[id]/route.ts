import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET single job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getCollection('jobs');
    const job = await collection.findOne({ id });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const { _id, ...jobData } = job;
    return NextResponse.json(jobData);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

// PUT update job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const collection = await getCollection('jobs');
    
    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    // If status is changing, update statusChangedAt
    if (body.status) {
      updates.statusChangedAt = new Date().toISOString();
    }
    
    delete updates._id;
    delete updates.id;
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const { _id, ...jobData } = result;
    return NextResponse.json(jobData);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getCollection('jobs');
    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
