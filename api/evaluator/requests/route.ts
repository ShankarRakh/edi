import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(req: Request) {
  try {
    // Extract the search parameters from the request URL
    const { searchParams } = new URL(req.url)
    const reg_no = searchParams.get("reg_no")

    if (!reg_no) {
      return NextResponse.json(
        { error: "Missing reg_no parameter" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `SELECT * FROM reevaluation_requests 
       WHERE evaluator_reg_no = $1 
       ORDER BY request_date DESC`,
      [reg_no] 
    )

    console.log(result.rows)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }
}
