"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function ReevaluatorsPage() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    async function fetchRecords() {
      const { data, error } = await supabase.from("evaluator_details").select("*")
      if (error) console.error("Error fetching records:", error)
      else setRecords(data)
    }
    fetchRecords()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Reevaluators</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>College</TableHead>
            <TableHead>Experience (Years)</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Pending Reviews</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record: any) => (
            <TableRow key={record.reg_no}>
              <TableCell>{`${record.first_name} ${record.last_name}`}</TableCell>
              <TableCell>{record.college_name}</TableCell>
              <TableCell>{record.year_of_experience}</TableCell>
              <TableCell>{record.rating}</TableCell>
              <TableCell>{record.pending_review_requests}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

