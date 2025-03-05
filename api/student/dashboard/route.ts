import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { reg_no, sppu_reg_no } = await req.json()

    // Get student details
    const studentDetailsResult = await pool.query(
      `SELECT * FROM student_details 
       WHERE reg_no = $1 AND sppu_reg_no = $2`,
      [reg_no, sppu_reg_no]
    )

    // Get recent requests
    const recentRequestsResult = await pool.query(
      `SELECT 
        id, subject_name, status, request_date, pdf_url as answer_sheet
       FROM reevaluation_requests 
       WHERE student_reg_no = $1 
       ORDER BY request_date DESC 
       LIMIT 5`,
      [reg_no]
    )

    // Get all subjects with answer sheets
    const subjectsResult = await pool.query(
      `SELECT subject_name, current_marks, answer_sheet_url
       FROM student_subjects 
       WHERE student_reg_no = $1`,
      [reg_no]
    )

    return NextResponse.json({
      studentDetails: studentDetailsResult.rows[0],
      recentRequests: recentRequestsResult.rows,
      subjects: subjectsResult.rows
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}