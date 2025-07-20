import type { ValidationError } from "yup";

import { operationSchema } from "../operations";

describe("operationSchema", () => {
  const validData = {
    name: "PETR4",
    date: new Date(),
    type: "buy" as const,
    price: 12.5,
    quantity: 100,
    fee: 2.3,
  };

  it("should validate a correct object", () => {
    expect(() => {
      operationSchema.validateSync(validData, { abortEarly: false });
    }).not.toThrow();
  });

  it("should require name", () => {
    const data = { ...validData, name: "" };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Nome da ação é obrigatório");
  });

  it("should require date when missing", () => {
    const data = { ...validData, date: null };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Data da operação é obrigatória");
  });

  it("should enforce type oneOf", () => {
    const data = { ...validData, type: "hold" as string };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Tipo inválido");
  });

  it("should require a non-negative price", () => {
    const data = { ...validData, price: -5 };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Preço não pode ser negativo");
  });

  it("should require price to be a number", () => {
    const data = { ...validData, price: "abc" as string };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Preço deve ser um número");
  });

  it("should require quantity ≥1", () => {
    const data = { ...validData, quantity: 0 };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Quantidade deve ser ao menos 1");
  });

  it("should require fee ≥0", () => {
    const data = { ...validData, fee: -1 };
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync(data, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toContain("Taxa não pode ser negativa");
  });

  it("should require all fields", () => {
    let err: ValidationError | null = null;
    try {
      operationSchema.validateSync({} as string, { abortEarly: false });
    } catch (e) {
      err = e as ValidationError;
    }
    expect(err).not.toBeNull();
    expect(err!.errors).toEqual(
      expect.arrayContaining([
        "Nome da ação é obrigatório",
        "Data da operação é obrigatória",
        "Tipo é obrigatório",
        "Preço é obrigatório",
        "Quantidade é obrigatória",
        "Taxa é obrigatória",
      ])
    );
  });
});
