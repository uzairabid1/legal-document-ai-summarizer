'use client';

import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import Loader from './components/Loader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Page = () => {
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setSummary('');
    setFullText('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze-and-summarize-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(response.data.summary);
      setFullText(response.data.full_text);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Legal Summarizer AI</Title>
      <FileUpload onFileUpload={handleFileUpload} />
      {loading && <Loader />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SummaryDisplay summary={summary} fullText={fullText} />
    </Container>
  );
};

export default Page;