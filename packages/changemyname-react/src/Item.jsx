import React from "react";
import {
  largeItemHeight,
  largeItemWidth,
  smallItemHeight,
  smallItemWidth,
} from "./utils/landscapeCalculations";

const LargeItem = ({ item }) => {
  const { label, borderColor: color } = item;
  const textHeight = label ? 14 : 0;

  const wrapperStyle = {
    background: color,
    width: largeItemWidth,
    height: largeItemHeight,
  };

  const labelStyle = {
    minHeight: textHeight,
    background: color,
  };

  return (
    <div className="landscape--large--item" style={wrapperStyle}>
      <img
        loading="lazy"
        src={item.logo}
        data-href={item.id}
        alt={item.name}
        className="landscape--large--item--image"
      />
      <div className="landscape--large--item--label" style={labelStyle}>
        {label}
      </div>
    </div>
  );
};

const SmallItem = ({ item }) => {
  const { backgroundColor } = item;
  const style = {
    width: smallItemWidth,
    height: smallItemHeight,
    backgroundColor: backgroundColor || "white",
  };
  return (
    <>
      <img
        data-href={item.id}
        loading="lazy"
        className="landscape--small--item"
        src={item.logo}
        alt={item.name}
        style={style}
      />
    </>
  );
};

const Item = (props) => {
  const { large, id, hidden } = props.item;
  const { LinkComponent } = props;
  const largeClass = large ? "landscape--item--wrapper--large" : "";
  const hiddenClass = hidden ? "landscape--item--wrapper--hidden" : "";

  return (
    <LinkComponent
      className={`landscape--item--wrapper ${largeClass} ${hiddenClass}`}
      to={`/?selected=${id}`}
    >
      {large ? <LargeItem {...props} /> : <SmallItem {...props} />}
    </LinkComponent>
  );
};

export default Item;
