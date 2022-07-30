import React from 'react';
import HorizontalCategory from './HorizontalCategory'
import VerticalCategory from './VerticalCategory'
import {calculateSize, headerHeight} from "./utils/landscapeCalculations";


const Landscape = ({zoom = 1, header = {}, padding = 10, categories }) => {
    const sizes = calculateSize(categories)
    // TODO: this should be done based on header height
    // TODO: header needs to have padding top and bottom
    const width = header ? sizes.fullscreenWidth : sizes.width
    const height = header ? sizes.fullscreenHeight : sizes.height

    const elements = categories.map((category, idx) => {
        const subcategories = category.subcategories.map(subcategory => {
            const allItems = subcategory.items.map(item => ({ ...item, categoryAttrs: category }))
            return { ...subcategory, allItems }
        })

        const Component = category.style.layout === 'horizontal' ? HorizontalCategory : VerticalCategory
        return <Component {...category} {...category.style} subcategories={subcategories} key={idx} />
    });

    const style = {
        padding,
        width: width + 2 * padding,
        height: height + 2 * padding,
        transform: `scale(${zoom})`,
        transformOrigin: '0 0',
        boxSizing: 'border-box'
    }

    const headerStyle = {
        height: headerHeight,
        display: 'flex',
        color: 'white',
        justifyContent: 'space-between',
        alignItems: 'center'
    }

    // TODO: get rid of inline styles
    return <div style={style}>
        { header && <div className="header" style={headerStyle}>
            <div style={{ height: '100%' }}>{ header.logo && <img style={{ height: '100%' }} src={header.logo} /> }</div>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>{ header.title && <h1 style={{ fontSize: 26 }}>{header.title}</h1>}</div>
            <div style={{ height: '100%' }}>{ header.rightLogo && <img style={{ height: '100%' }} src={header.rightLogo} /> }</div>
        </div> }
        <div style={{ position: 'relative' }}>
            {elements}
        </div>
    </div>
};

export default Landscape
