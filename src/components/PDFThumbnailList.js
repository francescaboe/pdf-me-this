import React from 'react';

function PDFThumbnailList({ pdfFiles }) {
  return (
    <div>
      {pdfFiles.map((file, index) => (
        <div key={index}>{file.name}</div>
      ))}
    </div>
  );
}
export default PDFThumbnailList;
