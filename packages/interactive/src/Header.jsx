import React from "react";
import ContentColumns from "./ContentColumns.jsx";

const Header = ({ header }) => {
  return <ContentColumns items={header} prefix="header" />;
};

export default Header;
