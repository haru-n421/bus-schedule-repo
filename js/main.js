import { busScheduleData } from './data.js';

let currentScheduleType = 'weekday';

// 日付をフォーマットする関数
function formatDate(date) {
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = dayNames[date.getDay()];
  return `${month}/${day}(${dayName})`;
}

// 時刻をフォーマットする関数
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 待ち時間を計算する関数（分単位）
function calculateWaitingTime(currentTime, departureTime) {
  return Math.round((departureTime - currentTime) / (1000 * 60));
}

// 次の出発時刻を探す関数
function findNextDepartures(route, currentTime, scheduleType) {
  const departures = [];
  const schedule = route.schedules[scheduleType];
  
  // 現在の時刻を取得
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  // 今日の残りの時刻を探す
  for (const timeSlot of schedule) {
    if (timeSlot.hour > currentHour || 
        (timeSlot.hour === currentHour && timeSlot.minutes.some(m => m > currentMinute))) {
      for (const minute of timeSlot.minutes) {
        if (timeSlot.hour > currentHour || minute > currentMinute) {
          const departureTime = new Date(currentTime);
          departureTime.setHours(timeSlot.hour, minute, 0, 0);
          departures.push(departureTime);
          if (departures.length >= 2) break;
        }
      }
      if (departures.length >= 2) break;
    }
  }
  
  // 次の日の最初の便を追加（必要な場合）
  if (departures.length === 0 && schedule.length > 0) {
    const firstTimeSlot = schedule[0];
    const departureTime = new Date(currentTime);
    departureTime.setDate(departureTime.getDate() + 1);
    departureTime.setHours(firstTimeSlot.hour, firstTimeSlot.minutes[0], 0, 0);
    departures.push(departureTime);
  }
  
  return departures;
}

// スケジュールタイプを判定する関数
function determineScheduleType(date) {
  const day = date.getDay();
  const dateString = date.toISOString().split('T')[0];
  
  // 土曜日
  if (day === 6) return 'saturday';
  // 日曜日
  if (day === 0) return 'holiday';
  // 祝日
  if (busScheduleData.holidays.includes(dateString)) return 'holiday';
  // 平日
  return 'weekday';
}

// スケジュールタイプボタンのクリックハンドラ
function handleScheduleTypeClick(event) {
  const button = event.target;
  const type = button.getAttribute('data-type');
  
  // 既存のアクティブなボタンを非アクティブにする
  document.querySelectorAll('.schedule-type-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // クリックされたボタンをアクティブにする
  button.classList.add('active');
  
  // スケジュールタイプを更新
  currentScheduleType = type;
  
  // 表示を更新
  updateDisplay();
}

// 画面表示を更新する関数
function updateDisplay() {
  const now = new Date();
  
  // 現在の日付と時刻を表示
  document.getElementById('current-date').textContent = formatDate(now);
  document.getElementById('current-time').textContent = formatTime(now);
  
  // 出発時刻リストをクリア
  const routesContainer = document.getElementById('routes-container');
  routesContainer.innerHTML = '';
  
  // 各路線の次の出発時刻を表示
  busScheduleData.routes.forEach(route => {
    const departures = findNextDepartures(route, now, currentScheduleType);
    
    if (departures.length > 0) {
      const routeElement = document.createElement('div');
      routeElement.classList.add('route-info');
      
      const routeName = document.createElement('h3');
      routeName.textContent = route.name;
      routeElement.appendChild(routeName);
      
      const departureInfo = document.createElement('div');
      departureInfo.classList.add('departure-info');
      
      departures.forEach(departure => {
        const waitingTime = calculateWaitingTime(now, departure);
        const timeInfo = document.createElement('p');
        timeInfo.textContent = `${formatTime(departure)} (あと${waitingTime}分)`;
        departureInfo.appendChild(timeInfo);
      });
      
      routeElement.appendChild(departureInfo);
      routesContainer.appendChild(routeElement);
    }
  });
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
  // スケジュールタイプボタンにイベントリスナーを追加
  document.querySelectorAll('.schedule-type-btn').forEach(button => {
    button.addEventListener('click', handleScheduleTypeClick);
  });
  
  // 更新ボタンにイベントリスナーを追加
  document.getElementById('refresh-btn').addEventListener('click', updateDisplay);
  
  // 初期表示
  updateDisplay();
  
  // 1分ごとに自動更新
  setInterval(updateDisplay, 60000);
});

export {
  formatDate,
  formatTime,
  calculateWaitingTime,
  findNextDepartures,
  determineScheduleType,
  updateDisplay,
  currentScheduleType,
  handleScheduleTypeClick
};
