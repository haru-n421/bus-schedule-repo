import { Route, ScheduleType, BusScheduleData } from '../types/schedule';

export const formatDate = (date: Date): string => {
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = dayNames[date.getDay()];
  return `${month}/${day}(${dayName})`;
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const calculateWaitingTime = (currentTime: Date, nextDepartureTime: Date): number => {
  const diff = nextDepartureTime.getTime() - currentTime.getTime();
  return Math.floor(diff / (1000 * 60));
};

export const findNextDepartures = (
  route: Route,
  currentDate: Date,
  scheduleType: ScheduleType
): Date[] => {
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const schedule = route.schedules[scheduleType];
  const nextDepartures: Date[] = [];

  for (const timeSlot of schedule) {
    for (const minute of timeSlot.minutes) {
      const departureTime = new Date(currentDate);
      departureTime.setHours(timeSlot.hour, minute, 0, 0);
      
      if (departureTime > currentDate) {
        nextDepartures.push(departureTime);
        if (nextDepartures.length >= 2) {
          return nextDepartures;
        }
      }
    }
  }

  if (nextDepartures.length < 2 && schedule.length > 0) {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(schedule[0].hour, schedule[0].minutes[0], 0, 0);
    nextDepartures.push(tomorrow);
  }

  return nextDepartures;
};

export const determineScheduleType = (
  date: Date,
  busScheduleData: BusScheduleData
): ScheduleType => {
  const day = date.getDay();
  const dateString = date.toISOString().split('T')[0];
  
  if (busScheduleData.holidays.includes(dateString)) {
    return 'holiday';
  }
  if (day === 6) {
    return 'saturday';
  }
  if (day === 0) {
    return 'holiday';
  }
  return 'weekday';
};
