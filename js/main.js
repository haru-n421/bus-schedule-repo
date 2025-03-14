import { formatDate } from './utils.js';

let filteredRoutes = [];
let selectedRouteId = null;
let holidays = [];

// 路線データの取得
async function fetchRoutes() {
  try {
    const response = await fetch('http://localhost:3000/api/routes');
    const routes = await response.json();
    filteredRoutes = routes;
    updateRouteSelect();
  } catch (error) {
    console.error('路線データの取得に失敗しました:', error);
  }
}

// 時刻表データの取得
async function fetchSchedule(routeId) {
  try {
    const response = await fetch(`http://localhost:3000/api/schedules/${routeId}`);
    const schedules = await response.json();
    return schedules;
  } catch (error) {
    console.error('時刻表データの取得に失敗しました:', error);
    return null;
  }
}

// 祝日データの取得
async function fetchHolidays() {
  try {
    const response = await fetch('http://localhost:3000/api/holidays');
    const holidays = await response.json();
    return holidays;
  } catch (error) {
    console.error('祝日データの取得に失敗しました:', error);
    return [];
  }
}

// 路線選択の更新
function updateRouteSelect() {
  const select = document.getElementById('route-select');
  select.innerHTML = '';
  
  // デフォルトオプション
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '路線を選択してください';
  select.appendChild(defaultOption);
  
  // 路線オプション
  filteredRoutes.forEach(route => {
    const option = document.createElement('option');
    option.value = route.id;
    option.textContent = route.name;
    select.appendChild(option);
  });
}

// 次の出発時刻を探す
function findNextDepartures(schedules, now) {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  let scheduleType = 'weekday';
  if (isHoliday(now)) {
    scheduleType = 'holiday';
  } else if (now.getDay() === 6) { // 土曜日
    scheduleType = 'saturday';
  }
  
  const daySchedule = schedules[scheduleType] || [];
  let nextDepartures = [];
  
  for (const schedule of daySchedule) {
    if (schedule.hour < currentHour) continue;
    
    for (const minute of schedule.minutes) {
      if (schedule.hour === currentHour && minute <= currentMinute) continue;
      
      nextDepartures.push({
        hour: schedule.hour,
        minute: minute
      });
      
      if (nextDepartures.length >= 3) break;
    }
    
    if (nextDepartures.length >= 3) break;
  }
  
  return nextDepartures;
}

// 祝日かどうかを判定
function isHoliday(date) {
  const formattedDate = formatDate(date);
  return holidays.includes(formattedDate);
}

// 表示の更新
async function updateDisplay() {
  const scheduleDisplay = document.getElementById('schedule-display');
  
  if (!selectedRouteId) {
    scheduleDisplay.textContent = '路線を選択してください';
    return;
  }
  
  const schedules = await fetchSchedule(selectedRouteId);
  if (!schedules) {
    scheduleDisplay.textContent = '時刻表データの取得に失敗しました';
    return;
  }
  
  const now = new Date();
  const nextDepartures = findNextDepartures(schedules, now);
  
  if (nextDepartures.length === 0) {
    scheduleDisplay.textContent = '本日の運行は終了しました';
    return;
  }
  
  const departureList = nextDepartures.map(dep => 
    `${dep.hour}時${dep.minute}分`
  ).join('、');
  
  scheduleDisplay.textContent = `次の出発時刻: ${departureList}`;
}

// イベントリスナーの設定
document.getElementById('route-select').addEventListener('change', (e) => {
  selectedRouteId = e.target.value;
  updateDisplay();
});

// 1分ごとに表示を更新
setInterval(updateDisplay, 60000);

// 初期化
async function initialize() {
  holidays = await fetchHolidays();
  await fetchRoutes();
  updateDisplay();
}

initialize();
