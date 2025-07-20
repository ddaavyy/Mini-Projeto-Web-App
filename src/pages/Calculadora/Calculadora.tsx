import OperationsChart from "@/components/OperationsChart/OperationsChart";
import OperationsTable from "@/components/OperationsTable/OperationsTable";
import type { Operation } from "@/types/types";
import { useState } from "react";

export default function Calculadora() {
  const [operations, setOperations] = useState<Operation[]>([]);

  return (
    <div className="bg-black min-h-screen py-12 px-6">
      <div className="max-w-full mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-white">
            Calculadora de IR
          </h1>
          <p className="mt-4 text-lg text-white">
            Registre suas compras e vendas de ações e acompanhe cada detalhe.
          </p>
        </header>

        <section className="flex flex-col-reverse lg:flex-row gap-8">
          <div className="lg:w-1/2 bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Minhas Operações
            </h2>
            <p className="text-gray-600 mb-6 text-base">
              Adicione, edite e exclua operações para obter cálculos automáticos
              de Preço Médio, Quantidade Média, Prejuízo Acumulado e Imposto
              Devido.
            </p>
            <OperationsTable
              operations={operations}
              setOperations={setOperations}
            />
          </div>

          <div className="lg:w-1/2 bg-white rounded-2xl shadow-md p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Guia Completo da Tabela de Operações
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Nossa tabela foi projetada para oferecer controle total sobre cada
              compra e venda de ações. Insira nome, data, tipo (Compra/Venda),
              preço, quantidade e taxa, e veja os resultados imediatamente
              atualizados na própria tabela e no gráfico. Monitore seu preço
              médio, prejuízos acumulados e imposto devido em tempo real, de
              forma clara e precisa.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
              <li>
                <span className="font-semibold text-gray-800">
                  Adicionar ação:
                </span>{" "}
                abra o formulário lateral e registre novos lançamentos.
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Editar operação:
                </span>{" "}
                use o menu de três pontos para corrigir ou ajustar qualquer
                detalhe.
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Excluir registro:
                </span>{" "}
                remova entradas indesejadas com um único clique.
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Recalculo instantâneo:
                </span>{" "}
                todos os indicadores — PM, QM, PA e IR — são atualizados
                automaticamente, sem atrasos.
              </li>
            </ul>
            <p className="text-gray-700 mt-6 text-base italic">
              Use este recurso para analisar cenários, testar estratégias e
              tomar decisões com mais segurança — tudo em uma interface limpa e
              direta.
            </p>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 bg-white rounded-2xl shadow-md p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Entendendo o Gráfico
            </h2>
            <p className="text-gray-700 mb-4 text-base">
              Este gráfico mostra a evolução de cada variável ao longo do tempo:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
              <li>
                <span className="font-semibold">IR Devido:</span> imposto
                calculado após vendas.
              </li>
              <li>
                <span className="font-semibold">PA:</span> prejuízo acumulado.
              </li>
              <li>
                <span className="font-semibold">PM:</span> preço médio das
                compras.
              </li>
              <li>
                <span className="font-semibold">QM:</span> quantidade média em
                custódia.
              </li>
              <li>
                <span className="font-semibold">RA:</span> resultado de cada
                operação.
              </li>
            </ul>
            <p className="text-gray-700 mt-4 text-base">
              Clique nos pontos do gráfico para aproximar a vista naquela data.
            </p>
          </div>

          <div className="lg:w-1/2 bg-white rounded-2xl shadow-md p-8 pt-12">
            <OperationsChart operations={operations} />
          </div>
        </section>
      </div>
    </div>
  );
}
