export interface LogActivity {
  time: number;
  category: string;
  description: string;
}

export interface DayLog {
  date: string;
  uploaded: boolean;
  activities: LogActivity[];
}