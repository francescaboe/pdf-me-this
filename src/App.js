import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FileUploader } from 'react-drag-drop-files';
import { FileDropBox, ListContainer, MainContent, StyledGrid, WrapperColumn } from './styled';
import PDFThumbnailList from './components/PDFThumbnailList';

const translations = {
  en: {
    add_files: 'Add files',
    pdf_combiner: 'PDF Combiner',
    combine_pdfs: 'Combine PDFs',
    download_combined_pdf: 'Download Combined PDF',
    reset: 'Reset payload',
    upload: 'Click or drop to upload files',
    only_types: 'Accepts PDF, JPG, JPEG, PNG'
  }
};
const FILE_TYPES = ['PDF', 'JPG', 'JPEG', 'PNG'];

// convert image into pdf
async function convertImageToPdf(imageFile) {
  const imageArrayBuffer = await imageFile.arrayBuffer();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const image = await pdfDoc.embedJpg(imageArrayBuffer);
  const { width, height } = image.scale(1);
  const dimensions = page.getSize();
  const scale = Math.min(dimensions.width / width, dimensions.height / height);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: width * scale,
    height: height * scale
  });
  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], `${imageFile.name}.pdf`, { type: 'application/pdf' });
}

function App() {
  const [pdfFiles, setPdfFiles] = useState([]);

  // on files input
  const handleFileChange = async (files) => {
    const updatedFiles = [];

    for (const file of files) {
      if (file.type.includes('image')) {
        const convertedFile = await convertImageToPdf(file);
        updatedFiles.push(convertedFile);
      } else {
        updatedFiles.push(file);
      }
    }

    setPdfFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
  };

  // reset payload
  const handleReset = () => {
    setPdfFiles([]);
  };

  // combine all files into one
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
    return new Blob([combinedPdfBytes], { type: 'application/pdf' });
  };

  // download combined pdf
  const handleDownloadPDF = async () => {
    await handleCombinePDFs().then((combinedPdfBlob) => {
      if (combinedPdfBlob) {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(combinedPdfBlob);
        downloadLink.download = 'combined.pdf';
        downloadLink.click();
      }
    });
  };

  return (
    <WrapperColumn container>
      <Typography variant="h4" align="center" gutterBottom>
        {translations.en.pdf_combiner}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        {translations.en.only_types}
      </Typography>
      <MainContent container>
        <ListContainer item xs={2}>
          <PDFThumbnailList pdfFiles={pdfFiles} />
        </ListContainer>
        <StyledGrid container item xs={10}>
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
              </FileDropBox>
            </StyledGrid>
          </FileUploader>
        </StyledGrid>
      </MainContent>
    </WrapperColumn>
  );
}

export default App;
