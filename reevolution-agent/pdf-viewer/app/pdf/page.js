'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from '../../lib/supabaseClient';

// Set worker URL for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ViewMarksheet() {
  const router = useRouter();
  const { id } = router.query;
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError('');

        // Generate signed URL valid for 24 hours (86400 seconds)
        const { data, error: urlError } = await supabase.storage
          .from('marksheets')
          .createSignedUrl(`${id}.pdf`, 86400);

        if (urlError || !data?.signedUrl) {
          throw new Error(urlError?.message || 'Failed to generate PDF URL.');
        }

        setPdfUrl(data.signedUrl);
      } catch (err) {
        setError(`Error fetching marksheet: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPdf();
  }, [id]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Marksheet Viewer</h1>

      {loading && <div className="text-center text-gray-500">Loading PDF...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {pdfUrl && (
        <div className="border rounded p-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-center">Loading document...</div>}
            error={<div className="text-center text-red-500">Failed to load PDF</div>}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="mb-4"
              />
            ))}
          </Document>
        </div>
      )}

      {!loading && !error && pdfUrl && (
        <div className="text-center mt-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Open in new tab
          </a>
        </div>
      )}
    </div>
  );
}
