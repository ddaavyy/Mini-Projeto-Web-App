import { fireEvent, render, screen } from "@testing-library/react";

import { useOperationsChart } from "@/hooks/useOperationsChart";

import OperationsChart from "../OperationsChart";

jest.mock("@/hooks/useOperationsChart");
const useOperationsChartMock = useOperationsChart as jest.MockedFunction<
  typeof useOperationsChart
>;

jest.mock("recharts", () => {
  return {
    ResponsiveContainer: () => <div data-testid="responsive-container" />,
    ComposedChart: () => <div data-testid="composed-chart" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Area: () => <div data-testid="area" />,
    Line: () => <div data-testid="line" />,
  };
});

describe("OperationsChart", () => {
  const mockSetZoomRange = jest.fn();
  const mockSetHelpVisible = jest.fn();
  const mockFormatValue = jest.fn((v: number) => v.toFixed(2));

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
    formatValue: mockFormatValue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useOperationsChartMock.mockReturnValue(baseHookReturn);
  });

  it("renders legend items", () => {
    render(<OperationsChart operations={[]} />);
    ["IR Devido", "PA", "PM", "QM", "RA"].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("opens help modal when question icon is clicked", () => {
    render(<OperationsChart operations={[]} />);
    const helpIcon = screen.getByTitle("Ajuda sobre as variáveis");
    fireEvent.click(helpIcon);
    expect(mockSetHelpVisible).toHaveBeenCalledWith(true);
  });

  it("displays variable descriptions when helpVisible=true", () => {
    useOperationsChartMock.mockReturnValue({
      ...baseHookReturn,
      helpVisible: true,
    });
    render(<OperationsChart operations={[]} />);

    expect(screen.getByText("Descrição das Variáveis")).toBeInTheDocument();
    expect(screen.getByText(/ir/)).toBeInTheDocument();
    expect(screen.getByText(/desc IR/)).toBeInTheDocument();
    expect(screen.getByText(/pa/)).toBeInTheDocument();
    expect(screen.getByText(/desc PA/)).toBeInTheDocument();
  });
});
