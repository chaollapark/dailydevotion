export interface Letter {
  id: number;
  filename: string;
  recipient: string;
  letter_date: string;  // ISO date: "1970-07-14"
  month_day: string;    // "07-14"
  year_short: string;   // "70"
  title: string;
  location: string;
  body: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}
