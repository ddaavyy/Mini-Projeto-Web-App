import { act, renderHook } from "@testing-library/react-hooks";
import moment from "moment";

import type { Operation } from "@/types/types";

import { useOperationsChart } from "../useOperationsChart";

describe("useOperationsChart hook", () => {
  const makeBuy: (
    date: string,
    price: number,
    quantity: number,
    fee?: number
  ) => Operation = (date, price, quantity, fee = 0) => ({
    id: "1",
    name: "TEST",
    date: moment(date),
    type: "buy",
    price,
    quantity,
    fee,
  });

  const makeSell: (
    date: string,
    price: number,
    quantity: number,
    fee?: number
  ) => Operation = (date, price, quantity, fee = 0) => ({
    id: "2",
    name: "TEST",
    date: moment(date),
    type: "sell",
    price,
    quantity,
    fee,
  });

  it("produces empty data when no operations", () => {
    const { result } = renderHook(() => useOperationsChart({ operations: [] }));
    expect(result.current.data).toEqual([]);
    expect(result.current.displayData).toEqual([]);
  });

  it("computes PM, QM, RA, IR, PA correctly for buy then sell", () => {
    const ops: Operation[] = [
      makeBuy("2025-01-01", 10, 2),
      makeSell("2025-01-02", 15, 1),
    ];

    const { result } = renderHook(() =>
      useOperationsChart({ operations: ops })
    );

    const [first, second] = result.current.data;

    expect(first.pm).toBeCloseTo(10, 5);
    expect(first.qm).toBe(2);
    expect(first.ra).toBe(0);
    expect(first.ir).toBe(0);
    expect(first.pa).toBe(0);

    expect(second.ra).toBeCloseTo(5, 5);
    expect(second.pm).toBeCloseTo(10, 5);
    expect(second.qm).toBe(1);
    expect(second.pa).toBeCloseTo(0, 5);
    expect(second.ir).toBeCloseTo(0.75, 5);
  });

  it("formatValue trims and pads correctly", () => {
    const { result } = renderHook(() => useOperationsChart({ operations: [] }));
    const { formatValue } = result.current;

    expect(formatValue(1)).toBe("1.00");
    expect(formatValue(1.2)).toBe("1.20");
    expect(formatValue(1.234567)).toBe("1.23457");
    expect(formatValue(1.2345)).toBe("1.2345");
    expect(formatValue(1.23)).toBe("1.23");
  });

  it("handles zoomRange to slice displayData", () => {
    const ops: Operation[] = [
      makeBuy("2025-01-01", 10, 1),
      makeBuy("2025-01-02", 20, 1),
      makeBuy("2025-01-03", 30, 1),
    ];
    const { result } = renderHook(() =>
      useOperationsChart({ operations: ops })
    );

    expect(result.current.displayData.length).toBe(3);

    act(() => {
      result.current.setZoomRange([1, 2]);
    });
    expect(result.current.displayData).toEqual(result.current.data.slice(1, 3));
  });

  it("toggles helpVisible", () => {
    const { result } = renderHook(() => useOperationsChart({ operations: [] }));
    expect(result.current.helpVisible).toBe(false);

    act(() => {
      result.current.setHelpVisible(true);
    });
    expect(result.current.helpVisible).toBe(true);
  });

  it("exposes variableDescriptions correctly", () => {
    const { result } = renderHook(() => useOperationsChart({ operations: [] }));
    expect(result.current.variableDescriptions).toMatchObject({
      IR: "Imposto de Renda Devido",
      PA: "Prejuízo Acumulado",
      PM: "Preço Médio",
      QM: "Quantidade Média",
      RA: "Resultado Auferido",
    });
  });
});
