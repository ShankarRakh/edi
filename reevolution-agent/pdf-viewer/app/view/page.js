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
        
        // Get the signed URL for the PDF
        const { data, error: urlError } = await supabase.storage
          .from('marksheets')
          .createSignedUrl(`${id}.pdf`, 3600); // URL valid for 1 hour

        if (urlError) {
          throw urlError;
        }

        setPdfUrl(data.signedUrl);
      } catch (err) {
        setError('Error fetching marksheet: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [id]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Marksheet Viewer</h1>
      <div className="border rounded p-4">
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            error={<div>Failed to load PDF</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="mb-4"
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}