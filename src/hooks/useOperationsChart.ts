import type { ChartPoint, Operation } from "@/types/types";
import { useState } from "react";

type Props = {
  operations: Operation[];
};

export function useOperationsChart({ operations }: Props) {
  const sorted = [...operations].sort(
    (a, b) => a.date!.valueOf() - b.date!.valueOf()
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
      date: op.date!.format("DD/MM/YYYY"),
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

  return {
    data,
    setZoomRange,
    helpVisible,
    setHelpVisible,
    variableDescriptions,
    formatValue,
    displayData,
  };
}
