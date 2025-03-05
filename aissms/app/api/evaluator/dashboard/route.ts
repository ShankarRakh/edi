import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(req: Request) {
  try {
    // Extract reg_no from query parameters
    const { searchParams } = new URL(req.url)
    const reg_no = searchParams.get("reg_no")

    if (!reg_no) {
      return NextResponse.json(
        { error: "Missing reg_no parameter" },
        { status: 400 }
      )
    }

    // Get evaluator details including metrics
    const evaluatorResult = await pool.query(
      `SELECT 
        college_name,
        reg_no,
        sppu_reg_no,
        first_name,
        last_name,
        pending_review_requests,
        under_review_requests,
        completed_today_requests,
        avg_time_to_complete
      FROM evaluator_details
      WHERE reg_no = $1`,
      [reg_no]
    )

    if (evaluatorResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Evaluator not found" },
        { status: 404 }
      )
    }

    const evaluator = evaluatorResult.rows[0]

    // Get pending requests for the evaluator
    const pendingRequestsResult = await pool.query(
      `SELECT 
        r.id,
        r.student_reg_no as student,
        r.subject_name as subject,
        r.status,
        r.urgency,
        TO_CHAR(r.request_date, 'YYYY-MM-DD') as date
      FROM reevaluation_requests r
      WHERE 
        (r.evaluator_reg_no = $1)
        OR
        (r.evaluator_reg_no IS NULL AND 
         r.status = 'Pending')
      ORDER BY 
        CASE 
          WHEN r.urgency = 'High' THEN 1
          WHEN r.urgency = 'Medium' THEN 2
          WHEN r.urgency = 'Low' THEN 3
        END,
        r.request_date DESC
      LIMIT 10`,
      [reg_no]
    )

    // Get high priority count
    const highPriorityResult = await pool.query(
      `SELECT COUNT(*) as count
      FROM reevaluation_requests
      WHERE 
        status = 'Pending' AND
        urgency = 'High' AND
        evaluator_reg_no = $1`,
      [reg_no]
    )

    // Get final stage count (requests under review for more than 48 hours)
    const finalStageResult = await pool.query(
      `SELECT COUNT(*) as count
      FROM reevaluation_requests
      WHERE 
        status = 'Under Review' AND
        evaluator_reg_no = $1 AND
        request_date < NOW() - INTERVAL '48 hours'`,
      [reg_no]
    )

    // Calculate completed change from yesterday
    const completedChangeResult = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE completion_date::date = CURRENT_DATE) as today_count,
        COUNT(*) FILTER (WHERE completion_date::date = CURRENT_DATE - 1) as yesterday_count
      FROM reevaluation_requests
      WHERE 
        status = 'Completed' AND
        evaluator_reg_no = $1 AND
        completion_date >= CURRENT_DATE - 1`,
      [reg_no]
    )

    const dashboardData = {
      metrics: {
        pendingReview: evaluator.pending_review_requests,
        underReview: evaluator.under_review_requests,
        completedToday: evaluator.completed_today_requests,
        averageTime: evaluator.avg_time_to_complete,
        highPriorityCount: parseInt(highPriorityResult.rows[0].count),
        finalStageCount: parseInt(finalStageResult.rows[0].count),
        completedChange: parseInt(completedChangeResult.rows[0].today_count) - 
                        parseInt(completedChangeResult.rows[0].yesterday_count)
      },
      pendingRequests: pendingRequestsResult.rows.map(row => ({
        id: `REQ${row.id.toString().padStart(3, '0')}`,
        student: row.student,
        subject: row.subject,
        status: row.status,
        urgency: row.urgency,
        date: row.date
      }))
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}