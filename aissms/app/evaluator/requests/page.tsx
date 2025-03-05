"use client";

import { useEffect, useState } from "react";
import { EvaluatorLayout } from "@/components/layouts/evaluator-layout";

import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MarkEvaluation from "../../../components/MarkEvuluation";


interface Subject {
  evaluator_college: string;
  evaluator_reg_no: string;
  subject_code: string;
  subject_name: string;
}
type StatusType = "pending" | "under_review" | "completed" | "rejected";

interface Request {
  id: number;
  student_college: string;
  student_reg_no: string;
  sppu_reg_no: string;
  subject_code: string;
  subject_name: string;
  current_marks: number;
  evaluator_college: string | null;
  evaluator_reg_no: string;
  status: string;
  urgency: string | null;
  request_date: string;
  completion_date: string | null;
  reason: string;
  pdf_url: string;
}

export default function RequestsPage() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfFileId, setPdfFileId] = useState('32aa5dc7-3a4d-4ad7-889f-cc6700c80268.pdf');
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");

  const normalizeStatus = (status: string): string => {
    // This handles common variations in status format
    return status.toLowerCase().replace(/\s+/g, '_');
  };
  

  // Fetch subjects and requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual evaluator reg_no from auth context/session
        const evaluatorRegNo = sessionStorage.getItem("reg_no");

        // Fetch subjects
        const subjectsResponse = await fetch(
          `/api/evaluator/subjects?reg_no=${evaluatorRegNo}`
        );
        if (!subjectsResponse.ok) throw new Error("Failed to fetch subjects");
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);

        // Fetch requests
        const requestsResponse = await fetch(
          `/api/evaluator/requests?reg_no=${evaluatorRegNo}`
        );
        if (!requestsResponse.ok) throw new Error("Failed to fetch requests");
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = [...requests];
  
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.id.toString().toLowerCase().includes(query) ||
          request.student_reg_no.toLowerCase().includes(query)
      );
    }
  
    if (selectedSubject !== "all") {
      filtered = filtered.filter(
        (request) => request.subject_code === selectedSubject
      );
    }
  
    // Updated status filter logic
    if (selectedStatus !== "all") {
      filtered = filtered.filter((request) => {
        const normalizedRequestStatus = normalizeStatus(request.status);
        const normalizedSelectedStatus = normalizeStatus(selectedStatus);
        return normalizedRequestStatus === normalizedSelectedStatus;
      });
    }
  
    if (selectedUrgency !== "all") {
      filtered = filtered.filter(
        (request) => request.urgency?.toLowerCase() === selectedUrgency.toLowerCase()
      );
    }
  
    setFilteredRequests(filtered);
  }, [searchQuery, selectedSubject, selectedStatus, selectedUrgency, requests]);

  const handleUpdateRequest = async (requestId: number, updatedData: any) => {
    try {
      const response = await fetch(`/api/evaluator/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update request");

      // Refresh requests after update
      const evaluatorRegNo = "EVAL001"; // Replace with actual reg_no
      const refreshResponse = await fetch(
        `/api/evaluator/requests?reg_no=${evaluatorRegNo}`
      );
      if (!refreshResponse.ok) throw new Error("Failed to refresh requests");
      const refreshedData = await refreshResponse.json();
      setRequests(refreshedData);
      setFilteredRequests(refreshedData);

      toast({
        title: "Success",
        description: "Request updated successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update request. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {error}
      </div>
    );
  }

  return (
    <EvaluatorLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Requests Management</h1>
            <p className="text-muted-foreground">
              Review and manage re-evaluation requests
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Narrow down requests based on specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID or registration number..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.subject_code}
                        value={subject.subject_code}
                      >
                        {subject.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


               <div className="space-y-2">
          <Label>Urgency</Label>
          <Select
            value={selectedUrgency}
            onValueChange={setSelectedUrgency}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">

  <Label>Status</Label>
  <Select
    value={selectedStatus}
    onValueChange={setSelectedStatus}
  >
    <SelectTrigger>
      <SelectValue placeholder="All Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="under_review">Under Review</SelectItem>
      <SelectItem value="completed">Completed</SelectItem>
      <SelectItem value="rejected">Rejected</SelectItem>
    </SelectContent>
  </Select>
</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Re-evaluation Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Current Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    // sessionStorage.setItem("current_marks",request.current_marks)
                    return(
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.student_reg_no}</TableCell>
                      <TableCell>{request.subject_name}</TableCell>
                      <TableCell>{request.current_marks}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        {new Date(request.request_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(request.id)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90%] h-[90%] max-w-6xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Review Request {request.id}
                                </DialogTitle>
                                <DialogDescription>
                                  Review and update the re-evaluation request
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-6 lg:grid-cols-2">
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                    <Label>Student Details</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm text-muted-foreground">
                                          Registration No
                                        </Label>
                                        <div className="font-medium">
                                          {request.student_reg_no}
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">
                                          SPPU No
                                        </Label>
                                        <div className="font-medium">
                                          {request.sppu_reg_no}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Student's Reason</Label>
                                    <div className="rounded-md border p-3">
                                      {request.reason}
                                    </div>
                                  </div>
                                  <MarkEvaluation />
                                  <div className="grid gap-4">
                                    <div className="space-y-2">
                                      <Label>Current Marks</Label>
                                      <Input
                                        type="number"
                                        value={request.current_marks}
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Updated Marks</Label>
                                      <Input type="number" value={`${sessionStorage.getItem('updated_marks')}`}/>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Evaluator Comments</Label>
                                    <Textarea
                                      placeholder="Provide detailed feedback..."
                                      className="h-32"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Status Update</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="under_review">
                                          Under Review
                                        </SelectItem>
                                        <SelectItem value="completed">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                          Rejected
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                      onClick={() => {
                                        handleUpdateRequest(request.id, {
                                          // Add form data here
                                        });
                                      }}
                                    >
                                      Submit Review
                                    </Button>
                                  </div>
                                </div>
                                <div className="h-[600px] rounded-lg border">
                                  <PDFViewer
                                    fileId={pdfFileId}
                                    onClose={() => {
                                      /* handle close */
                                    }}
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
                                <DialogTitle>
                                  Answer Sheet - {request.subject_name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="h-[600px]">
                                <PDFViewer
                                  url={request.pdf_url}
                                  title={`${request.subject_name} - ${request.id}`}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </EvaluatorLayout>
  );
}
