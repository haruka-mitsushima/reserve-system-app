import { Reservation } from "./Reservation";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  reservedItem: Reservation[]
;}
