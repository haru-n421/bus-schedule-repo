import { busScheduleData } from './data.js';

// 定数
const UPDATE_INTERVAL = 60000; // 1分
const DAYS = ['日', '月', '火', '水', '木', '金', '土'];

// DOM要素
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const routesContainer = document.getElementById('routes-container');
const scheduleTypeButtons = document.querySelectorAll('.schedule-type-btn');
const refreshButton = document.getElementById('refresh-button');
const routeSelect = document.getElementById('route-select');

// 状態管理
let currentScheduleType = 'weekday';
let selectedRoute = null;

// 日付のフォーマット
function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = DAYS[date.getDay()];
    return `${month}/${day}(${dayName})`;
}

// 時刻のフォーマット
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 待ち時間の計算
function calculateWaitingTime(currentTime, departureTime) {
    const diff = departureTime - currentTime;
    return Math.floor(diff / 60000); // ミリ秒から分に変換
}

// スケジュールタイプの判定
function determineScheduleType(date) {
    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split('T')[0];
    
    if (busScheduleData.holidays.includes(dateString)) {
        return 'holiday';
    }
    if (dayOfWeek === 6) {
        return 'saturday';
    }
    if (dayOfWeek === 0) {
        return 'holiday';
    }
    return 'weekday';
}

// 次の発車時刻を探す
function findNextDepartures(route, currentTime, scheduleType) {
    const schedule = route.schedules[scheduleType];
    const departures = [];
    const now = currentTime.getTime();

    for (const timeSlot of schedule) {
        for (const minute of timeSlot.minutes) {
            const departureDate = new Date(currentTime);
            departureDate.setHours(timeSlot.hour, minute, 0, 0);
            const departureTime = departureDate.getTime();

            if (departureTime >= now) {
                departures.push({
                    time: departureDate,
                    waiting: calculateWaitingTime(now, departureTime)
                });
                if (departures.length === 2) break;
            }
        }
        if (departures.length === 2) break;
    }

    return departures;
}

// 路線選択プルダウンの初期化
function initializeRouteSelect() {
    busScheduleData.routes.forEach(route => {
        const option = document.createElement('option');
        option.value = route.id;
        option.textContent = route.name;
        routeSelect.appendChild(option);
    });
}

// 画面の更新
function updateDisplay() {
    const currentTime = new Date();
    currentDateElement.textContent = formatDate(currentTime);
    currentTimeElement.textContent = formatTime(currentTime);

    routesContainer.innerHTML = '';
    
    if (!selectedRoute) {
        routesContainer.innerHTML = '<p class="no-results">路線を選択してください</p>';
        return;
    }

    const route = busScheduleData.routes.find(r => r.id === selectedRoute);
    if (!route) {
        routesContainer.innerHTML = '<p class="no-results">選択された路線が見つかりません</p>';
        return;
    }

    const departures = findNextDepartures(route, currentTime, currentScheduleType);
    const routeElement = document.createElement('div');
    routeElement.className = 'route-info';
    
    let departureInfo = '';
    if (departures.length > 0) {
        departureInfo = departures.map(dep => `
            <p>
                <span>${formatTime(dep.time)}</span>
                <span>あと${dep.waiting}分</span>
            </p>
        `).join('');
    } else {
        departureInfo = '<p>本日の運行は終了しました</p>';
    }

    routeElement.innerHTML = `
        <h3>${route.name}</h3>
        <div class="departure-info">
            ${departureInfo}
        </div>
    `;
    
    routesContainer.appendChild(routeElement);
}

// イベントリスナーの設定
routeSelect.addEventListener('change', (e) => {
    selectedRoute = e.target.value;
    updateDisplay();
});

scheduleTypeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        scheduleTypeButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentScheduleType = e.target.dataset.type;
        updateDisplay();
    });
});

refreshButton.addEventListener('click', updateDisplay);

// 初期化と定期更新
initializeRouteSelect();
updateDisplay();
setInterval(updateDisplay, UPDATE_INTERVAL);
