import React from "react";

const Item = (props) => {
  const { item } = props;
  const { large, id, hidden, backgroundColor } = item;
  const { LinkComponent } = props;
  const largeClass = large ? "landscape-item-large" : "";
  const hiddenClass = hidden ? "landscape-item-hidden" : "";

  const { label, borderColor: color } = item;
  const textHeight = label ? 14 : 0;

  const itemStyle = {
    background: color,
  };

  const imgStyle = {
    backgroundColor: backgroundColor || "white",
  };

  const labelStyle = {
    minHeight: textHeight,
    background: color,
  };

  return (
    <LinkComponent
      className={`landscape-item ${largeClass} ${hiddenClass}`}
      to={`/?selected=${id}`}
    >
      <div className="landscape-item-body" style={itemStyle}>
        <img
          loading="lazy"
          src={item.logo}
          data-href={item.id}
          alt={item.name}
          style={imgStyle}
        />
        <div className="landscape-item-label" style={labelStyle}>
          {label}
        </div>
      </div>
    </LinkComponent>
  );
};

export default Item;
