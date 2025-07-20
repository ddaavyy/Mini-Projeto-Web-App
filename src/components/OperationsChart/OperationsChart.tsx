import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { ChartPoint, Operation } from "@/types/types";

type Props = {
  operations: Operation[];
};

export default function OperationsChart({ operations }: Props) {
  const sorted = [...operations].sort(
    (a, b) => a.date.valueOf() - b.date.valueOf()
  );

  let PM = 0;
  let QM = 0;
  let PA = 0;

  const [zoomRange, setZoomRange] = useState<[number, number] | null>(null);
  const [helpVisible, setHelpVisible] = useState(false);

  const variableDescriptions: Record<string, string> = {
    IR: "Imposto de Renda Devido",
    PA: "Prejuízo Acumulado",
    PM: "Preço Médio",
    QM: "Quantidade Média",
    RA: "Resultado Auferido",
  };

  const formatValue = (val: number): string => {
    let s = val.toFixed(5);
    s = s.replace(/(\.\d*?[1-9])0+$/g, "$1");
    s = s.replace(/\.0+$/g, "");
    const parts = s.split(".");
    if (parts.length === 1) return s + ".00";
    if (parts[1].length === 1) return s + "0";
    return s;
  };

  const data: ChartPoint[] = sorted.map((op, i) => {
    let IR = 0;
    let RA = 0;

    if (op.type === "buy") {
      const totalCost = PM * QM + op.price * op.quantity + op.fee;
      QM += op.quantity;
      PM = totalCost / QM;
    } else {
      RA = (op.price - PM) * op.quantity - op.fee;
      QM -= op.quantity;
      if (RA < 0) {
        PA += Math.abs(RA);
      } else {
        const compensacao = Math.min(RA, PA);
        IR = (RA - compensacao) * 0.15;
        PA -= compensacao;
      }
    }

    return {
      index: i,
      date: op.date.format("DD/MM/YYYY"),
      ir: parseFloat(IR.toFixed(5)),
      pm: parseFloat(PM.toFixed(5)),
      qm: QM,
      pa: parseFloat(PA.toFixed(5)),
      ra: parseFloat(RA.toFixed(5)),
    };
  });

  const displayData = zoomRange
    ? data.slice(zoomRange[0], zoomRange[1] + 1)
    : data;

  const CustomizedDot = (props: any) => {
    const { cx, cy, stroke, payload } = props;
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
          const idx = payload.index as number;
          setZoomRange([
            Math.max(0, idx - 1),
            Math.min(data.length - 1, idx + 1),
          ]);
        }}
      />
    );
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        {payload.map((entry: any) => (
          <span
            key={entry.value}
            style={{
              color: entry.color,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            {entry.value}
          </span>
        ))}
        <QuestionCircleOutlined
          style={{
            fontSize: 16,
            cursor: "pointer",
            color: "#97bff3",
            marginBottom: 2,
          }}
          onClick={() => setHelpVisible(true)}
        />
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Evolução das Variáveis</h3>
      <div onClick={() => setZoomRange(null)}>
        <ResponsiveContainer
          width="100%"
          height={300}
          style={{ outline: "none" }}
          tabIndex={-1}
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
              dataKey="date"
              axisLine={{ stroke: "#ccc" }}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={20}
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
                if (name === "QM") return [value.toString(), name];
                return [`R$ ${formatValue(value)}`, name];
              }}
            />

            <Legend
              verticalAlign="top"
              align="center"
              content={renderLegend}
              wrapperStyle={{ width: "100%", marginBottom: 8 }}
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
              stroke="#3b76e1"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <Modal
        visible={helpVisible}
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
