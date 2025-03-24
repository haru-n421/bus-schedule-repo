import React, { useEffect } from 'react';
import { useSchedule } from '../hooks/useSchedule';

function ScheduleDisplay({ routeId, page, itemsPerPage, onTotalPagesChange }) {
  const { schedule, loading, error } = useSchedule(routeId);

  const getAllTimes = () => {
    if (!schedule) return [];
    
    const scheduleData = schedule[schedule.type];
    if (!scheduleData) return [];
    
    const times = [];
    for (const timeSlot of scheduleData) {
      const { hour, minutes } = timeSlot;
      for (const minute of minutes) {
        const time = {
          hour,
          minute,
          display: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        };
        times.push(time);
      }
    }
    return times.sort((a, b) => {
      if (a.hour !== b.hour) return a.hour - b.hour;
      return a.minute - b.minute;
    });
  };

  const getNextTimes = (allTimes) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return allTimes.filter(time => {
      if (time.hour > currentHour) return true;
      if (time.hour === currentHour && time.minute > currentMinute) return true;
      return false;
    });
  };

  const allTimes = getAllTimes();
  const nextTimes = getNextTimes(allTimes);

  useEffect(() => {
    const totalPages = Math.ceil(nextTimes.length / itemsPerPage);
    onTotalPagesChange(totalPages);
  }, [nextTimes.length, itemsPerPage, onTotalPagesChange]);

  if (!routeId) return <div className="schedule-display">路線を選択してください</div>;
  if (loading) return <div className="schedule-display">時刻表を読み込み中...</div>;
  if (error) return <div className="schedule-display">エラー: {error}</div>;
  if (!schedule) return <div className="schedule-display">時刻表が見つかりません</div>;

  const startIdx = page * itemsPerPage;
  const displayTimes = nextTimes.slice(startIdx, startIdx + itemsPerPage);

  const getScheduleTypeText = (type) => {
    switch (type) {
      case 'weekday':
        return '平日';
      case 'saturday':
        return '土曜';
      case 'holiday':
        return '休日';
      default:
        return '';
    }
  };

  const now = new Date();
  const currentTimeText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (nextTimes.length === 0) {
    return (
      <div className="schedule-display">
        <div className="schedule-type">
          {getScheduleTypeText(schedule.type)}ダイヤ
        </div>
        <div className="current-time">
          現在時刻: {currentTimeText}
        </div>
        <div className="no-schedule">
          本日の運行は終了しました
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-display">
      <div className="schedule-type">
        {getScheduleTypeText(schedule.type)}ダイヤ
      </div>
      <div className="current-time">
        現在時刻: {currentTimeText}
      </div>
      {displayTimes.length > 0 && (
        <div className="time-list">
          {displayTimes.map((time, index) => (
            <div key={index} className="time-entry">
              {time.display}
            </div>
          ))}
        </div>
      )}
      {nextTimes.length > itemsPerPage && (
        <div className="page-info">
          {startIdx + 1}～{Math.min(startIdx + itemsPerPage, nextTimes.length)}件目 / 全{nextTimes.length}件
        </div>
      )}
    </div>
  );
}

export default ScheduleDisplay;
