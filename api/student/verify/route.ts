import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { reg_no, sppu_reg_no } = await req.json()

    const result = await pool.query(
      `SELECT * FROM student_details 
       WHERE reg_no = $1 AND sppu_reg_no = $2`,
      [reg_no, sppu_reg_no]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying student:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}