export const fetchRoutes = async () => {
  const response = await fetch('/api/routes');
  if (!response.ok) {
    throw new Error('路線データの取得に失敗しました');
  }
  return response.json();
};

export const fetchSchedule = async (routeId) => {
  const response = await fetch(`/api/schedules/${routeId}`);
  if (!response.ok) {
    throw new Error('時刻表データの取得に失敗しました');
  }
  return response.json();
};

export const fetchHolidays = async () => {
  const response = await fetch('/api/holidays');
  if (!response.ok) {
    throw new Error('祝日データの取得に失敗しました');
  }
  return response.json();
};
