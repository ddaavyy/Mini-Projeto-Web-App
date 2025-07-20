import React, { useMemo } from "react";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const routeNameMap: Record<string, string> = {
  "": "Home",
  calculadora: "Calculadora",
};

export default function BreadcrumbNav() {
  const { pathname } = useLocation();
  const segments = useMemo(
    () => pathname.split("/").filter((seg) => seg.length > 0),
    [pathname]
  );

  const crumbs = useMemo(() => {
    const list = [{ path: "/", name: routeNameMap[""] }];
    segments.forEach((seg, i) => {
      const path = "/" + segments.slice(0, i + 1).join("/");
      list.push({ path, name: routeNameMap[seg] ?? seg });
    });
    return list;
  }, [segments]);

  return (
    <nav className="w-full bg-[#171717]">
      <div className="max-w-7xl ml-2 px-6 py-2 flex items-center space-x-3">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.path}>
            {idx > 0 && (
              <RightOutlined className="text-gray-400 flex-shrink-0" />
            )}
            <Link
              to={crumb.path}
              className={`
                text-sm font-semibold 
                ${
                  idx === crumbs.length - 1
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                } 
                transition-colors
                flex items-center
                gap-2
              `}
            >
              {idx === 0 && (
                <HomeOutlined />
              )}
              {crumb.name}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
