import React from 'react';
import HorizontalCategory from './HorizontalCategory'
import VerticalCategory from './VerticalCategory'
import {calculateSize} from "./utils/landscapeCalculations";


const Landscape = ({zoom = 1, padding = 10, categories }) => {
    const { width, height } = calculateSize(categories)

    const elements = categories.map((category, idx) => {
        const subcategories = category.subcategories.map(subcategory => {
            const allItems = subcategory.items.map(item => ({ ...item, categoryAttrs: category }))
            return { ...subcategory, allItems }
        })

        const Component = category.style.layout === 'horizontal' ? HorizontalCategory : VerticalCategory
        return <Component {...category} {...category.style} subcategories={subcategories} key={idx} />
    });

    console.log(width, height)

    const style = {
        padding,
        width: width + 2 * padding,
        height: height + 2 * padding,
        transform: `scale(${zoom})`,
        transformOrigin: '0 0',
        boxSizing: 'border-box'
    }

    return <div className="inner-landscape" style={style}>
        <div style={{ position: 'relative' }}>
            {elements}
        </div>
    </div>
};

export default Landscape
