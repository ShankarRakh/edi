"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Hardcoded credentials
const EMAIL = 'aditya@gmail.com'
const PASSWORD = 'aditya'

interface PDFViewerProps {
  fileId: string
  onClose?: () => void
}

export function PDFViewer({ fileId, onClose }: PDFViewerProps) {
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Handle authentication and PDF fetching
  useEffect(() => {
    const authenticate = async () => {
      try {
        // Check if already authenticated
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Sign in with hardcoded credentials
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: EMAIL,
            password: PASSWORD
          })
          
          if (authError) throw authError
          
          if (data.user) {
            setUserId(data.user.id)
          }
        } else {
          setUserId(user.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setLoading(false)
      }
    }

    authenticate()
  }, [])

  // Fetch PDF once authenticated
  useEffect(() => {
    const fetchPdf = async () => {
      if (!userId) return

      try {
        // Get file details
        const { data: fileList, error: listError } = await supabase.storage
          .from('uploads')
          .list(`${userId}/`, {
            limit: 100,
            search: fileId
          })

        if (listError) throw listError
        
        if (!fileList || fileList.length === 0) {
          throw new Error('File not found')
        }

        const file = fileList[0]
        setFileName(file.name)

        // Generate signed URL
        const { data: urlData, error: urlError } = await supabase.storage
          .from('uploads')
          .createSignedUrl(`${userId}/${file.name}`, 3600)

        if (urlError) throw urlError

        setPdfUrl(urlData.signedUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading PDF')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchPdf()
    }
  }, [userId, fileId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Sign out when component unmounts
      supabase.auth.signOut()
    }
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading PDF...</div>
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || 'Unable to load PDF'}</p>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Back to List
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate max-w-[50%]">{fileName}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="icon" onClick={() => setScale((s) => Math.min(2, s + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={pdfUrl} download={fileName}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download PDF</span>
            </a>
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
      <div className="relative flex-1 overflow-auto rounded-lg border bg-muted">
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="h-full w-full"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>Page {currentPage}</span>
        <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => p + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}