import * as yup from "yup";

export const operationSchema = yup.object({
  name: yup.string().required("Nome da ação é obrigatório"),
  date: yup
    .mixed()
    .typeError("Data é obrigatória")
    .required("Data da operação é obrigatória"),
  type: yup
    .mixed<"buy" | "sell">()
    .oneOf(["buy", "sell"], "Tipo inválido")
    .required("Tipo é obrigatório"),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .min(0, "Preço não pode ser negativo")
    .required("Preço é obrigatório"),
  quantity: yup
    .number()
    .typeError("Quantidade deve ser um número")
    .min(1, "Quantidade deve ser ao menos 1")
    .required("Quantidade é obrigatória"),
  fee: yup
    .number()
    .typeError("Taxa deve ser um número")
    .min(0, "Taxa não pode ser negativa")
    .required("Taxa é obrigatória"),
});
