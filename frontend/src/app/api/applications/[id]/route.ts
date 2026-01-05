import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET single application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getCollection('applications');
    const application = await collection.findOne({ id });
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    const { _id, ...appData } = application;
    return NextResponse.json(appData);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

// PUT update application
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const collection = await getCollection('applications');
    
    const updates = { ...body };
    delete updates._id;
    delete updates.id;
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    const { _id, ...appData } = result;
    return NextResponse.json(appData);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

// DELETE application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getCollection('applications');
    
    // Get application to find jobId
    const application = await collection.findOne({ id });
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    // Delete application
    await collection.deleteOne({ id });
    
    // Decrement job's application count
    const jobsCollection = await getCollection('jobs');
    await jobsCollection.updateOne(
      { id: application.jobId },
      { $inc: { applicationsCount: -1 } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
