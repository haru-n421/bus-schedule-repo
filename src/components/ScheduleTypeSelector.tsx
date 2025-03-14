import React from 'react';
import { ScheduleType } from '../types/schedule';
import styled from '@emotion/styled';

interface ScheduleTypeSelectorProps {
  currentType: ScheduleType;
  onTypeChange: (type: ScheduleType) => void;
}

const Container = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Button = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 8px;
  border: 1px solid var(--primary-color);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--primary-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  currentType,
  onTypeChange
}) => {
  return (
    <Container>
      <Button
        active={currentType === 'weekday'}
        onClick={() => onTypeChange('weekday')}
      >
        平日
      </Button>
      <Button
        active={currentType === 'saturday'}
        onClick={() => onTypeChange('saturday')}
      >
        土曜
      </Button>
      <Button
        active={currentType === 'holiday'}
        onClick={() => onTypeChange('holiday')}
      >
        日祝
      </Button>
    </Container>
  );
};

export default ScheduleTypeSelector;
