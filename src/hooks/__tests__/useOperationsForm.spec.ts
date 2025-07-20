import { act, renderHook } from "@testing-library/react-hooks";
import { Modal } from "antd";
import moment from "moment";

import { useOperationsForm } from "@/hooks/useOperationsForm";
import type { FormValues, Operation } from "@/types/types";

jest.mock("uuid", () => ({
  v4: () => "MOCK_UUID",
}));

describe("useOperationsForm hook", () => {
  let confirmSpy: jest.SpyInstance;

  beforeAll(() => {
    confirmSpy = jest.spyOn(Modal, "confirm").mockImplementation((opts) => {
      if (opts.onOk) opts.onOk();
      return {
        destroy: () => {},
        update: () => {},
      };
    });
  });

  afterAll(() => {
    confirmSpy.mockRestore();
  });

  it("openAdd: limpa edição e abre modal", () => {
    const setOps = jest.fn();
    const { result } = renderHook(() =>
      useOperationsForm({ setOperations: setOps })
    );

    expect(result.current.editingOp).toBeNull();
    expect(result.current.isModalVisible).toBe(false);

    act(() => {
      result.current.openAdd();
    });

    expect(result.current.editingOp).toBeNull();
    expect(result.current.isModalVisible).toBe(true);
  });

  it("openEdit: carrega operação no formulário e abre modal", () => {
    const setOps = jest.fn();
    const sampleOp: Operation = {
      id: "ID1",
      name: "ABC",
      date: moment("2025-07-20"),
      type: "sell",
      price: 123,
      quantity: 4,
      fee: 5,
    };
    const { result } = renderHook(() =>
      useOperationsForm({ setOperations: setOps })
    );

    act(() => {
      result.current.openEdit(sampleOp);
    });

    expect(result.current.editingOp).toEqual(sampleOp);
    expect(result.current.isModalVisible).toBe(true);
  });

  it("onSubmit sem edição: adiciona nova operação com id MOCK_UUID", () => {
    const setOps = jest.fn();
    const { result } = renderHook(() =>
      useOperationsForm({ setOperations: setOps })
    );

    const newData: FormValues = {
      name: "New",
      date: moment("2025-01-01"),
      type: "buy",
      price: 10,
      quantity: 2,
      fee: 1,
    };

    act(() => {
      result.current.onSubmit(newData);
    });

    expect(setOps).toHaveBeenCalledTimes(1);
    const updater = setOps.mock.calls[0][0] as (
      prev: Operation[]
    ) => Operation[];
    const resultArr = updater([]);
    expect(resultArr).toHaveLength(1);
    expect(resultArr[0]).toMatchObject({
      id: "MOCK_UUID",
      ...newData,
    });
    expect(result.current.isModalVisible).toBe(false);
  });

  it("onSubmit com edição: atualiza somente operação específica", () => {
    const existing: Operation = {
      id: "EX1",
      name: "Old",
      date: moment("2025-02-02"),
      type: "buy",
      price: 5,
      quantity: 1,
      fee: 0,
    };
    const setOps = jest.fn();
    const { result } = renderHook(() =>
      useOperationsForm({ setOperations: setOps })
    );

    act(() => {
      result.current.setEditingOp(existing);
    });

    const updatedData: FormValues = {
      name: "Updated",
      date: moment("2025-02-03"),
      type: "sell",
      price: 8,
      quantity: 1,
      fee: 0.5,
    };

    act(() => {
      result.current.onSubmit(updatedData);
    });

    expect(setOps).toHaveBeenCalledTimes(1);
    const updater = setOps.mock.calls[0][0] as (
      prev: Operation[]
    ) => Operation[];
    const out = updater([existing]);
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({
      id: "EX1",
      ...updatedData,
    });
    expect(result.current.isModalVisible).toBe(false);
  });

  it("onDelete: confirma e remove operação", () => {
    const existing1: Operation = {
      id: "A1",
      name: "X",
      date: moment(),
      type: "buy",
      price: 1,
      quantity: 1,
      fee: 0,
    };
    const existing2: Operation = {
      id: "B2",
      name: "Y",
      date: moment(),
      type: "sell",
      price: 2,
      quantity: 1,
      fee: 0,
    };
    const setOps = jest.fn();
    const { result } = renderHook(() =>
      useOperationsForm({ setOperations: setOps })
    );

    act(() => {
      result.current.onDelete("A1");
    });

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Confirmar exclusão?" })
    );
    expect(setOps).toHaveBeenCalledTimes(1);
    const updater = setOps.mock.calls[0][0] as (
      prev: Operation[]
    ) => Operation[];
    const filtered = updater([existing1, existing2]);
    expect(filtered).toEqual([existing2]);
  });
});
