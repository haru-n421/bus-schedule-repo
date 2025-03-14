import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { BusScheduleData, ScheduleType } from './types/schedule';
import { formatDate, formatTime, determineScheduleType } from './utils/scheduleUtils';
import RouteCard from './components/RouteCard';
import ScheduleTypeSelector from './components/ScheduleTypeSelector';
import { busScheduleData } from './data';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CurrentTime = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [scheduleType, setScheduleType] = useState<ScheduleType>('weekday');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 30000); // 30秒ごとに更新

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const autoType = determineScheduleType(currentDate, busScheduleData);
    setScheduleType(autoType);
  }, [currentDate]);

  const handleRefresh = () => {
    setCurrentDate(new Date());
  };

  return (
    <Container>
      <Header>
        <CurrentTime>
          <div>{formatDate(currentDate)}</div>
          <div>{formatTime(currentDate)}</div>
        </CurrentTime>
        <RefreshButton onClick={handleRefresh}>
          更新
        </RefreshButton>
      </Header>

      <ScheduleTypeSelector
        currentType={scheduleType}
        onTypeChange={setScheduleType}
      />

      {busScheduleData.routes.map(route => (
        <RouteCard
          key={route.id}
          route={route}
          currentDate={currentDate}
          scheduleType={scheduleType}
        />
      ))}
    </Container>
  );
};

export default App;
