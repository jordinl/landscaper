import React from "react";
import InternalLink from "./InternalLink";
// import { getContrastRatio } from '@material-ui/core/styles'

const CategoryHeader = ({ href, label, background }) => {
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
      <InternalLink to={href} style={style}>
        {label}
      </InternalLink>
    </>
  );
};

export default CategoryHeader;
