import type { Moment } from "moment";

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
};

export type Operation = {
  id: string;
  name: string;
  date: Moment;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  fee: number;
};

export type FormValues = Omit<Operation, "id">;

export type ChartPoint = {
  index: number;
  date: string;
  ir: number;
  pm: number;
  qm: number;
  pa: number;
  ra: number;
};
