import React, { ReactNode } from "react";
import SideBar from "../Components/SideBar/SideBar";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%",
      overflow: "hidden"
    }}>
      <SideBar />
      <div style={{
        flex: 1,
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
