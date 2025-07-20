import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";

import Home from "../Home";

const renderWithRouter = (ui: React.ReactElement, initialPath = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
  );
};

describe("Home page", () => {
  it("deve renderizar todos os textos corretamente", () => {
    renderWithRouter(<Home />);

    expect(
      screen.getByRole("heading", { name: /calculadora simplificada/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /de imposto de renda/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/registre compras e vendas/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /simples. prático. eficiente./i })
    ).toBeInTheDocument();
    expect(screen.getByText(/resultados em tempo real/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("deve navegar para /calculadora ao clicar no botão", async () => {
    const user = userEvent.setup();

    // componente wrapper com rota atual
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Home />
        <LocationDisplay />
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByTestId("location")).toHaveTextContent("/calculadora");
  });
});
