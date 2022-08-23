import React from "react";

const Item = (props) => {
  const { item } = props;
  const { large, id, hidden, variant } = item;
  const { LinkComponent } = props;
  const className = [
    "landscape-item",
    variant && `landscape-item-variant-${variant}`,
    large && `landscape-item-large`,
    hidden && `landscape-item-hidden`,
  ]
    .filter((_) => _)
    .join(" ");

  const { label } = item;

  return (
    <LinkComponent className={className} to={`/?selected=${id}`}>
      <div className="landscape-item-body">
        <img
          loading="lazy"
          src={item.logo}
          data-href={item.id}
          alt={item.name}
        />
        <div className="landscape-item-label">{label}</div>
      </div>
    </LinkComponent>
  );
};

export default Item;
