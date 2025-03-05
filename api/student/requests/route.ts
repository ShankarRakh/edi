import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { reg_no, sppu_reg_no, subject_code, reason } = await req.json()

    // First verify student and get college name
    const studentResult = await pool.query(
      `SELECT college_name FROM student_details 
       WHERE reg_no = $1 AND sppu_reg_no = $2`,
      [reg_no, sppu_reg_no]
    )

    if (studentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const college_name = studentResult.rows[0].college_name

    // Get subject details
    const subjectResult = await pool.query(
      `SELECT subject_name, current_marks 
       FROM student_subjects 
       WHERE student_reg_no = $1 AND subject_code = $2`,
      [reg_no, subject_code]
    )

    if (subjectResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      )
    }

    // Create new request
    const newRequestResult = await pool.query(
      `INSERT INTO reevaluation_requests (
        student_college, student_reg_no, sppu_reg_no,
        subject_code, subject_name, current_marks,
        reason, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [
        college_name,
        reg_no,
        sppu_reg_no,
        subject_code,
        subjectResult.rows[0].subject_name,
        subjectResult.rows[0].current_marks,
        reason,
        'Pending'
      ]
    )

    // Update student_details counts
    await pool.query(
      `UPDATE student_details 
       SET recent_request_id = $1,
           pending_requests = pending_requests + 1,
           total_requests = total_requests + 1
       WHERE reg_no = $2 AND college_name = $3`,
      [newRequestResult.rows[0].id, reg_no, college_name]
    )

    return NextResponse.json({
      success: true,
      requestId: newRequestResult.rows[0].id
    })

  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reg_no = searchParams.get("reg_no")
    
    if (!reg_no) {
      return NextResponse.json(
        { error: "Missing reg_no parameter" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `SELECT 
        id, subject_name, current_marks, status,
        request_date, completion_date, reason
       FROM reevaluation_requests 
       WHERE student_reg_no = $1 
       ORDER BY request_date DESC`,
      [reg_no]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }
}