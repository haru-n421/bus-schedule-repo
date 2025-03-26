import { useState, useEffect } from 'react';
import { fetchSchedule, fetchHolidays } from '../services/api';
import { isHoliday } from '../utils/dateUtils';

export const useSchedule = (routeId) => {
  const [schedule, setSchedule] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const holidayData = await fetchHolidays();
        setHolidays(holidayData);
      } catch (err) {
        console.error('祝日データの取得に失敗しました:', err);
        setHolidays([]);
      }
    };

    loadHolidays();
  }, []);

  useEffect(() => {
    if (!routeId) return;

    const loadSchedule = async () => {
      setLoading(true);
      try {
        const data = await fetchSchedule(routeId);
        setSchedule(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [routeId]);

  const getCurrentSchedule = () => {
    if (!schedule) return null;

    const now = new Date();
    const isToday = (date) => {
      return date.toDateString() === now.toDateString();
    };

    const today = new Date();
    const scheduleType = isHoliday(today, holidays) ? 'holiday' : 
                        today.getDay() === 0 ? 'holiday' :
                        today.getDay() === 6 ? 'saturday' : 'weekday';

    return {
      ...schedule,
      type: scheduleType
    };
  };

  return {
    schedule: getCurrentSchedule(),
    loading,
    error
  };
};
