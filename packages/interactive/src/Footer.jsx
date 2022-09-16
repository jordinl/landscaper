import React from "react";
import ContentColumns from "./ContentColumns.jsx";

const Footer = ({ footer }) => {
  return <ContentColumns items={footer} prefix="footer" />;
};

export default Footer;
