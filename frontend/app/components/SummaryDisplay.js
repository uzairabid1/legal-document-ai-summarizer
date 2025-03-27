'use client';

import styled, { keyframes } from 'styled-components';

// Fade-in animation for the title
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade-in animation for the text
const fadeInText = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SummaryContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(145deg, #2d3748, #374151); /* Subtle gradient background */
  border-radius: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem; /* Slightly smaller for elegance */
  font-weight: 400; /* Lighter weight for a refined look */
  font-family: 'Neue Haas Grotesk', sans-serif;
  color: #60a5fa; /* Match the app's gradient theme */
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  animation: ${fadeIn} 0.5s ease forwards; /* Fade-in animation */
  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: #60a5fa; /* Decorative underline */
    border-radius: 1px;
  }
`;

const SummaryText = styled.p`
  white-space: pre-wrap;
  color: #d1d5db;
  font-size: 0.95rem;
  line-height: 1.6; /* Better readability */
  text-align: left;
  background: rgba(255, 255, 255, 0.05); /* Subtle background for contrast */
  padding: 1rem;
  border-radius: 0.5rem;
  &:hover {
    transform: translateY(-5px) ease; /* Slight lift on hover */
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4); /* Enhanced shadow on hover */
  }
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  animation: ${fadeInText} 0.7s ease forwards; /* Fade-in animation */
`;

const SummaryDisplay = ({ summary, fullText }) => {
  return (
    <SummaryContainer>
      {summary && (
        <>
          <SummaryTitle>Summary</SummaryTitle>
          <SummaryText>{summary}</SummaryText>
        </>
      )}
    </SummaryContainer>
  );
};

export default SummaryDisplay;