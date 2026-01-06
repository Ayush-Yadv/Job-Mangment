import { getJobs } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let jobs = [];
  let error = null;
  
  try {
    jobs = await getJobs({ status: 'published' });
  } catch (e) {
    console.error('Error fetching jobs on server:', e);
    error = String(e);
  }
  
  return <HomeClient initialJobs={jobs} serverError={error} />;
}
