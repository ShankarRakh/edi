import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { reg_no, sppu_reg_no } = await request.json();

    // Query to check if user exists with given registration number
    const userQuery = await pool.query(
      'SELECT * FROM evaluator_details WHERE reg_no = $1',
      [reg_no]
    );

    const user = userQuery.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (in real application, passwords should be hashed)
    if (user.sppu_reg_no !== sppu_reg_no) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session or token here if needed
    return NextResponse.json({
      success: true,
      redirect: '/evaluator/dashboard'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}