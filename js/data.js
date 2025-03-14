// サンプルデータ（実際のデータに置き換えてください）
const busScheduleData = {
  routes: [
    {
      id: 'route1',
      name: '埼京線',
      schedules: {
        weekday: [
          {hour: 7, minutes: [0, 15, 30, 45]},
          {hour: 8, minutes: [0, 10, 20, 30, 40, 50]},
          {hour: 9, minutes: [0, 15, 30, 45]},
          {hour: 10, minutes: [0, 15, 30, 45]}
        ],
        saturday: [
          {hour: 8, minutes: [0, 30]},
          {hour: 9, minutes: [0, 30]},
          {hour: 10, minutes: [0, 30]}
        ],
        holiday: [
          {hour: 9, minutes: [0, 30]},
          {hour: 10, minutes: [0, 30]},
          {hour: 11, minutes: [0, 30]}
        ]
      }
    },
    {
      id: 'route2',
      name: '京浜東北線',
      schedules: {
        weekday: [
          {hour: 7, minutes: [0, 10, 20, 30, 40, 50]},
          {hour: 8, minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]},
          {hour: 9, minutes: [0, 10, 20, 30, 40, 50]},
          {hour: 10, minutes: [0, 10, 20, 30, 40, 50]}
        ],
        saturday: [
          {hour: 8, minutes: [0, 15, 30, 45]},
          {hour: 9, minutes: [0, 15, 30, 45]},
          {hour: 10, minutes: [0, 15, 30, 45]}
        ],
        holiday: [
          {hour: 9, minutes: [0, 20, 40]},
          {hour: 10, minutes: [0, 20, 40]},
          {hour: 11, minutes: [0, 20, 40]}
        ]
      }
    }
  ],
  holidays: [
    '2025-01-01',
    '2025-03-21'
  ]
};

export { busScheduleData };
