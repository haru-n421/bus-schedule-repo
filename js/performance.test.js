import { expect, describe, test, beforeEach } from '@jest/globals';
import {
  findNextDepartures,
  determineScheduleType,
  updateDisplay
} from './main.js';
import { busScheduleData } from './data.js';

// テスト用の大規模データセットを生成する関数
function generateLargeDataset() {
  const routes = [];
  for (let i = 0; i < 100; i++) {
    const schedule = [];
    for (let hour = 6; hour <= 23; hour++) {
      const minutes = [];
      for (let minute = 0; minute < 60; minute += 5) {
        minutes.push(minute);
      }
      schedule.push({ hour, minutes });
    }
    
    routes.push({
      id: `route-${i}`,
      name: `路線${i}`,
      schedules: {
        weekday: schedule,
        saturday: schedule,
        holiday: schedule
      }
    });
  }
  
  return {
    routes,
    holidays: ['2025-03-21', '2025-05-05']
  };
}

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

describe('Performance Tests', () => {
  describe('Data Processing Performance', () => {
    test('findNextDepartures should complete within 50ms for single route', () => {
      const testRoute = busScheduleData.routes[0];
      const testDate = new Date('2025-03-04T10:00:00');
      
      const startTime = performance.now();
      findNextDepartures(testRoute, testDate, 'weekday');
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });

    test('determineScheduleType should complete within 10ms', () => {
      const testDate = new Date('2025-03-21T10:00:00');
      
      const startTime = performance.now();
      determineScheduleType(testDate);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10);
    });
  });

  describe('Large Dataset Performance', () => {
    beforeEach(() => {
      global.busScheduleData = generateLargeDataset();
    });

    test('updateDisplay should handle 100 routes within 1000ms', () => {
      const startTime = performance.now();
      updateDisplay();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should efficiently find next departures across all routes', () => {
      const currentDate = new Date('2025-03-04T10:00:00');
      
      const startTime = performance.now();
      busScheduleData.routes.forEach(route => {
        findNextDepartures(route, currentDate, 'weekday');
      });
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  describe('Memory Usage', () => {
    test('should not exceed reasonable memory usage with large dataset', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      global.busScheduleData = generateLargeDataset();
      updateDisplay();
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      expect(memoryIncrease).toBeLessThan(50); // 50MB以内に収める
    });
  });
});
