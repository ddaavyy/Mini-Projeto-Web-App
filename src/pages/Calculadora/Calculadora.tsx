import OperationsChart from "@/components/OperationsChart/OperationsChart";
import OperationsTable from "@/components/OperationsTable/OperationsTable";
import type { Operation } from "@/types/types";
import { useEffect, useState } from "react";

export default function Calculadora() {
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#171717] min-h-screen py-12 px-6">
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
              Explorando o Gráfico Interativo
            </h2>

            <p className="text-gray-700 mb-4 text-base">
              Este gráfico exibe, em tempo real, a evolução de cada indicador
              financeiro:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-600 text-base mb-6">
              <li>
                <span className="font-semibold text-gray-800">IR Devido:</span>{" "}
                imposto calculado após cada venda.
              </li>
              <li>
                <span className="font-semibold text-gray-800">PA:</span>{" "}
                prejuízo acumulado nas operações.
              </li>
              <li>
                <span className="font-semibold text-gray-800">PM:</span> preço
                médio ponderado das compras.
              </li>
              <li>
                <span className="font-semibold text-gray-800">QM:</span>{" "}
                quantidade média de ações em custódia.
              </li>
              <li>
                <span className="font-semibold text-gray-800">RA:</span>{" "}
                resultado financeiro (lucro/prejuízo) de cada operação.
              </li>
            </ul>

            <p className="text-gray-700 font-semibold mb-2 text-base">
              Como interagir:
            </p>
            <ul className="list-decimal list-inside space-y-2 text-gray-600 text-base">
              <li>
                Clique nos pontos coloridos do gráfico para dar <em>zoom</em> e
                focar no intervalo selecionado.
              </li>
              <li>
                Para resetar o zoom e voltar à visão completa, clique em
                qualquer área vazia do gráfico.
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2 bg-white rounded-2xl shadow-md p-8 pt-12">
            <OperationsChart operations={operations} />
          </div>
        </section>
      </div>
    </div>
  );
}
