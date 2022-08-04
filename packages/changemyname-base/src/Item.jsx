import React from "react";
import {
  largeItemHeight,
  largeItemWidth,
  smallItemHeight,
  smallItemWidth,
} from "./utils/landscapeCalculations";

const LargeItem = ({ item }) => {
  // TODO: fix relation stuff
  // const relationInfo = fields.relation.valuesMap[item.relation]
  // const color = relationInfo.big_picture_color;
  // const label = relationInfo.big_picture_label;
  const label = null;
  const color = "grey";
  const textHeight = label ? 10 : 0;
  const padding = 2;

  const wrapperStyle = {
    cursor: "pointer",
    position: "relative",
    background: color,
    visibility: item.hidden ? "hidden" : "visible",
    width: largeItemWidth,
    height: largeItemHeight,
  };

  const imgStyle = {
    width: `calc(100% - ${2 * padding}px)`,
    height: `calc(100% - ${2 * padding + textHeight}px)`,
    padding: 5,
    margin: `${padding}px ${padding}px 0 ${padding}px`,
    background: "white",
  };

  const labelStyle = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: textHeight + padding,
    textAlign: "center",
    verticalAlign: "middle",
    background: color,
    color: "white",
    fontSize: "6.7px",
    lineHeight: "13px",
  };

  return (
    <div className="large-item item" style={wrapperStyle}>
      <img
        loading="lazy"
        src={item.logo}
        data-href={item.id}
        alt={item.name}
        style={imgStyle}
      />
      <div className="label" style={labelStyle}>
        {label}
      </div>
    </div>
  );
};

const SmallItem = ({ item }) => {
  const style = {
    cursor: "pointer",
    width: smallItemWidth,
    height: smallItemHeight,
    border: "1px solid grey",
    borderRadius: "2px",
    padding: "1px",
    visibility: item.hidden ? "hidden" : "visible",
    boxSizing: "border-box",
  };
  return (
    <>
      <img
        data-href={item.id}
        loading="lazy"
        className="item"
        src={item.logo}
        alt={item.name}
        style={style}
      />
    </>
  );
};

const Item = (props) => {
  const { large, oss, id } = props.item;
  const { LinkComponent } = props;

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gridColumnEnd: `span ${large ? 2 : 1}`,
    gridRowEnd: `span ${large ? 2 : 1}`,
  };

  return (
    <LinkComponent
      className={oss ? "oss" : "nonoss"}
      style={style}
      to={`/?selected=${id}`}
    >
      {large ? <LargeItem {...props} /> : <SmallItem {...props} />}
    </LinkComponent>
  );
};

export default Item;
