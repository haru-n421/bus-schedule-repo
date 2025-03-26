export const formatDate = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const isHoliday = (date, holidays) => {
  const dateString = date.toISOString().split('T')[0];
  return holidays.includes(dateString);
};
