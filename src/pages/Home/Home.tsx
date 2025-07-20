import { CalculatorFilled } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

import bgPattern from "@/assets/setaBolsa.png";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-8">
        <img
          src={bgPattern}
          alt="pattern"
          className="absolute inset-0 w-full h-full object-cover filter brightness-0 opacity-10 pointer-events-none"
        />
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-center">
          Calculadora Simplificada
        </h1>
        <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-bold text-center">
          de Imposto de Renda
        </h2>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 text-center max-w-2xl">
          Registre compras e vendas de ações, acompanhe preço médio, prejuízos
          acumulados e descubra o imposto devido de forma rápida e prática.
        </p>
      </section>

      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
          Simples. Prático. Eficiente.
        </h3>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl">
          Use agora sua Calculadora IR para operações na bolsa e tenha
          resultados em tempo real com gráficos interativos. Clique no botão
          abaixo para usar sua calculadora.
        </p>

        <Button
          type="default"
          shape="default"
          variant="solid"
          onClick={() => navigate("/calculadora")}
          className="mt-8 w-24 sm:w-28 h-12 sm:h-14 flex items-center justify-center text-black rounded-md"
        >
          <CalculatorFilled className="text-2xl sm:text-3xl md:text-4xl" />
        </Button>
      </section>
    </div>
  );
};

export default Home;
