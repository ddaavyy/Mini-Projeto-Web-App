import { render, screen } from "@testing-library/react";

import App from "../App";

jest.mock("@/routes/routes", () => () => <div>Mocked Routes</div>);

describe("App", () => {
  it("renders BrowserRouter e o componente AppRoutes", () => {
    render(<App />);
    expect(screen.getByText("Mocked Routes")).toBeInTheDocument();
  });
});
