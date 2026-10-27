import openings from './jobs.json';

export interface JobPosting {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly requirements: string | null;
  readonly employment_type: string | null;
  readonly department: string | null;
  readonly salary_type: string | null;
  readonly salary_min: number | null;
  readonly salary_max: number | null;
  readonly status: string | null;
}

export async function getJobPostings(): Promise<readonly JobPosting[]> {
  return (openings as readonly JobPosting[]).filter(
    (r) => r.status === null || r.status === 'open' || r.status === 'active',
  );
}
