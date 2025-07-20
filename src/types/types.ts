import type { Moment } from "moment";
import type { DotProps } from "recharts";

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
};

export type Operation = {
  id: string;
  name: string;
  date: Moment | null;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  fee: number;
};

export type FormValues = Omit<Operation, "id">;

export type ChartPoint = {
  index: number;
  x: number;
  dateLabel: string;
  ir: number;
  pm: number;
  qm: number;
  pa: number;
  ra: number;
};

type PayloadWithIndex = { index: number };

export type CustomizedDotProps = DotProps & {
  payload?: PayloadWithIndex;
};