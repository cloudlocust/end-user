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
                    <TypographyFormatMessage className="text-center">Ce coût un exemple.</TypographyFormatMessage>
                    <NavLink to={currentHousing ? `${URL_MY_HOUSE}/${currentHousing?.id}/contracts` : URL_MY_HOUSE}>
                        <TypographyFormatMessage sx={{ color: 'secondary.main' }} className="underline text-center">
                            Renseigner un contrat d'énergie.
                        </TypographyFormatMessage>
                    </NavLink>
                </div>
            }
        >
            <IconButton sx={{ p: 0 }}>
                <ErrorOutlineIcon sx={{ color: 'secondary.main', width: '32px', height: '32px' }} />
            </IconButton>
        </Tooltip>
    )
}

/**
 * Function that returns the Icon element used in the widget.
 *
 * @param widgetTarget Target of the widget.
 * @param hasMissingContracts Flag HasMissingContracts, that'll influence which widget icon will be shown.
 * @returns Icon of the widget or undefined.
 */
export const getWidgetInfoIcon = (widgetTarget: metricTargetType, hasMissingContracts: boolean | null) => {
    if (hasMissingContracts && widgetTarget === metricTargetsEnum.eurosConsumption) return <EuroWidgetInfoIcon />
    // When hasMissingContracts is not given and widgetTarget is not eurosConsumption then no icon is in the Widget.
    return undefined
}
