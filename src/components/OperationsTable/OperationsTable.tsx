import React from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Dropdown,
  Form,
  type MenuProps,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import type { Moment } from "moment";
import type { Operation } from "@/types/types";
import { useOperationsForm } from "@/hooks/useOperationsForm";

type Props = {
  operations: Operation[];
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>;
};

export default function OperationsTable({ operations, setOperations }: Props) {
  const {
    editingOp,
    isModalVisible,
    control,
    handleSubmit,
    openAdd,
    openEdit,
    onSubmit,
    onDelete,
    setModalVisible,
  } = useOperationsForm({ setOperations });

  const columns = [
    { title: "Ação", dataIndex: "name", key: "name" },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (date: Moment) => date.format("DD/MM/YYYY"),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (t: "buy" | "sell") => (t === "buy" ? "Compra" : "Venda"),
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      render: (v: number) => v.toFixed(2),
    },
    { title: "Quantidade", dataIndex: "quantity", key: "quantity" },
    {
      title: "Taxa",
      dataIndex: "fee",
      key: "fee",
      render: (v: number) => v.toFixed(2),
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
              columns={columns}
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
        onOk={handleSubmit(onSubmit)}
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
        <Form layout="vertical">
          <Form.Item label="Nome da Ação" required>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: PETR4" />
              )}
            />
          </Form.Item>

          <Form.Item label="Data da Operação" required>
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

          <Form.Item label="Tipo" required>
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

          <Form.Item label="Preço da Ação (R$)" required>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  min={0}
                  step={0.01}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Quantidade" required>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} style={{ width: "100%" }} min={0} />
              )}
            />
          </Form.Item>

          <Form.Item label="Taxa de Corretagem (R$)" required>
            <Controller
              name="fee"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  min={0}
                  step={0.01}
                />
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
