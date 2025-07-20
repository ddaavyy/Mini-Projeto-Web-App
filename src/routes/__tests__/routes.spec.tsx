import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AppRoutes, { LoadingComponent } from "../routes";

jest.mock("@/routes/listOfPages", () => ({
  Home: () => <div>Home Page</div>,
  Calculadora: () => <div>Calculadora Page</div>,
}));

describe("LoadingComponent", () => {
  it("renders um Spin centralizado", () => {
    const { container } = render(<LoadingComponent />);
    expect(container.querySelector(".ant-spin")).toBeInTheDocument();

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "justify-center", "items-center");
  });
});

describe("AppRoutes", () => {
  it("renderiza Home em /home", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renderiza Calculadora em /calculadora", () => {
    render(
      <MemoryRouter initialEntries={["/calculadora"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("Calculadora Page")).toBeInTheDocument();
  });

  it("redireciona rotas desconhecidas para /home", () => {
    render(
      <MemoryRouter initialEntries={["/algumacoisa"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
