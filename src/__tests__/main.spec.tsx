import { StrictMode } from "react";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({ render: jest.fn() })),
}));

describe("main entry (main.tsx)", () => {
  beforeEach(() => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("extends dayjs with all required plugins", () => {
    jest.isolateModules(() => {
      const dayjs = require("dayjs") as typeof import("dayjs");
      const extendSpy = jest.spyOn(dayjs, "extend");

      require("../main.tsx");

      const actualPlugins = extendSpy.mock.calls.map((call) => call[0]);
      const expectedPlugins = [
        require("dayjs/plugin/customParseFormat"),
        require("dayjs/plugin/advancedFormat"),
        require("dayjs/plugin/weekday"),
        require("dayjs/plugin/localeData"),
        require("dayjs/plugin/weekOfYear"),
        require("dayjs/plugin/weekYear"),
      ];

      expectedPlugins.forEach((plugin) => {
        expect(actualPlugins).toContain(plugin);
      });

      extendSpy.mockRestore();
    });
  });

  it("calls createRoot on #root and renders <App /> inside <StrictMode>", () => {
    jest.isolateModules(() => {
      const { createRoot } = require("react-dom/client") as {
        createRoot: jest.Mock;
      };

      require("../main.tsx");

      const mockRender = createRoot.mock.results[0].value.render;
      expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StrictMode,
          props: { children: expect.any(Object) },
        })
      );
    });
  });
});
