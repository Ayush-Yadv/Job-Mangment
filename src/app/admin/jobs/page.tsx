import { getJobs, getTemplates } from '@/lib/db';
import AdminJobsClient from './AdminJobsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminJobsPage() {
  let jobs = [];
  let templates = [];
  let serverError = null;
  
  try {
    [jobs, templates] = await Promise.all([
      getJobs({ includeArchived: true }),
      getTemplates()
    ]);
  } catch (e) {
    console.error('Error fetching admin data:', e);
    serverError = String(e);
  }
  
  return (
    <AdminJobsClient 
      initialJobs={jobs} 
      initialTemplates={templates}
      serverError={serverError} 
    />
  );
}
