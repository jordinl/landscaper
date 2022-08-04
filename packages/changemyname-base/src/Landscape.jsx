import React from 'react';
import HorizontalCategory from './HorizontalCategory'
import VerticalCategory from './VerticalCategory'
import {calculateSize, headerHeight} from "./utils/landscapeCalculations";


const Landscape = ({zoom = 1, header = {}, padding = 10, categories }) => {
    const sizes = calculateSize(categories)
    // TODO: Move this to calculations
    const width = sizes.width
    const height = sizes.height + (header ? headerHeight + 10 : 0)

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
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginBottom: padding
    }

    // TODO: get rid of inline styles
    return <div style={style}>
        { header && <div className="header" style={headerStyle}>
            <div style={{ width: '25%' }}>{ header.logo && <img style={{ height: '100%' }} src={header.logo} /> }</div>
            <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{ header.title && <h1 style={{ fontSize: 26, lineHeight: '26px' }}>{header.title}</h1>}</div>
        </div> }
        <div style={{ position: 'relative' }}>
            {elements}
        </div>
    </div>
};

export default Landscape
