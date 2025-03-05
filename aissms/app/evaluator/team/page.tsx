import { EvaluatorLayout } from "@/components/layouts/evaluator-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. John Smith",
      role: "Senior Evaluator",
      department: "Mathematics",
      status: "Active",
      assignedRequests: 15,
      completedToday: 5,
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      role: "Evaluator",
      department: "Physics",
      status: "Active",
      assignedRequests: 12,
      completedToday: 3,
    },
    {
      id: 3,
      name: "Prof. Michael Brown",
      role: "Senior Evaluator",
      department: "Chemistry",
      status: "Away",
      assignedRequests: 8,
      completedToday: 0,
    },
  ]

  return (
    <EvaluatorLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Evaluation Team</h1>
            <p className="text-muted-foreground">Manage and monitor team performance</p>
          </div>
          <Button>Add Team Member</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Across 5 departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Overview of all evaluators and their current workload</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Requests</TableHead>
                  <TableHead>Completed Today</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                    </TableCell>
                    <TableCell>{member.assignedRequests}</TableCell>
                    <TableCell>{member.completedToday}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
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

