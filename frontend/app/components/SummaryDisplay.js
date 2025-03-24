'use client';

import styled from 'styled-components';

const SummaryContainer = styled.div`
  margin: 2rem 0;
`;

const SummaryText = styled.p`
  white-space: pre-wrap;
`;

const SummaryDisplay = ({ summary, fullText }) => {
  return (
    <SummaryContainer>
      {summary && (
        <>
          <h2>Summary</h2>
          <SummaryText>{summary}</SummaryText>
        </>
      )}
    
    </SummaryContainer>
  );
};

export default SummaryDisplay;