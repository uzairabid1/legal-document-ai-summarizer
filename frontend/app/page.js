'use client';
import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import SummaryDisplay from './components/SummaryDisplay';
import Loader from './components/Loader';

// Container with a darker overlay on the background image
const Container = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/bg.jpeg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
const CopyPopup = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'visible',
})`
  position: absolute;
  top: -1.5rem; /* Adjusted for visibility */
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Gabarito', sans-serif;
  font-size: 0.9rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1000;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')}; /* Added for proper hiding */
`;

const SummaryBox = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible; /* Prevent clipping */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #1a2a44, #2d3b55);
  }
`;

// Enhanced Navbar with navigation links and professional styling
const Navbar = styled.nav`
  background: #1a2a44;
  width: 100%;
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #2d3b55;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Space between logo and text */
`;

const LogoImage = styled.img`
  width: 32px; /* Adjust size as needed */
  height: 32px;
`;

const NavTitle = styled.h1`
  color: #f3f4f6;
  font-size: 1.5rem; /* Adjusted for better balance with logo */
  font-family: 'Gabarito', sans-serif;
  font-weight: 700;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled.a`
  color: #d1d5db;
  font-size: 1rem;
  font-family: 'Gabarito', sans-serif;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: #ffd700;
  }
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  max-width: 32rem;
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  color: #1a2a44;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Gabarito', sans-serif;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #1a2a44, #2d3b55);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #ffd700;
    border-radius: 2px;
  }
`;

const Description = styled.p`
  color: #4b5563;
  font-size: 1.1rem;
  font-family: 'Gabarito', sans-serif;
  font-weight: 400;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 2rem;
`;

const DropZone = styled.label`
  border: 2px dashed #2d3b55;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.3s ease;
  &:hover {
    background-color: #e5e7eb;
    border-color: #ffd700;
    color: #1a2a44;
    svg {
      color: #1a2a44;
    }
  }
`;

const DropZoneText = styled.p`
  margin-top: 0.75rem;
  font-size: 1rem;
  color: #4b5563;
  text-align: center;
  font-family: 'Gabarito', sans-serif;
  font-weight: 500;
`;

const FilePreview = styled.div`
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: #f9fafb;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
  max-width: 100%;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background-image: url('/close.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  z-index: 20;
  &:hover {
    opacity: 0.8;
  }
`;



const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  font-family: 'Gabarito', sans-serif;
  color: #1a2a44;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: #ffd700;
    border-radius: 1px;
  }
`;

const SummaryText = styled.p`
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #1a2a44, #2d3b55);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-weight: 600;
  font-family: 'Gabarito', sans-serif;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #2d3b55, #1a2a44);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  margin-top: 1rem;
  font-family: 'Gabarito', sans-serif;
`;

const Page = () => {
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showText, setShowText] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  
  const handleFileUpload = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setSummary('');
    setFullText('');
    setPreviewImage(null);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/fetch-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'image/*',
        },
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Response is not an image');
      }

      const imageUrl = URL.createObjectURL(response.data);
      setPreviewImage(imageUrl);
      setShowText(true);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err.message || 'Failed to fetch preview image');
      if (err.response) {
        console.error('Error response:', err.response);
        setError(`Server error: ${err.response.status} - ${err.response.data}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze-and-summarize-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(response.data.summary);
      setFullText(response.data.full_text);
    } catch (err) {
      setError(err.message || 'Failed to analyze file');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerateSummary();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setShowText(false);
    setSummary('');
    setFullText('');
    setPreviewImage(null);
    setError('');
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
      .then(() => {
        setCopied(true);
        console.log("Copied set to true");
        setTimeout(() => {
          setCopied(false);
          console.log("Copied set to false");
        }, 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };
  return (
    <Container onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <Navbar>
        <NavLogo>
          {/* Replace the src with your actual logo image URL */}
          <LogoImage
            src="/logo.png"
            alt="Legal Hearing Summarizer Logo"
            width="32" // Inline width attribute
            height="32" // Inline height attribute
          />
          <NavTitle>Legal Hearing Summarizer</NavTitle>
        </NavLogo>
       
      </Navbar>
      <ContentWrapper>
        <Card>
          <Title>Summarize Legal Hearings with Ease</Title>
          <Description>
            Upload your legal hearing documents and get concise, accurate summaries powered by advanced AI technology.
          </Description>

          {!loading && !showText && !summary && (
            <DropZone htmlFor="fileInput">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
                id="fileInput"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <DropZoneText>Drag & Drop or Click to Select File</DropZoneText>
            </DropZone>
          )}

          {file && !summary && (
            <FilePreview>
              {loading ? (
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
              ) : (
                showText && (
                  <>
                    {previewImage && (
                      <ImageContainer>
                        <img
                          src={previewImage}
                          alt="File Preview"
                          className="w-full object-contain rounded-lg"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                        <RemoveButton onClick={removeFile} />
                      </ImageContainer>
                    )}
                    <p className="text-gray-600 mt-2 truncate">{file.name}</p>
                    <Button onClick={handleGenerateSummary}>Generate Summary</Button>
                  </>
                )
              )}
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FilePreview>
          )}

          {summary && (
      <SummaryBox>
      {loading ? (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      ) : (
        <>
          <SummaryDisplay summary={summary} fullText={fullText} />
          <div className="flex justify-center gap-4">
            <Button onClick={handleRegenerate}>Regenerate</Button>
            <Button onClick={handleCopy}>Copy</Button>
          </div>
          <CopyPopup visible={copied}>Copied to clipboard!</CopyPopup> {/* Fixed: Use copied state */}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      )}
    </SummaryBox>
          )}
        </Card>
      </ContentWrapper>
    </Container>
  );
};

export default Page;