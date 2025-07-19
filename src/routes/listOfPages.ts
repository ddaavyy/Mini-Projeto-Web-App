import { lazy } from "react";

const HomeImport = () => import("../pages/Home/Home");
const CalculadoraImport = () => import("../pages/Calculadora/Calculadora");

const pages = {
  Home: lazy(HomeImport),
  Calculadora: lazy(CalculadoraImport),
};

export default pages;
