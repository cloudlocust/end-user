import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import IconButton from '@mui/material/IconButton'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
/**
 * ProductionWidgetErrorInfoIcon Component.
 *
 * @returns ProductionWidgetErrorInfoIcon Component.
 */
export const ProductionWidgetErrorIcon = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    return (
        <NavLink to={currentHousing ? `${URL_MY_HOUSE}/${currentHousing?.id}` : URL_MY_HOUSE}>
            <IconButton sx={{ p: 0 }}>
                <ErrorOutlineIcon sx={{ color: warningMainHashColor, width: '32px', height: '32px' }} />
            </IconButton>
        </NavLink>
    )
}

/**
 * Function that returns the Icon element used in the widget.
 *
 * @param widgetTarget Target of the widget.
 * @param enphaseOff Enphase Consent is inactive.
 * @returns Icon of the widget or undefined.
 */
export const getWidgetEnphaseErrorIcon = (widgetTarget: metricTargetType, enphaseOff?: boolean | null) => {
    if (enphaseOff && widgetTarget === metricTargetsEnum.totalProduction) return <ProductionWidgetErrorIcon />
    // When enphaseConsent is active or widgetTarget is not totalProduction then no error icon is shown in the Widget.
    return undefined
}
