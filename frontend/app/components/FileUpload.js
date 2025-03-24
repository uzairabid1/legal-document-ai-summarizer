'use client';

import { useRef } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  margin: 2rem 0;
`;

const UploadButton = styled.button`
  background-color: #fff;
  color: #000;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ccc;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <UploadContainer>
      <UploadButton onClick={handleButtonClick}>Upload PDF</UploadButton>
      <FileInput
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        onChange={handleFileChange}
      />
    </UploadContainer>
  );
};

export default FileUpload;