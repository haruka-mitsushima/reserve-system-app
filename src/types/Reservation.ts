export type Reservation = {
  id: number;
  title: string;
  item: { id: number; name: string };
  date: string;
  startTime: String;
  endTime: String;
  user: { id: number; name: string };
};
