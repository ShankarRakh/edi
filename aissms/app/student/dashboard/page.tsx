"use client"

import { useState, useEffect } from "react"
import { StudentLayout } from "@/components/layouts/student-layout"
import { PDFViewer } from "@/components/pdf-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, CheckCircle, AlertCircle, FileText, Eye, Download } from "lucide-react"

interface StudentDetails {
  reg_no: string
  sppu_reg_no: string
  name: string
}

interface RecentRequest {
  id: string
  subject_name: string
  status: string
  request_date: string
  answer_sheet: string
}

interface Subject {
  subject_name: string
  current_marks: number
  answer_sheet_url: string
}

interface DashboardData {
  studentDetails: StudentDetails
  recentRequests: RecentRequest[]
  subjects: Subject[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, you would get these values from authentication context
        const reg_no = "COEP123" // Replace with actual value
        const sppu_reg_no = "SPPU001" // Replace with actual value

        const response = await fetch("/api/student/dashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reg_no, sppu_reg_no }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "under review":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex h-screen items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      </StudentLayout>
    )
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </StudentLayout>
    )
  }

  if (!dashboardData) {
    return null
  }

  // Calculate statistics for the dashboard cards
  const totalRequests = dashboardData.recentRequests.length
  const pendingRequests = dashboardData.recentRequests.filter(
    req => req.status.toLowerCase() === "pending" || req.status.toLowerCase() === "under review"
  ).length
  const completedRequests = dashboardData.recentRequests.filter(
    req => req.status.toLowerCase() === "completed"
  ).length

  return (
    <StudentLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button>New Re-evaluation Request</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">All re-evaluation requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Requests under review</p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRequests}</div>
              <p className="text-xs text-muted-foreground">Processed requests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Your most recent re-evaluation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.subject_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {request.status}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Answer Sheet - {request.subject_name}</DialogTitle>
                              </DialogHeader>
                              <div className="h-[600px]">
                                <PDFViewer url={request.answer_sheet} title={`${request.subject_name} - ${request.id}`} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Answer Sheets</CardTitle>
              <CardDescription>Download or view your answer sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Current Marks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.subjects.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell>{subject.subject_name}</TableCell>
                        <TableCell>{subject.current_marks}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex gap-2">
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Answer Sheet - {subject.subject_name}</DialogTitle>
                                </DialogHeader>
                                <div className="h-[600px]">
                                  <PDFViewer url={subject.answer_sheet_url} title={subject.subject_name} />
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="flex gap-2" asChild>
                              <a href={subject.answer_sheet_url} download>
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  )
}