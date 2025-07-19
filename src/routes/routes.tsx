import { Spin } from "antd";
import React, { Suspense } from "react";
import pages from "./listOfPages";
import { Navigate, Route, Routes } from "react-router-dom";
import type { RouteConfig } from "../types/types";

export const LoadingComponent: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Spin size="large" />
    </div>
  );
};

const routeConfig: { [key: string]: RouteConfig[] } = {
  calculatorProject: [
    {
      path: "/home",
      element: <pages.Home />,
    },
    {
      path: "/calculadora",
      element: <pages.Calculadora />,
    },
    {
      path: "/loadingpage",
      element: <LoadingComponent />,
    },
  ],
};

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {Object.values(routeConfig)
          .flat()
          .map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
