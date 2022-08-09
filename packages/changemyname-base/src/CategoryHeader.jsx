import React from "react";
// import { getContrastRatio } from '@material-ui/core/styles'

const CategoryHeader = ({ label }) => {
  // const lowContrast = getContrastRatio('#ffffff', background) < 4.5
  // const color = lowContrast ? '#282828' : '#ffffff'
  const color = "#ffffff";

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    flex: 1,
    fontSize: "12px",
    color: color,
    background: "none",
  };

  return (
    <>
      <span style={style}>{label}</span>
    </>
  );
};

export default CategoryHeader;
