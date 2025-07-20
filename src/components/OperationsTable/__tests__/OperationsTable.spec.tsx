Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

import { fireEvent,render, screen } from "@testing-library/react";
import moment, { Moment } from "moment";
import type { Control, FieldErrors } from "react-hook-form";

import { useOperationsForm } from "@/hooks/useOperationsForm";
import type { Operation } from "@/types/types";

import OperationsTable from "../OperationsTable";

jest.mock("@/hooks/useOperationsForm");
const useOperationsFormMock = useOperationsForm as jest.MockedFunction<
  typeof useOperationsForm
>;

interface FormInputs {
  name: string;
  date: Moment;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  fee: number;
}

describe("OperationsTable", () => {
  const mockOpenAdd = jest.fn();
  const mockOpenEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockSetModalVisible = jest.fn();
  const mockSubmitForm = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    const mockForm = {
      editingOp: null,
      isModalVisible: false,
      control: {} as Control<FormInputs>,
      errors: {} as FieldErrors<FormInputs>,
      openAdd: mockOpenAdd,
      openEdit: mockOpenEdit,
      onDelete: mockOnDelete,
      setModalVisible: mockSetModalVisible,
      submitForm: mockSubmitForm,
    } as unknown as ReturnType<typeof useOperationsForm>;

    useOperationsFormMock.mockReturnValue(mockForm);
  });

  it("exibe botão de adicionar quando não há operações", () => {
    render(<OperationsTable operations={[]} setOperations={jest.fn()} />);
    const addBtn = screen.getByRole("button", { name: /\+ Adicionar Ação/i });
    expect(addBtn).toBeInTheDocument();

    fireEvent.click(addBtn);
    expect(mockOpenAdd).toHaveBeenCalledTimes(1);
  });

  it("renderiza as colunas e chama openAdd no botão do rodapé", () => {
    const ops: Operation[] = [
      {
        id: "op1",
        name: "PETR4",
        date: moment("2025-01-01", "YYYY-MM-DD"),
        type: "buy",
        price: 10.5,
        quantity: 100,
        fee: 1.25,
      },
    ];
    const setOps = jest.fn();

    render(<OperationsTable operations={ops} setOperations={setOps} />);

    expect(screen.getByText("PETR4")).toBeInTheDocument();
    expect(screen.getByText("01/01/2025")).toBeInTheDocument();
    expect(screen.getByText("Compra")).toBeInTheDocument();
    expect(screen.getByText("R$ 10,50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("R$ 1,25")).toBeInTheDocument();

    const footerAdd = screen.getByRole("button", {
      name: /\+ Adicionar Ação/i,
    });
    fireEvent.click(footerAdd);
    expect(mockOpenAdd).toHaveBeenCalledTimes(1);
  });
});
