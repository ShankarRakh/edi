// app/institute/tickets/page.tsx
import React from 'react';
import { getRevaluationRequests, getStudentDetails } from './actions';
import { StudentRequestsClient } from './client';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [records, studentDetails] = await Promise.all([
    getRevaluationRequests(),
    getStudentDetails()
  ]);
  
  return <StudentRequestsClient initialRecords={records} studentDetails={studentDetails} />;
}