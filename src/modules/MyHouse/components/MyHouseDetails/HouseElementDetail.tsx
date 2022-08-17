import React from 'react'
import { HouseDetailsElementType } from 'src/modules/MyHouse/components/MyHouseDetails/houseDetails'

/**
 * Element to display icon with it's value label.
 *
 * @param props Props.
 * @param props.element Element to display.
 * @returns JSX.
 */
const HouseElementDetail = ({
    element,
}: /**
 */ {
    /**
     * Element.
     */
    element: HouseDetailsElementType
}) => {
    return (
        <div className="w-70 h-120 flex flex-1 flex-col items-center justify-items-center m-10">
            <div className="p-10 bg-white rounded-md flex items-center justify-items-center mb-5 shadow-md border border-slate-800">
                {element.icon}
            </div>
            <p className="text-center">{element.label}</p>
        </div>
    )
}

export default HouseElementDetail
