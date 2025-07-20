import { ComponentType,LazyExoticComponent } from "react";

import pages from "../listOfPages";

type Pages = {
  Home: LazyExoticComponent<ComponentType<unknown>>;
  Calculadora: LazyExoticComponent<ComponentType<unknown>>;
};

describe("listOfPages", () => {
  it("exports Home and Calculadora as typed React.lazy components", () => {
    const typedPages = pages as Pages;
    const HomeComponent: LazyExoticComponent<ComponentType<unknown>> =
      typedPages.Home;
    const CalculadoraComponent: LazyExoticComponent<ComponentType<unknown>> =
      typedPages.Calculadora;

    const LAZY_SYMBOL = Symbol.for("react.lazy");
    const homeType = (HomeComponent as unknown as { $$typeof: symbol })
      .$$typeof;
    const calcType = (CalculadoraComponent as unknown as { $$typeof: symbol })
      .$$typeof;

    expect(homeType).toBe(LAZY_SYMBOL);
    expect(calcType).toBe(LAZY_SYMBOL);
  });
});
