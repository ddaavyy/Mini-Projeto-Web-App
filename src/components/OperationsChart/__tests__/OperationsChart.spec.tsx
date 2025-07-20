import { fireEvent, render, screen } from "@testing-library/react";
import React, { ReactElement } from "react";

import OperationsChart from "@/components/OperationsChart/OperationsChart";
import { useOperationsChart } from "@/hooks/useOperationsChart";
import type { CustomizedDotProps } from "@/types/types";

let tickFormatterFn: (x: number) => string;
let tooltipFormatterFn: (value: number, name: string) => [string, string];
let labelFormatterFn: (x: number) => string;
let capturedDotElement: ReactElement<CustomizedDotProps>;

jest.mock("@/hooks/useOperationsChart");
const useOperationsChartMock = useOperationsChart as jest.MockedFunction<
  typeof useOperationsChart
>;

jest.mock("recharts", () => {
  return {
    ResponsiveContainer: (props: {
      onClick?: () => void;
      children?: React.ReactNode;
    }) => {
      return (
        <div data-testid="responsive-container" onClick={props.onClick}>
          {props.children}
        </div>
      );
    },
    ComposedChart: (props: { children?: React.ReactNode }) => {
      return <div data-testid="composed-chart">{props.children}</div>;
    },
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: (props: { tickFormatter: (x: number) => string }) => {
      tickFormatterFn = props.tickFormatter;
      return <div data-testid="x-axis" />;
    },
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: (props: {
      formatter: (value: number, name: string) => [string, string];
      labelFormatter: (x: number) => string;
    }) => {
      tooltipFormatterFn = props.formatter;
      labelFormatterFn = props.labelFormatter;
      return <div data-testid="tooltip" />;
    },
    Area: () => <div data-testid="area" />,
    Line: (props: { dot: ReactElement<CustomizedDotProps> }) => {
      capturedDotElement = props.dot;
      return <div data-testid="line" />;
    },
  };
});

jest.mock("antd", () => ({
  Modal: ({
    open,
    onCancel,
    children,
  }: {
    open: boolean;
    onCancel: () => void;
    children: React.ReactNode;
  }) =>
    open ? (
      <div data-testid="modal">
        <button data-testid="modal-close" onClick={onCancel} />
        {children}
      </div>
    ) : null,
}));
jest.mock("@ant-design/icons", () => ({
  QuestionCircleOutlined: (props: { onClick: () => void; title: string }) => (
    <div data-testid="help-icon" {...props} />
  ),
}));

describe("OperationsChart — cobertura completa", () => {
  const mockSetZoomRange = jest.fn();
  const mockSetHelpVisible = jest.fn();

  const baseHookReturn: ReturnType<typeof useOperationsChart> = {
    data: [
      { index: 0, x: 0, ir: 1, pa: 2, pm: 3, qm: 4, ra: 5, dateLabel: "01/01" },
    ],
    displayData: [
      { index: 0, x: 0, ir: 1, pa: 2, pm: 3, qm: 4, ra: 5, dateLabel: "01/01" },
    ],
    setZoomRange: mockSetZoomRange,
    helpVisible: false,
    setHelpVisible: mockSetHelpVisible,
    variableDescriptions: { ir: "desc IR", pa: "desc PA" },
    formatValue: (v: number) => v.toFixed(2),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useOperationsChartMock.mockReturnValue(baseHookReturn);
  });

  it("clicar no fundo do gráfico chama setZoomRange(null)", () => {
    render(<OperationsChart operations={[]} />);
    fireEvent.click(screen.getByTestId("responsive-container"));
    expect(mockSetZoomRange).toHaveBeenCalledWith(null);
  });

  it("tickFormatter retorna dateLabel ou string vazia", () => {
    render(<OperationsChart operations={[]} />);
    expect(tickFormatterFn(0)).toBe("01/01");
    expect(tickFormatterFn(123)).toBe("");
  });

  it("formatter lida com QM e os outros corretamente", () => {
    render(<OperationsChart operations={[]} />);
    expect(tooltipFormatterFn(4, "QM")).toEqual(["4", "QM"]);
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(3);
    expect(tooltipFormatterFn(3, "PA")).toEqual([`R$ ${formatted}`, "PA"]);
  });

  it("labelFormatter retorna dateLabel ou string vazia", () => {
    render(<OperationsChart operations={[]} />);
    expect(labelFormatterFn(0)).toBe("01/01");
    expect(labelFormatterFn(999)).toBe("");
  });

  it("CustomizedDot retorna null quando payload é undefined", () => {
    render(
      React.cloneElement(capturedDotElement, {
        cx: 0,
        cy: 0,
        stroke: "#000",
        payload: undefined,
      })
    );
    expect(document.querySelector("circle")).toBeNull();
  });

  it("CustomizedDot renderiza <circle> e cliques mudam zoom corretamente", () => {
    render(
      React.cloneElement(capturedDotElement, {
        cx: 5,
        cy: 5,
        stroke: "#123",
        payload: { index: 0 },
      })
    );
    const circle = document.querySelector("circle")!;
    fireEvent.click(circle);
    expect(mockSetZoomRange).toHaveBeenCalledWith([0, 0]);
  });

  it("clicar no close do modal chama setHelpVisible(false)", () => {
    useOperationsChartMock.mockReturnValue({
      ...baseHookReturn,
      helpVisible: true,
    });
    render(<OperationsChart operations={[]} />);
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(mockSetHelpVisible).toHaveBeenCalledWith(false);
  });
});
