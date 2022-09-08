import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'src/redux'
import UserMenu from 'src/modules/Layout/Toolbar/components/UserMenu'

/**
 * ToolbarWidget include the content of the Toolbar.
 *
 * @returns ToolbarWidget Component.
 */
export const ToolbarWidget = () => {
    const dispatch = useDispatch<Dispatch>()

    useEffect(() => {
        dispatch.housingModel.loadHousingsList()
    })

    return (
        <>
            <UserMenu />
        </>
    )
}
