import { QuestionCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useOperationsChart } from "@/hooks/useOperationsChart";
import type { CustomizedDotProps, Operation } from "@/types/types";

type Props = {
  operations: Operation[];
};

export default function OperationsChart({ operations }: Props) {
  const {
    data,
    setZoomRange,
    helpVisible,
    setHelpVisible,
    variableDescriptions,
    displayData,
  } = useOperationsChart({ operations });

  const CustomizedDot: React.FC<CustomizedDotProps> = ({
    cx,
    cy,
    stroke,
    payload,
  }) => {
    if (!payload) {
      return null;
    }

    const idx = payload.index;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={stroke}
        stroke="#fff"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setZoomRange([
            Math.max(0, idx - 1),
            Math.min(data.length - 1, idx + 1),
          ]);
        }}
      />
    );
  };

  const legendItems = [
    { key: "ir", label: "IR Devido", color: "#556ee6" },
    { key: "pa", label: "PA", color: "#f46a6a" },
    { key: "pm", label: "PM", color: "#34c38f" },
    { key: "qm", label: "QM", color: "#f1b44c" },
    { key: "ra", label: "RA", color: "#A855F7" },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Gráfico das Variáveis</h3>

      <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
        {legendItems.map((item) => (
          <span
            key={item.key}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
        <QuestionCircleOutlined
          className="text-blue-400 text-base cursor-pointer"
          onClick={() => setHelpVisible(true)}
          title="Ajuda sobre as variáveis"
        />
      </div>

      <div onClick={() => setZoomRange(null)}>
        <ResponsiveContainer
          width="100%"
          height={300}
          style={{ outline: "none" }}
        >
          <ComposedChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="irGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#556ee6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#556ee6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" />

            <XAxis
              dataKey="x"
              axisLine={{ stroke: "#ccc" }}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={20}
              tickFormatter={(x: number) =>
                data.find((d) => d.x === x)?.dateLabel ?? ""
              }
            />

            <YAxis
              axisLine={{ stroke: "#ccc" }}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              width={50}
              label={{
                value: "Valores",
                angle: -90,
                position: "insideLeft",
                fill: "#666",
                style: { fontSize: 12 },
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: 4,
              }}
              labelStyle={{ color: "#333", fontSize: 12 }}
              itemStyle={{ fontSize: 12 }}
              formatter={(value: number, name: string) => {
                if (name === "QM") {
                  const formattedQM = new Intl.NumberFormat("pt-BR", {
                    maximumFractionDigits: 0,
                  }).format(value);
                  return [formattedQM, name];
                }
                const formattedMoney = new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 5,
                }).format(value);
                return [`R$ ${formattedMoney}`, name];
              }}
              labelFormatter={(x: number) =>
                data.find((d) => d.x === x)?.dateLabel ?? ""
              }
            />

            <Area
              type="monotone"
              dataKey="ir"
              name="IR Devido"
              stroke="#556ee6"
              fill="url(#irGradient)"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="pm"
              name="PM"
              stroke="#34c38f"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="qm"
              name="QM"
              stroke="#f1b44c"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="pa"
              name="PA"
              stroke="#f46a6a"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="ra"
              name="RA"
              stroke="#A855F7"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <Modal
        open={helpVisible}
        title="Descrição das Variáveis"
        onCancel={() => setHelpVisible(false)}
        footer={null}
      >
        <ul style={{ paddingLeft: 16 }}>
          {Object.entries(variableDescriptions).map(([key, desc]) => (
            <li key={key} style={{ marginBottom: 8 }}>
              <strong>{key}</strong>: {desc}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
