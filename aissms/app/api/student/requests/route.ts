import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET handler to fetch subjects and existing requests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reg_no = searchParams.get("reg_no")
    const college_name = searchParams.get("college_name")
    const type = searchParams.get("type") // 'subjects' or 'requests'

    if (!reg_no || !college_name) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    if (type === 'subjects') {
      // Fetch available subjects for the student
      const result = await pool.query(
        `SELECT 
          subject_code,
          subject_name,
          current_marks,
          answer_sheet_url
        FROM student_subjects
        WHERE student_reg_no = $1 AND student_college = $2`,
        [reg_no, college_name]
      )

      return NextResponse.json(result.rows)
    } else {
      // Fetch existing requests
      const result = await pool.query(
        `SELECT 
          id,
          subject_code,
          subject_name,
          current_marks,
          status,
          request_date,
          completion_date,
          reason,
          pdf_url,
          urgency
        FROM reevaluation_requests
        WHERE student_reg_no = $1 AND student_college = $2
        ORDER BY request_date DESC`,
        [reg_no, college_name]
      )

      return NextResponse.json(result.rows)
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}

// POST handler to create new request
export async function POST(req: Request) {
  try {
    const {
      reg_no,
      college_name,
      sppu_reg_no,
      subject_code,
      reason,
      urgency
    } = await req.json()

    // Start a transaction
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Get subject details
      const subjectResult = await client.query(
        `SELECT 
          subject_name,
          current_marks,
          answer_sheet_url
        FROM student_subjects
        WHERE student_reg_no = $1 
        AND student_college = $2 
        AND subject_code = $3`,
        [reg_no, college_name, subject_code]
      )

      if (subjectResult.rows.length === 0) {
        throw new Error("Subject not found")
      }

      const subject = subjectResult.rows[0]

      // Create new request
      const newRequestResult = await client.query(
        `INSERT INTO reevaluation_requests (
          student_college,
          student_reg_no,
          sppu_reg_no,
          subject_code,
          subject_name,
          current_marks,
          reason,
          urgency,
          pdf_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          college_name,
          reg_no,
          sppu_reg_no,
          subject_code,
          subject.subject_name,
          subject.current_marks,
          reason,
          urgency,
          subject.answer_sheet_url
        ]
      )

      // Update student_details counts
      await client.query(
        `UPDATE student_details
        SET recent_request_id = $1,
            pending_requests = pending_requests + 1,
            total_requests = total_requests + 1
        WHERE reg_no = $2 AND college_name = $3`,
        [newRequestResult.rows[0].id, reg_no, college_name]
      )

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        requestId: newRequestResult.rows[0].id
      })

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create request" },
      { status: 500 }
    )
  }
}