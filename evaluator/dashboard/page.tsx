import { EvaluatorLayout } from "@/components/layouts/evaluator-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

export default function EvaluatorDashboardPage() {
  const pendingRequests = [
    {
      id: "REQ001",
      student: "Alice Johnson",
      subject: "Mathematics",
      status: "Pending",
      date: "2024-02-20",
      urgency: "High",
    },
    {
      id: "REQ002",
      student: "Bob Smith",
      subject: "Physics",
      status: "Under Review",
      date: "2024-02-19",
      urgency: "Medium",
    },
    {
      id: "REQ003",
      student: "Charlie Brown",
      subject: "Chemistry",
      status: "Rejected",
      date: "2024-02-18",
      urgency: "Low",
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
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">5 high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 in final stage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5d</div>
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
                {pendingRequests.map((request) => (
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

