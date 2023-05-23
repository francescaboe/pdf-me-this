import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material';

const BoxImg = styled(Box)`
  width: 80px;
  height: 100px;
  border-radius: 5px;
  border: 1px solid black;
  background-color: #8d8a8a;
  margin: 20px;
`;

//create fake array of 10 elements
function PDFThumbnailList({ pdfFiles }) {
  return (
    <Box>
      {pdfFiles.map((file, index) => (
        <BoxImg key={index}>{file.name}</BoxImg>
      ))}
    </Box>
  );
}
export default PDFThumbnailList;
