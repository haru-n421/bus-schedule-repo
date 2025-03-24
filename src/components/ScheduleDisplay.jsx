import React from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { formatDate } from '../utils/dateUtils';

function ScheduleDisplay({ routeId, page, itemsPerPage }) {
  const { schedule, loading, error } = useSchedule(routeId);

  if (!routeId) return <div className="schedule-display">路線を選択してください</div>;
  if (loading) return <div className="schedule-display">時刻表を読み込み中...</div>;
  if (error) return <div className="schedule-display">エラー: {error}</div>;
  if (!schedule) return <div className="schedule-display">時刻表が見つかりません</div>;

  const getScheduleForType = () => {
    const scheduleData = schedule[schedule.type];
    if (!scheduleData) return [];
    
    const times = [];
    for (const hour in scheduleData) {
      for (const minute of scheduleData[hour]) {
        times.push(new Date(2025, 0, 1, parseInt(hour), parseInt(minute)));
      }
    }
    return times.sort((a, b) => a - b);
  };

  const times = getScheduleForType();
  const startIdx = page * itemsPerPage;
  const displayTimes = times.slice(startIdx, startIdx + itemsPerPage);

  if (displayTimes.length === 0) {
    return <div className="schedule-display">この時間帯の運行はありません</div>;
  }

  return (
    <div className="schedule-display">
      <div className="schedule-type">
        {schedule.type === 'weekday' ? '平日' :
         schedule.type === 'saturday' ? '土曜' : '休日'}ダイヤ
      </div>
      {displayTimes.map((time, index) => (
        <div key={index} className="time-entry">
          {formatDate(time)}
        </div>
      ))}
    </div>
  );
}

export default ScheduleDisplay;
