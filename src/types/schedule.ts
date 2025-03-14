export type TimeSlot = {
  hour: number;
  minutes: number[];
};

export type Schedule = {
  weekday: TimeSlot[];
  saturday: TimeSlot[];
  holiday: TimeSlot[];
};

export type Route = {
  id: string;
  name: string;
  schedules: Schedule;
};

export type BusScheduleData = {
  routes: Route[];
  holidays: string[];
};

export type ScheduleType = 'weekday' | 'saturday' | 'holiday';
