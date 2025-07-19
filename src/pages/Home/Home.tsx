import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import bgPattern from "../../assets/setaBolsa.png";
import { CalculatorOutlined } from "@ant-design/icons";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <section className="h-screen flex flex-col items-center justify-center bg-white text-black px-6">
        <img
          src={bgPattern}
          alt="pattern"
          className="absolute inset-0 w-full h-full object-cover filter brightness-0 opacity-10 pointer-events-none"
        />
        <h1 className="text-7xl font-extrabold">Calculadora Simplificada</h1>
        <h2 className="text-5xl font-bold mt-4">de Imposto de Renda</h2>
        <p className="max-w-2xl text-xl text-gray-700 mt-8 text-center">
          Registre compras e vendas de ações, acompanhe preço médio, prejuízos
          acumulados e descubra o imposto devido de forma rápida e prática.
        </p>
      </section>

      <section className="h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <h3 className="text-5xl font-semibold">Simples. Prático. Eficiente.</h3>
        <p className="max-w-2xl text-lg text-gray-400 mt-4 text-center">
          Use agora sua Calculadora IR para operações na bolsa e tenha
          resultados em tempo real com gráficos interativos. Clique no
          botão abaixo para usar sua calculadora.
        </p>

        <Button
          type="default"
          shape="default"
          onClick={() => navigate("/calculadora")}
          className={`
               mt-8 w-28 h-14 flex items-center justify-center text-black rounded-md
          `}
        >
          <CalculatorOutlined className="text-4xl" />
        </Button>
      </section>
    </div>
  );
};

export default Home;
