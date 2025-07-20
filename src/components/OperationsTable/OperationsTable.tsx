import { EllipsisOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  type MenuProps,
  Modal,
  Select,
  Table,
} from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import type { Moment } from "moment";
import React from "react";
import { Controller } from "react-hook-form";

import { useOperationsForm } from "@/hooks/useOperationsForm";
import type { Operation } from "@/types/types";

type Props = {
  operations: Operation[];
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>;
};

export default function OperationsTable({ operations, setOperations }: Props) {
  const {
    editingOp,
    isModalVisible,
    control,
    errors,
    openAdd,
    openEdit,
    onDelete,
    setModalVisible,
    submitForm,
  } = useOperationsForm({ setOperations });

  const columns = [
    {
      title: "Ação",
      dataIndex: "name",
      key: "name",
      sorter: (a: Operation, b: Operation) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (date: Moment) => date.format("DD/MM/YYYY"),
      sorter: (a: Operation, b: Operation) =>
        a.date!.valueOf() - b.date!.valueOf(),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (t: "buy" | "sell") => (t === "buy" ? "Compra" : "Venda"),
      filters: [
        { text: "Compra", value: "buy" },
        { text: "Venda", value: "sell" },
      ],
      onFilter: (value: string, record: {type: string}) => record.type === value,
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      render: (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`,
      sorter: (a: Operation, b: Operation) => a.price - b.price,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: Operation, b: Operation) => a.quantity - b.quantity,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Taxa",
      dataIndex: "fee",
      key: "fee",
      render: (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`,
      sorter: (a: Operation, b: Operation) => a.fee - b.fee,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "",
      key: "actions",
      render: (_: unknown, record: Operation) => {
        const menuProps: MenuProps = {
          items: [
            { label: "Editar", key: "edit" },
            { label: "Excluir", key: "delete" },
          ],
          onClick: ({ key }) => {
            if (key === "edit") openEdit(record);
            else onDelete(record.id);
          },
        };
        return (
          <Dropdown menu={menuProps} trigger={["click"]} arrow>
            <EllipsisOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      {operations.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Button
            type="primary"
            variant="solid"
            color="default"
            onClick={openAdd}
          >
            + Adicionar Ação
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto lg:overflow-x-hidden">
            <Table
              dataSource={operations}
              columns={columns as ColumnsType}
              rowKey="id"
              pagination={false}
              scroll={{ x: "max-content" }}
              className="min-w-full lg:min-w-0"
            />
          </div>
          <div className="mt-4">
            <Button
              type="primary"
              variant="solid"
              color="default"
              onClick={openAdd}
            >
              + Adicionar Ação
            </Button>
          </div>
        </>
      )}

      <Modal
        title={editingOp ? "Editar Operação" : "Adicionar Operação"}
        open={isModalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={submitForm}
        okText={editingOp ? "Salvar" : "Adicionar"}
        cancelText="Cancelar"
        okButtonProps={{
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
        }}
        cancelButtonProps={{
          style: { color: "#555" },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "#919191";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "#dbdbdb";
          },
        }}
      >
        <Form
          layout="vertical"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitForm();
            }
          }}
        >
          <Form.Item
            label="Nome da Ação"
            required
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: PETR4" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Data da Operação"
            required
            validateStatus={errors.date ? "error" : ""}
            help={errors.date?.message}
          >
            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Tipo"
            required
            validateStatus={errors.type ? "error" : ""}
            help={errors.type?.message}
          >
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "Compra", value: "buy" },
                    { label: "Venda", value: "sell" },
                  ]}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Preço da Ação (R$)"
            required
            validateStatus={errors.price ? "error" : ""}
            help={errors.price?.message}
          >
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  min={0}
                  step={0.01}
                  formatter={(value) =>
                    value !== undefined ? String(value).replace(".", ",") : ""
                  }
                  parser={(display) =>
                    display ? Number(display.replace(/,/g, ".")) : 0
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Quantidade"
            required
            validateStatus={errors.quantity ? "error" : ""}
            help={errors.quantity?.message}
          >
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} style={{ width: "100%" }} min={0} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Taxa de Corretagem (R$)"
            required
            validateStatus={errors.fee ? "error" : ""}
            help={errors.fee?.message}
          >
            <Controller
              name="fee"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  min={0}
                  step={0.01}
                  formatter={(value) =>
                    value !== undefined ? String(value).replace(".", ",") : ""
                  }
                  parser={(display) =>
                    display ? Number(display.replace(/,/g, ".")) : 0
                  }
                />
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
