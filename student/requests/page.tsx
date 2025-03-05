"use client"

import { useState } from "react"
import { StudentLayout } from "@/components/layouts/student-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { UploadIcon as FileUpload, Search } from "lucide-react"

export default function RequestsPage() {
  const [step, setStep] = useState(1)

  return (
    <StudentLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Re-evaluation Requests</h1>
            <p className="text-muted-foreground">Submit a new request or track existing ones</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search requests..." className="pl-8" />
            </div>
            <Button>New Request</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Re-evaluation Request</CardTitle>
            <CardDescription>Fill in the details to submit a new request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 flex justify-between">
              <div className={`flex-1 text-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                1. Subject Details
              </div>
              <div className={`flex-1 text-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                2. Upload Documents
              </div>
              <div className={`flex-1 text-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                3. Payment
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-date">Exam Date</Label>
                    <Input type="date" id="exam-date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Re-evaluation</Label>
                  <textarea
                    className="h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Please provide detailed reason..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <FileUpload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">Upload Answer Sheet Copy</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop your files here or click to browse</p>
                  <Button variant="outline" className="mt-4">
                    Choose File
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Re-evaluation Fee</h3>
                      <p className="text-sm text-muted-foreground">Standard processing time (7-10 days)</p>
                    </div>
                    <div className="text-lg font-bold">$25.00</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1)
                  } else {
                    // Handle form submission
                  }
                }}
              >
                {step === 3 ? "Submit Request" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  )
}

