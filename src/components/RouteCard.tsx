import React from 'react';
import { Route, ScheduleType } from '../types/schedule';
import { findNextDepartures, formatTime, calculateWaitingTime } from '../utils/scheduleUtils';
import styled from '@emotion/styled';

interface RouteCardProps {
  route: Route;
  currentDate: Date;
  scheduleType: ScheduleType;
}

const Card = styled.div`
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RouteName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const DepartureInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const Time = styled.span`
  font-weight: bold;
  color: var(--primary-color);
`;

const WaitingTime = styled.span`
  color: #666;
`;

const RouteCard: React.FC<RouteCardProps> = ({ route, currentDate, scheduleType }) => {
  const nextDepartures = findNextDepartures(route, currentDate, scheduleType);

  if (nextDepartures.length === 0) {
    return (
      <Card>
        <RouteName>{route.name}</RouteName>
        <DepartureInfo>本日の運行は終了しました</DepartureInfo>
      </Card>
    );
  }

  return (
    <Card>
      <RouteName>{route.name}</RouteName>
      {nextDepartures.map((departure, index) => {
        const waitingTime = calculateWaitingTime(currentDate, departure);
        const timeLabel = index === 0 ? '次発' : '次々発';
        return (
          <DepartureInfo key={index}>
            <span>
              {timeLabel}: <Time>{formatTime(departure)}</Time>
            </span>
            <WaitingTime>あと{waitingTime}分</WaitingTime>
          </DepartureInfo>
        );
      })}
    </Card>
  );
};

export default RouteCard;
