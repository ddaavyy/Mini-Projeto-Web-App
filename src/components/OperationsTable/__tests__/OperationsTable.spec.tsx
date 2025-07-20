/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent,render } from "@testing-library/react";
import type { ColumnsType, ColumnType } from "antd/es/table";
import moment from "moment";
import React from "react";
import type { Control, FieldErrors } from "react-hook-form";

import OperationsTable from "@/components/OperationsTable/OperationsTable";
import { useOperationsForm } from "@/hooks/useOperationsForm";
import type { Operation } from "@/types/types";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: (props: any) =>
      props.render({
        field: { name: props.name, onChange: () => {}, value: undefined },
      }),
  };
});

let capturedColumns: ColumnsType<Operation> = [];

jest.mock("antd", () => {
  const FakeForm: React.FC<any> & {
    Item: React.FC<any>;
    _InternalForm: React.FC<any>;
  } = (props) => <div>{props.children}</div>;
  FakeForm.Item = (props) => <div>{props.children}</div>;
  FakeForm._InternalForm = (props) => <div>{props.children}</div>;

  return {
    Table: (props: { columns: ColumnsType<Operation> }) => {
      capturedColumns = props.columns;
      return <div data-testid="table" />;
    },
    Dropdown: (props: any) => <>{props.children}</>,
    Button: (props: any) => <button {...props}>{props.children}</button>,
    Modal: (props: any) =>
      props.open ? (
        <div data-testid="modal">
          {props.children}
          <button onClick={props.onCancel}>{props.cancelText}</button>
          <button onClick={props.onOk}>{props.okText}</button>
        </div>
      ) : null,
    Form: FakeForm,
    Input: (props: any) => (
      <input data-testid={`input-${props.name}`} {...props} />
    ),
    DatePicker: (props: any) => (
      <input data-testid={`input-${props.name}`} {...props} />
    ),
    Select: (props: any) => (
      <select data-testid={`select-${props.name}`} {...props} />
    ),
    InputNumber: (props: any) => (
      <input data-testid={`input-${props.name}`} {...props} />
    ),
    EllipsisOutlined: () => <span>⋯</span>,
  };
});

jest.mock("@/hooks/useOperationsForm");
const useOperationsFormMock = useOperationsForm as jest.MockedFunction<
  typeof useOperationsForm
>;

interface FormValues {
  name: string;
  date: moment.Moment;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  fee: number;
}

const mockOpenAdd = jest.fn();
const mockOpenEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockSetModalVisible = jest.fn();
const mockSubmitForm = jest.fn();

const baseHookReturn = {
  editingOp: null as Operation | null,
  isModalVisible: false,
  control: {} as Control<FormValues>,
  errors: {} as FieldErrors<FormValues>,
  openAdd: mockOpenAdd,
  openEdit: mockOpenEdit,
  onDelete: mockOnDelete,
  setModalVisible: mockSetModalVisible,
  submitForm: mockSubmitForm,
} as unknown as ReturnType<typeof useOperationsForm>;

describe("OperationsTable — cobertura completa", () => {
  const op1: Operation = {
    id: "1",
    name: "PETR4",
    date: moment("2025-01-01", "YYYY-MM-DD"),
    type: "buy",
    price: 10.5,
    quantity: 100,
    fee: 1.25,
  };
  const op2: Operation = {
    id: "2",
    name: "VALE3",
    date: moment("2025-02-01", "YYYY-MM-DD"),
    type: "sell",
    price: 20,
    quantity: 50,
    fee: 0.75,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useOperationsFormMock.mockReturnValue(baseHookReturn);
    capturedColumns = [];
  });

  it("renderiza botão de adicionar quando não há operações", () => {
    const { getByText } = render(
      <OperationsTable operations={[]} setOperations={() => {}} />
    );
    fireEvent.click(getByText("+ Adicionar Ação"));
    expect(mockOpenAdd).toHaveBeenCalled();
  });

  it("renderiza tabela, dataSource e botão de adicionar quando há operações", () => {
    const { getByTestId, getByText } = render(
      <OperationsTable operations={[op1]} setOperations={() => {}} />
    );
    expect(getByTestId("table")).toBeInTheDocument();
    const addBtn = getByText("+ Adicionar Ação");
    fireEvent.click(addBtn);
    expect(mockOpenAdd).toHaveBeenCalled();
  });

  it("configura corretamente as colunas, incluindo chaves e filtros", () => {
    render(<OperationsTable operations={[op1]} setOperations={() => {}} />);
    const keys = capturedColumns.map((col) => col.key as string);
    expect(keys).toEqual([
      "name",
      "date",
      "type",
      "price",
      "quantity",
      "fee",
      "actions",
    ]);
    const typeCol = capturedColumns.find(
      (c) => c.key === "type"
    )! as ColumnType<Operation>;
    expect(typeCol.filters).toEqual([
      { text: "Compra", value: "buy" },
      { text: "Venda", value: "sell" },
    ]);
    expect(typeCol.onFilter).toBeDefined();
  });

  it("todos os sorters funcionam corretamente", () => {
    render(
      <OperationsTable operations={[op1, op2]} setOperations={() => {}} />
    );
    const getSorter = (key: string) =>
      (
        capturedColumns.find((c) => c.key === key)! as ColumnType<Operation> & {
          sorter: (a: Operation, b: Operation) => number;
        }
      ).sorter;
    expect(getSorter("name")(op1, op2)).toBeLessThan(0);
    expect(getSorter("date")(op1, op2)).toBeLessThan(0);
    expect(getSorter("price")(op1, op2)).toBeLessThan(0);
    expect(getSorter("quantity")(op1, op2)).toBeGreaterThan(0);
    expect(getSorter("fee")(op1, op2)).toBeGreaterThan(0);
  });

  it("funções de renderização das colunas retornam valor formatado", () => {
    render(<OperationsTable operations={[op1]} setOperations={() => {}} />);
    const dateCol = capturedColumns.find(
      (c) => c.key === "date"
    )! as ColumnType<Operation> & {
      render: (v: moment.Moment) => string;
    };
    expect(dateCol.render(op1.date!)).toBe("01/01/2025");
    const typeCol = capturedColumns.find(
      (c) => c.key === "type"
    )! as ColumnType<Operation> & {
      render: (v: Operation["type"]) => string;
    };
    expect(typeCol.render("buy")).toBe("Compra");
    expect(typeCol.render("sell")).toBe("Venda");
    const priceCol = capturedColumns.find(
      (c) => c.key === "price"
    )! as ColumnType<Operation> & {
      render: (v: number) => string;
    };
    expect(priceCol.render(3.1415)).toBe("R$ 3,14");
    const feeCol = capturedColumns.find(
      (c) => c.key === "fee"
    )! as ColumnType<Operation> & {
      render: (v: number) => string;
    };
    expect(feeCol.render(2.718)).toBe("R$ 2,72");
  });

  it("onFilter da coluna 'type' funciona corretamente", () => {
    render(<OperationsTable operations={[op1]} setOperations={() => {}} />);
    const typeCol = capturedColumns.find(
      (c) => c.key === "type"
    )! as ColumnType<Operation> & {
      onFilter: (v: string, rec: Operation) => boolean;
    };
    expect(typeCol.onFilter!("buy", op1)).toBe(true);
    expect(typeCol.onFilter!("sell", op1)).toBe(false);
  });

  it("chama openEdit e onDelete via render da coluna de ações", () => {
    render(<OperationsTable operations={[op1]} setOperations={() => {}} />);
    const actionsCol = capturedColumns.find(
      (c) => c.key === "actions"
    )! as ColumnType<Operation> & {
      render: (_: unknown, rec: Operation) => React.ReactElement<any>;
    };
    const element = actionsCol.render(undefined, op1);
    const onClick = element.props.menu.onClick;
    onClick({ key: "edit" });
    expect(mockOpenEdit).toHaveBeenCalledWith(op1);
    onClick({ key: "delete" });
    expect(mockOnDelete).toHaveBeenCalledWith(op1.id);
  });

  it("renderiza formulário do modal com campos controlados e botões funcionais", () => {
    useOperationsFormMock.mockReturnValue({
      ...baseHookReturn,
      isModalVisible: true,
    });
    const { getByTestId, getByText } = render(
      <OperationsTable operations={[]} setOperations={() => {}} />
    );
    ["name", "date", "type", "price", "quantity", "fee"].forEach((field) => {
      const testId = field === "type" ? `select-${field}` : `input-${field}`;
      expect(getByTestId(testId)).toBeInTheDocument();
    });
    fireEvent.click(getByText("Cancelar"));
    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
    fireEvent.click(getByText("Adicionar"));
    expect(mockSubmitForm).toHaveBeenCalled();
  });
});
