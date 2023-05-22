import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button, Container, Typography, Link } from '@mui/material';

function App() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [combinedPdfBlob, setCombinedPdfBlob] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setPdfFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleCombinePDFs = async () => {
    const pdfDoc = await PDFDocument.create();

    for (const file of pdfFiles) {
      const fileData = await file.arrayBuffer();
      const filePdf = await PDFDocument.load(fileData);
      const copiedPages = await pdfDoc.copyPages(filePdf, filePdf.getPageIndices());
      copiedPages.forEach((page) => {
        pdfDoc.addPage(page);
      });
    }

    const combinedPdfBytes = await pdfDoc.save();
    const combinedPdfBlob = new Blob([combinedPdfBytes], { type: 'application/pdf' });
    setCombinedPdfBlob(combinedPdfBlob);
  };

  const handleReset = () => {
    setPdfFiles([]);
    setCombinedPdfBlob(null);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        PDF Combiner
      </Typography>
      <input type="file" multiple onChange={handleFileChange} />
      <Button variant="contained" onClick={handleCombinePDFs} disabled={pdfFiles.length === 0}>
        Combine PDFs
      </Button>
      {combinedPdfBlob && (
        <div>
          <Typography variant="h6" align="center" gutterBottom>
            Combined PDF
          </Typography>
          <Link href={URL.createObjectURL(combinedPdfBlob)} download="combined.pdf">
            Download Combined PDF
          </Link>
        </div>
      )}
      {pdfFiles.length > 0 && (
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      )}
    </Container>
  );
}

export default App;
