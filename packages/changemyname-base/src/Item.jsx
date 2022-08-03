import React from 'react'
import {
  largeItemHeight,
  largeItemWidth,
  smallItemHeight,
  smallItemWidth
} from "./utils/landscapeCalculations";

const LargeItem = ({ item }) => {
  // TODO: fix relation stuff
  // const relationInfo = fields.relation.valuesMap[item.relation]
  // const color = relationInfo.big_picture_color;
  // const label = relationInfo.big_picture_label;
  const label = null;
  const color = 'grey';
  const textHeight = label ? 10 : 0
  const padding = 2

  return <div className="large-item item">
    {/*<style jsx>{`*/}
    {/*  .large-item {*/}
    {/*    cursor: pointer;*/}
    {/*    position: relative;*/}
    {/*    background: ${color};*/}
    {/*    visibility: ${item.isVisible ? 'visible' : 'hidden'};*/}
    {/*    width: ${largeItemWidth}px;*/}
    {/*    height: ${largeItemHeight}px;*/}
    {/*  }*/}

    {/*  .large-item img {*/}
    {/*    width: calc(100% - ${2 * padding}px);*/}
    {/*    height: calc(100% - ${2 * padding + textHeight}px);*/}
    {/*    padding: 5px;*/}
    {/*    margin: ${padding}px ${padding}px 0 ${padding}px;*/}
    {/*  }*/}

    {/*  .large-item .label {*/}
    {/*    position: absolute;*/}
    {/*    bottom: 0;*/}
    {/*    width: 100%;*/}
    {/*    height: ${textHeight + padding}px;*/}
    {/*    text-align: center;*/}
    {/*    vertical-align: middle;*/}
    {/*    background: ${color};*/}
    {/*    color: white;*/}
    {/*    font-size: 6.7px;*/}
    {/*    line-height: 13px;*/}
    {/*  }*/}
    {/*`}</style>*/}

    <img loading="lazy" src={item.logo} data-href={item.id} alt={item.name} />
    <div className="label">{label}</div>
  </div>;
}

const SmallItem = ({ item }) => {
  const style = {
    cursor: 'pointer',
    width: smallItemWidth,
    height: smallItemHeight,
    border: '1px solid grey',
    borderRadius: '2px',
    padding: '1px',
    visibility: item.hidden ? 'hidden' : 'visible',
    boxSizing: 'border-box'
  }
  return <>
    <img data-href={item.id} loading="lazy" className="item" src={item.logo} alt={item.name} style={style} />
  </>
}

const Item = props => {
  const { large, oss } = props.item

  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridColumnEnd: `span ${large ? 2 : 1}`,
    gridRowEnd: `span ${large ? 2 : 1}`
  }

  return <div className={oss  ? 'oss' : 'nonoss'} style={style}>
    {large ? <LargeItem {...props} /> : <SmallItem {...props} />}
  </div>
}

export default Item
