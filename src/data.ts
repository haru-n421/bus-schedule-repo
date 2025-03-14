import { BusScheduleData } from './types/schedule';

export const busScheduleData: BusScheduleData = {
  routes: [
    {
      id: "route1",
      name: "○○線",
      schedules: {
        weekday: [
          {hour: 7, minutes: [0, 15, 30, 45]},
          {hour: 8, minutes: [0, 10, 20, 30, 40, 50]},
          {hour: 9, minutes: [0, 15, 30, 45]},
          // ... 他の時間帯
        ],
        saturday: [
          {hour: 7, minutes: [0, 20, 40]},
          {hour: 8, minutes: [0, 20, 40]},
          // ... 他の時間帯
        ],
        holiday: [
          {hour: 7, minutes: [0, 30]},
          {hour: 8, minutes: [0, 30]},
          // ... 他の時間帯
        ]
      }
    },
    // 他の路線も同様に追加
  ],
  holidays: [
    "2025-01-01",
    "2025-01-13",
    "2025-02-11",
    "2025-02-23",
    "2025-03-21",
    // ... 他の祝日
  ]
};
