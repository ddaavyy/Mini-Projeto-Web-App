import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import type { FormValues, Operation } from "@/types/types";
import { operationSchema } from "@/validations/operations";

const defaultValues: FormValues = {
  name: "",
  date: null,
  type: "buy",
  price: 0,
  quantity: 0,
  fee: 0,
};

type Props = {
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>;
};

export function useOperationsForm({ setOperations }: Props) {
  const [editingOp, setEditingOp] = useState<Operation | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(operationSchema),
  });

  const openAdd = () => {
    setEditingOp(null);
    reset(defaultValues);
    setModalVisible(true);
  };

  const openEdit = (op: Operation) => {
    setEditingOp(op);
    reset({
      name: op.name,
      date: op.date,
      type: op.type,
      price: op.price,
      quantity: op.quantity,
      fee: op.fee,
    });
    setModalVisible(true);
  };

  const onSubmit = (data: FormValues) => {
    if (editingOp) {
      setOperations((ops) =>
        ops.map((o) => (o.id === editingOp.id ? { ...o, ...data } : o))
      );
    } else {
      setOperations((ops) => [...ops, { id: uuidv4(), ...data }]);
    }
    setModalVisible(false);
  };

  const onDelete = (id: string) => {
    Modal.confirm({
      title: "Confirmar exclusão?",
      onOk: () => setOperations((ops) => ops.filter((o) => o.id !== id)),
      okButtonProps: {
        style: {
          backgroundColor: "#000",
          borderColor: "#000",
          color: "#fff",
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "#333";
          e.currentTarget.style.borderColor = "#333";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "#000";
          e.currentTarget.style.borderColor = "#000";
        },
      },
      cancelButtonProps: {
        style: { color: "#555" },
        onMouseEnter: (e) => {
          e.currentTarget.style.borderColor = "#919191";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.borderColor = "#dbdbdb";
        },
      },
    });
  };

  const submitForm = () => {
    handleSubmit(onSubmit)();
  };

  return {
    editingOp,
    setEditingOp,
    isModalVisible,
    setModalVisible,
    control,
    errors,
    handleSubmit,
    openAdd,
    openEdit,
    onSubmit,
    onDelete,
    submitForm,
  };
}
