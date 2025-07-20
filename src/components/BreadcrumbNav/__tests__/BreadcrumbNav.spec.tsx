import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import BreadcrumbNav from "../BreadcrumbNav";

jest.mock("@ant-design/icons", () => ({
  HomeOutlined: () => <span data-testid="home-icon" />,
  RightOutlined: () => <span data-testid="right-icon" />,
}));

describe("BreadcrumbNav", () => {
  function renderWithPath(path: string) {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<BreadcrumbNav />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("exibe apenas o crumb Home na rota raiz", () => {
    renderWithPath("/");

    const homeLink = screen.getByRole("link", { name: /^Home$/i });
    expect(homeLink).toHaveAttribute("href", "/");

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();

    expect(screen.queryByTestId("right-icon")).toBeNull();

    expect(homeLink).toHaveClass("text-white");
  });

  it("exibe Home > Calculadora na rota /calculadora", () => {
    renderWithPath("/calculadora");

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveTextContent("Home");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(screen.getAllByTestId("right-icon")).toHaveLength(1);

    expect(links[1]).toHaveTextContent("Calculadora");
    expect(links[1]).toHaveAttribute("href", "/calculadora");

    expect(links[1]).toHaveClass("text-white");
    expect(links[0]).toHaveClass("text-gray-400");
  });

  it("trata segmentos múltiplos dinamicamente", () => {
    renderWithPath("/foo/bar");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[1]).toHaveTextContent("foo");
    expect(links[2]).toHaveTextContent("bar");
  });
});
