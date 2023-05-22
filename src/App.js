import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FileUploader } from 'react-drag-drop-files';
import { FileDropBox, StyledGrid, Wrapper } from './styled';

const translations = {
  en: {
    add_files: 'Add files',
    pdf_combiner: 'PDF Combiner',
    combine_pdfs: 'Combine PDFs',
    download_combined_pdf: 'Download Combined PDF',
    reset: 'Reset payload',
    upload: 'Click or drop to Upload'
  }
};

function PDFThumbnailList({ pdfFiles }) {
  return (
    <div>
      {pdfFiles.map((file, index) => (
        <div key={index}>{file.name}</div>
      ))}
    </div>
  );
}

function App() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [combinedPdfBlob, setCombinedPdfBlob] = useState(null);

  const handleFileChange = (files) => {
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

  const handleDownloadPDF = async () => {
    await handleCombinePDFs();

    if (combinedPdfBlob) {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(combinedPdfBlob);
      downloadLink.download = 'combined.pdf';
      downloadLink.click();
    }
  };

  const handleReset = () => {
    setPdfFiles([]);
    setCombinedPdfBlob(null);
  };

  let FILE_TYPES = ['PDF'];
  return (
    <Wrapper container>
      <Typography variant="h4" align="center" gutterBottom>
        {translations.en.pdf_combiner}
      </Typography>
      <StyledGrid container>
        <StyledGrid item xs={12}>
          <Button
            variant="contained"
            onClick={handleDownloadPDF}
            disabled={pdfFiles.length === 0}
            sx={{ marginRight: 2 }}
          >
            {translations.en.download_combined_pdf}
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={pdfFiles.length === 0}
            color="error"
          >
            {translations.en.reset}
          </Button>
        </StyledGrid>
        <FileUploader multiple handleChange={handleFileChange} name="file" types={FILE_TYPES}>
          <StyledGrid item xs={12}>
            <FileDropBox>
              <Typography variant="h6" align="center" gutterBottom>
                {translations.en.upload}
              </Typography>
              <PDFThumbnailList pdfFiles={pdfFiles} />
            </FileDropBox>
          </StyledGrid>
        </FileUploader>
      </StyledGrid>
    </Wrapper>
  );
}

export default App;
