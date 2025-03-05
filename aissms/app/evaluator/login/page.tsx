"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "@/components/ui/use-toast"

export default function EvaluatorLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    reg_no: "",
    sppu_reg_no: ""
  })
  const router = useRouter()

  useEffect(() => {
    const storedRegNo = sessionStorage.getItem("reg_no")
    const storedSppuRegNo = sessionStorage.getItem("sppu_reg_no")
    if (storedRegNo && storedSppuRegNo) {
      setFormData({ reg_no: storedRegNo, sppu_reg_no: storedSppuRegNo })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    sessionStorage.setItem("reg_no", formData.reg_no)
    sessionStorage.setItem("sppu_reg_no", formData.sppu_reg_no)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        })
        return
      }

      if (data.success) {
        router.push(data.redirect)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Evaluator Login</CardTitle>
            <ThemeToggle />
          </div>
          <CardDescription>Sign in to access the evaluator portal</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg_no">Registration Number</Label>
              <Input 
                id="reg_no"
                name="reg_no"
                placeholder="Enter your registration number"
                value={formData.reg_no}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sppu_reg_no">SPPU Registration Number</Label>
              <Input 
                id="sppu_reg_no"
                name="sppu_reg_no"
                type="password"
                value={formData.sppu_reg_no}
                onChange={handleInputChange}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <Button variant="link" className="text-sm">
              Forgot password?
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}