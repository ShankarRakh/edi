"use client"

import { useState } from "react"
import { StudentLayout } from "@/components/layouts/student-layout"
import { PDFViewer } from "@/components/pdf-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, CheckCircle, AlertCircle, FileText, Eye, Download } from "lucide-react"

export default function DashboardPage() {
  const [selectedAnswerSheet, setSelectedAnswerSheet] = useState<string | null>(null)

  const recentRequests = [
    {
      id: "REQ001",
      subject: "Mathematics",
      status: "Pending",
      date: "2024-02-20",
      answerSheet: "/sample.pdf",
    },
    {
      id: "REQ002",
      subject: "Physics",
      status: "Under Review",
      date: "2024-02-19",
      answerSheet: "/sample.pdf",
    },
    {
      id: "REQ003",
      subject: "Chemistry",
      status: "Completed",
      date: "2024-02-18",
      answerSheet: "/sample.pdf",
    },
  ]

  const answerSheets = [
    {
      id: 1,
      subject: "Mathematics",
      exam: "Mid Term",
      date: "2024-02-15",
      url: "/sample.pdf",
    },
    {
      id: 2,
      subject: "Physics",
      exam: "Final Term",
      date: "2024-02-10",
      url: "/sample.pdf",
    },
    {
      id: 3,
      subject: "Chemistry",
      exam: "Mid Term",
      date: "2024-02-05",
      url: "/sample.pdf",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Under Review":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

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
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 requests under review</p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Last completed 2 days ago</p>
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
                    {recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {request.status}
                          </div>
                        </TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex gap-2"
                                onClick={() => setSelectedAnswerSheet(request.answerSheet)}
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Answer Sheet - {request.subject}</DialogTitle>
                              </DialogHeader>
                              <div className="h-[600px]">
                                <PDFViewer url={request.answerSheet} title={`${request.subject} - ${request.id}`} />
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
              <CardTitle>Answer Sheets</CardTitle>
              <CardDescription>Download or view your answer sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answerSheets.map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell>{sheet.subject}</TableCell>
                        <TableCell>{sheet.exam}</TableCell>
                        <TableCell>{sheet.date}</TableCell>
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
                                  <DialogTitle>Answer Sheet - {sheet.subject}</DialogTitle>
                                </DialogHeader>
                                <div className="h-[600px]">
                                  <PDFViewer url={sheet.url} title={`${sheet.subject} - ${sheet.exam}`} />
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="flex gap-2" asChild>
                              <a href={sheet.url} download>
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

