import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'

/**
 * EuroWidgetInfoIcon Component.
 *
 * @returns EuroWidgetInfoIcon Component.
 */
export const EuroWidgetInfoIcon = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    return (
        <Tooltip
            title={
                <div>
                    <TypographyFormatMessage className="text-center">Ce coût est un exemple.</TypographyFormatMessage>
                    <NavLink to={currentHousing ? `${URL_MY_HOUSE}/${currentHousing?.id}/contracts` : URL_MY_HOUSE}>
                        <TypographyFormatMessage sx={{ color: '#FFFFFF' }} className="underline text-center">
                            Renseigner un contrat d'énergie.
                        </TypographyFormatMessage>
                    </NavLink>
                </div>
            }
        >
            <IconButton sx={{ p: 0 }}>
                <ErrorOutlineIcon sx={{ color: warningMainHashColor, width: '32px', height: '32px' }} />
            </IconButton>
        </Tooltip>
    )
}

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
 * @param hasMissingContracts Flag HasMissingContracts, that'll influence which widget icon will be shown.
 * @param enphaseOff Enphase Consent is inactive.
 * @returns Icon of the widget or undefined.
 */
export const getWidgetInfoIcon = (
    widgetTarget: metricTargetType,
    hasMissingContracts: boolean | null,
    enphaseOff?: boolean | null,
) => {
    if (hasMissingContracts && widgetTarget === metricTargetsEnum.eurosConsumption) return <EuroWidgetInfoIcon />
    if (enphaseOff && widgetTarget === metricTargetsEnum.totalProduction) return <ProductionWidgetErrorIcon />
    // Otherwise any icon doesn't be shown in the Widget.
    return undefined
}
