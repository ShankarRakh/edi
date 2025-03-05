"use client";

import { useEffect, useState } from "react"
import { EvaluatorLayout } from "@/components/layouts/evaluator-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DashboardData {
  metrics: {
    pendingReview: number
    underReview: number
    completedToday: number
    averageTime: number
    highPriorityCount: number
    finalStageCount: number
    completedChange: number
  }
  pendingRequests: {
    id: string
    student: string
    subject: string
    status: string
    urgency: string
    date: string
  }[]
}

export default function EvaluatorDashboardPage() {
  const { toast } = useToast()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const evaluatorRegNo = sessionStorage.getItem("reg_no")
        if (!evaluatorRegNo) {
          throw new Error("No registration number found")
        }
        
        const response = await fetch(`/api/evaluator/dashboard?reg_no=${evaluatorRegNo}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Under Review":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "text-red-500 bg-red-50 dark:bg-red-950"
      case "Medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      case "Low":
        return "text-green-500 bg-green-50 dark:bg-green-950"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <EvaluatorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </EvaluatorLayout>
    )
  }

  if (error) {
    return (
      <EvaluatorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </EvaluatorLayout>
    )
  }

  if (!data) {
    return (
      <EvaluatorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div>No data available</div>
        </div>
      </EvaluatorLayout>
    )
  }

  return (
    <EvaluatorLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button>View All Requests</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.pendingReview}</div>
              <p className="text-xs text-muted-foreground">{data.metrics.highPriorityCount} high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.underReview}</div>
              <p className="text-xs text-muted-foreground">{data.metrics.finalStageCount} in final stage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                {data.metrics.completedChange >= 0 ? '+' : ''}{data.metrics.completedChange} from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.averageTime}d</div>
              <p className="text-xs text-muted-foreground">Per request</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Recent requests requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.student}</TableCell>
                    <TableCell>{request.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getUrgencyColor(
                          request.urgency,
                        )}`}
                      >
                        {request.urgency}
                      </span>
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EvaluatorLayout>
  )
}