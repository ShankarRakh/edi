// app/student/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const credentials = {
      reg_no: formData.get('reg_no'),
      sppu_reg_no: formData.get('sppu_reg_no')
    }

    try {
      const response = await fetch('/api/student/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (response.ok) {
        // Store credentials in sessionStorage for subsequent requests
        sessionStorage.setItem('studentCredentials', JSON.stringify(credentials))
        router.push('/student/dashboard')
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      alert('Error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <ThemeToggle />
          </div>
          <CardDescription>Enter your registration details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg_no">Registration Number</Label>
              <Input id="reg_no" name="reg_no" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sppu_reg_no">SPPU Registration Number</Label>
              <Input id="sppu_reg_no" name="sppu_reg_no" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}