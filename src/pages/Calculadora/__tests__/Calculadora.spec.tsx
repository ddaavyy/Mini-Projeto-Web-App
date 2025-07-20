import { render, screen } from "@testing-library/react";

import Calculadora from "../Calculadora";

jest.mock("@/components/BreadcrumbNav/BreadcrumbNav", () => () => (
  <div data-testid="breadcrumb">BreadcrumbNav</div>
));
jest.mock(
  "@/components/OperationsTable/OperationsTable",
  () => (props: { operations: string; setOperations: void }) =>
    <div data-testid="operations-table">ops: {props.operations.length}</div>
);
jest.mock(
  "@/components/OperationsChart/OperationsChart",
  () => (props: { operations: string }) =>
    <div data-testid="operations-chart">chart: {props.operations.length}</div>
);

describe("Calculadora component", () => {
  beforeEach(() => {
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls window.scrollTo(0, 0) on mount", () => {
    render(<Calculadora />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("renders the main header and description", () => {
    render(<Calculadora />);
    expect(
      screen.getByRole("heading", { name: /Calculadora de IR/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Registre suas compras e vendas de ações e acompanhe cada detalhe./i
      )
    ).toBeInTheDocument();
  });

  it("renders the mocked child components", () => {
    render(<Calculadora />);
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("operations-table")).toBeInTheDocument();
    expect(screen.getByTestId("operations-chart")).toBeInTheDocument();
  });
});
