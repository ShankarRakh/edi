// app/institute/tickets/actions.ts
'use server'

import { pool } from "@/lib/db"

export async function getRevaluationRequests() {
  const result = await pool.query(
    `SELECT * FROM reevaluation_requests ORDER BY request_date DESC`
  )
  return result.rows
}

export async function getStudentDetails() {
  const result = await pool.query(
    `SELECT * FROM student_details`
  )
  return result.rows
}

export async function updateRequestUrgency(requestId: number, urgency: string) {
  try {
    await pool.query(
      `UPDATE reevaluation_requests 
       SET urgency = $1
       WHERE id = $2`,
      [urgency, requestId]
    )
    return { success: true }
  } catch (error) {
    console.error('Error updating urgency:', error)
    return { success: false, error }
  }
}

export async function bulkUpdateUrgencies(updates: { id: number; urgency: string }[]) {
  try {
    // Using a transaction to ensure all updates succeed or none do
    await pool.query('BEGIN')
    
    for (const update of updates) {
      await pool.query(
        `UPDATE reevaluation_requests 
         SET urgency = $1
         WHERE id = $2`,
        [update.urgency, update.id]
      )
    }
    
    await pool.query('COMMIT')
    return { success: true }
  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error in bulk urgency update:', error)
    return { success: false, error }
  }
}