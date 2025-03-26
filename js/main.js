import { formatDate } from './utils.js';

let filteredRoutes = [];
let selectedRouteId = null;
let holidays = [];
let currentPage = 0;
let allDepartures = [];
const ITEMS_PER_PAGE = 3;

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

// 全出発時刻を取得
function getAllDepartures(schedules, now) {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  let scheduleType = 'weekday';
  if (isHoliday(now)) {
    scheduleType = 'holiday';
  } else if (now.getDay() === 6) { // 土曜日
    scheduleType = 'saturday';
  }
  
  const daySchedule = schedules[scheduleType] || [];
  let departures = [];
  
  for (const schedule of daySchedule) {
    for (const minute of schedule.minutes) {
      if (schedule.hour < currentHour || 
          (schedule.hour === currentHour && minute <= currentMinute)) {
        continue;
      }
      
      departures.push({
        hour: schedule.hour,
        minute: minute
      });
    }
  }
  
  return departures.sort((a, b) => {
    if (a.hour !== b.hour) return a.hour - b.hour;
    return a.minute - b.minute;
  });
}

// 祝日かどうかを判定
function isHoliday(date) {
  const formattedDate = formatDate(date);
  return holidays.includes(formattedDate);
}

// ページャーの更新
function updatePager() {
  const prevButton = document.getElementById('prev-times');
  const nextButton = document.getElementById('next-times');
  const pageInfo = document.getElementById('page-info');
  
  prevButton.disabled = currentPage === 0;
  nextButton.disabled = (currentPage + 1) * ITEMS_PER_PAGE >= allDepartures.length;
  
  if (allDepartures.length > 0) {
    const start = currentPage * ITEMS_PER_PAGE + 1;
    const end = Math.min((currentPage + 1) * ITEMS_PER_PAGE, allDepartures.length);
    const total = allDepartures.length;
    pageInfo.textContent = `${start}-${end} / ${total}件`;
  } else {
    pageInfo.textContent = '';
  }
}

// 表示の更新
async function updateDisplay() {
  const scheduleDisplay = document.getElementById('schedule-display');
  
  if (!selectedRouteId) {
    scheduleDisplay.textContent = '路線を選択してください';
    allDepartures = [];
    updatePager();
    return;
  }
  
  const schedules = await fetchSchedule(selectedRouteId);
  if (!schedules) {
    scheduleDisplay.textContent = '時刻表データの取得に失敗しました';
    allDepartures = [];
    updatePager();
    return;
  }
  
  const now = new Date();
  allDepartures = getAllDepartures(schedules, now);
  
  if (allDepartures.length === 0) {
    scheduleDisplay.textContent = '本日の運行は終了しました';
    updatePager();
    return;
  }
  
  const start = currentPage * ITEMS_PER_PAGE;
  const pageDepartures = allDepartures.slice(start, start + ITEMS_PER_PAGE);
  
  const departureList = pageDepartures.map(dep => 
    `${dep.hour}時${dep.minute}分`
  ).join('、');
  
  scheduleDisplay.textContent = `次の出発時刻: ${departureList}`;
  updatePager();
}

// イベントリスナーの設定
document.getElementById('route-select').addEventListener('change', (e) => {
  selectedRouteId = e.target.value;
  currentPage = 0;
  updateDisplay();
});

document.getElementById('prev-times').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    updateDisplay();
  }
});

document.getElementById('next-times').addEventListener('click', () => {
  if ((currentPage + 1) * ITEMS_PER_PAGE < allDepartures.length) {
    currentPage++;
    updateDisplay();
  }
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
