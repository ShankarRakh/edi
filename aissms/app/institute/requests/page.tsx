import { pool } from "@/lib/db"

export const revalidate = 0

async function getRevaluationRequests() {
  const result = await pool.query(
    `SELECT * FROM reevaluation_requests ORDER BY request_date DESC`
  )

  return result.rows
}

export default async function StudentsPage() {
  const records = await getRevaluationRequests()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Student Reevaluation Requests</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Student Reg No</th>
            <th className="py-2 px-4 border-b">Subject</th>
            <th className="py-2 px-4 border-b">Current Marks</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Request Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td className="py-2 px-4 border-b">{record.student_reg_no}</td>
              <td className="py-2 px-4 border-b">{record.subject_name}</td>
              <td className="py-2 px-4 border-b">{record.current_marks}</td>
              <td className="py-2 px-4 border-b">{record.status}</td>
              <td className="py-2 px-4 border-b">{new Date(record.request_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

