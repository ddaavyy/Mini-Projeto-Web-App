Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.getComputedStyle = (() => {
  return {
    getPropertyValue: (_: string) => "",
    width: "0px",
    height: "0px",
  } as unknown as CSSStyleDeclaration & {
    getPropertyValue(prop: string): string;
  };
}) as typeof window.getComputedStyle;

export {};
