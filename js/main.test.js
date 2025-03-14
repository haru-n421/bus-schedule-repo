// main.test.js
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { jest, expect, describe, test, beforeEach, afterEach } from '@jest/globals';

import {
  formatDate,
  formatTime,
  calculateWaitingTime,
  findNextDepartures,
  determineScheduleType,
  updateDisplay,
  currentScheduleType,
  handleScheduleTypeClick
} from './main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// DOMの準備
document.body.innerHTML = fs.readFileSync(resolve(__dirname, '../index.html'), 'utf8');

// テスト用のデータを準備
const testBusScheduleData = {
  routes: [
    {
      id: 'test-route',
      name: 'テスト路線',
      schedules: {
        weekday: [
          {hour: 7, minutes: [0, 15, 30, 45]},
          {hour: 8, minutes: [0, 15, 30, 45]},
        ],
        saturday: [
          {hour: 8, minutes: [0, 30]},
        ],
        holiday: [
          {hour: 9, minutes: [0, 30]},
        ]
      }
    }
  ],
  holidays: ['2025-03-21']
};

// テスト用のデータをグローバルに設定
global.busScheduleData = testBusScheduleData;

// DOMの基本要素を準備
beforeEach(() => {
  document.body.innerHTML = `
    <div id="current-date"></div>
    <div id="current-time"></div>
    <div id="departure-list"></div>
    <div id="routes-container"></div>
    <button id="refresh-btn">更新</button>
    <div class="schedule-type-buttons">
      <button class="schedule-type-btn" data-type="weekday">平日</button>
      <button class="schedule-type-btn" data-type="saturday">土曜</button>
      <button class="schedule-type-btn" data-type="holiday">休日</button>
    </div>
  `;
});

describe('Utility Functions', () => {
  test('formatDate formats date correctly', () => {
    const testDate = new Date('2025-03-04T10:30:00');
    expect(formatDate(testDate)).toBe('3/4(火)');
  });

  test('formatTime formats time correctly', () => {
    const testDate = new Date('2025-03-04T09:05:00');
    expect(formatTime(testDate)).toBe('09:05');
  });

  test('calculateWaitingTime calculates waiting time in minutes', () => {
    const currentTime = new Date('2025-03-04T10:00:00');
    const nextDeparture = new Date('2025-03-04T10:15:00');
    expect(calculateWaitingTime(currentTime, nextDeparture)).toBe(15);
  });
});

describe('Schedule Type Detection', () => {
  test('determines weekday correctly', () => {
    const weekday = new Date('2025-03-04'); // 火曜日
    expect(determineScheduleType(weekday)).toBe('weekday');
  });

  test('determines saturday correctly', () => {
    const saturday = new Date('2025-03-08'); // 土曜日
    expect(determineScheduleType(saturday)).toBe('saturday');
  });

  test('determines sunday as holiday', () => {
    const sunday = new Date('2025-03-09'); // 日曜日
    expect(determineScheduleType(sunday)).toBe('holiday');
  });

  test('determines holiday correctly', () => {
    const holiday = new Date('2025-03-21'); // 祝日
    expect(determineScheduleType(holiday)).toBe('holiday');
  });
});

describe('Next Departures', () => {
  test('finds next two departures correctly', () => {
    const currentTime = new Date('2025-03-04T07:10:00'); // 火曜日 7:10
    const route = testBusScheduleData.routes[0];
    const departures = findNextDepartures(route, currentTime, 'weekday');
    
    expect(departures.length).toBe(2);
    expect(departures[0].getHours()).toBe(7);
    expect(departures[0].getMinutes()).toBe(15);
    expect(departures[1].getHours()).toBe(7);
    expect(departures[1].getMinutes()).toBe(30);
  });

  test('handles end of day correctly', () => {
    const currentTime = new Date('2025-03-04T23:45:00');
    const route = testBusScheduleData.routes[0];
    const departures = findNextDepartures(route, currentTime, 'weekday');
    
    expect(departures.length).toBe(1);
    expect(departures[0].getHours()).toBe(7);
    expect(departures[0].getMinutes()).toBe(0);
    expect(departures[0].getDate()).toBe(5); // 次の日
  });
});

describe('DOM Updates', () => {
  beforeEach(() => {
    // 時刻を固定
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-03-04T10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('updates display correctly', () => {
    updateDisplay();
    
    expect(document.getElementById('current-date').textContent).toBe('3/4(火)');
    expect(document.getElementById('current-time').textContent).toBe('10:00');
  });

  test('schedule type buttons work correctly', () => {
    // ボタン要素を作成
    const saturdayButton = document.createElement('button');
    saturdayButton.setAttribute('data-type', 'saturday');
    saturdayButton.classList.add('schedule-type-btn');
    document.body.appendChild(saturdayButton);

    // イベントをシミュレート
    handleScheduleTypeClick({ target: saturdayButton });
    
    expect(currentScheduleType).toBe('saturday');
    expect(saturdayButton.classList.contains('active')).toBe(true);
  });

  test('refresh button triggers display update', () => {
    // DOMイベントを設定
    const refreshButton = document.getElementById('refresh-btn');
    refreshButton.addEventListener('click', updateDisplay);

    // イベントをシミュレート
    const clickEvent = new Event('click');
    refreshButton.dispatchEvent(clickEvent);

    // 表示が更新されたことを確認
    expect(document.getElementById('current-date').textContent).toBe('3/4(火)');
    expect(document.getElementById('current-time').textContent).toBe('10:00');
  });
});
