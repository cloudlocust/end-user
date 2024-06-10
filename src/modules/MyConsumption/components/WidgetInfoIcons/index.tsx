import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { manualContractFillingIsEnabled } from 'src/modules/MyHouse/MyHouseConfig'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { getWidgetInfoIconParamsType } from 'src/modules/MyConsumption/components/Widget/Widget.d'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useIntl } from 'react-intl'

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
                    {manualContractFillingIsEnabled && (
                        <NavLink to={currentHousing ? `${URL_MY_HOUSE}/${currentHousing?.id}/contracts` : URL_MY_HOUSE}>
                            <TypographyFormatMessage
                                sx={{ color: linksColor || '#FFFFFF' }}
                                className="underline text-center"
                            >
                                Renseigner un contrat d'énergie.
                            </TypographyFormatMessage>
                        </NavLink>
                    )}
                </div>
            }
        >
            <IconButton sx={{ p: 0 }}>
                <ErrorOutlineIcon sx={{ color: linksColor || warningMainHashColor, width: '32px', height: '32px' }} />
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
                <ErrorOutlineIcon sx={{ color: linksColor || warningMainHashColor, width: '32px', height: '32px' }} />
            </IconButton>
        </NavLink>
    )
}

/**
 * PMaxWidgetInfoIcon Component.
 *
 * @returns PMaxWidgetInfoIcon Component.
 */
export const PMaxWidgetInfoIcon = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { formatMessage } = useIntl()
    const { createEnedisSgeConsent, isCreateEnedisSgeConsentLoading, createEnedisSgeConsentError } = useConsents()
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    /**
     * Open Tooltip Handler.
     */
    const openTooltip = () => {
        setIsTooltipOpen(true)
    }
    /**
     * Close Tooltip Handler.
     */
    const closeTooltip = () => {
        setIsTooltipOpen(false)
    }

    if (!sgeConsentFeatureState) return null
    return (
        <Tooltip
            arrow
            placement="top"
            open={isTooltipOpen}
            onOpen={openTooltip}
            onClose={closeTooltip}
            title={
                <div onClick={closeTooltip} onTouchStart={closeTooltip}>
                    <EnedisSgePopup
                        openEnedisSgeConsentText={formatMessage({
                            id: 'Accéder à votre P.max',
                            defaultMessage: 'Accéder à votre P.max',
                        })}
                        TypographyProps={{
                            sx: {
                                color: linksColor || '#FFFFFF',
                                cursor: 'pointer',
                                padding: '4px',
                                fontWeight: 'normal',
                            },
                        }}
                        houseId={currentHousing!.id}
                        createEnedisSgeConsent={createEnedisSgeConsent}
                        createEnedisSgeConsentError={createEnedisSgeConsentError}
                        isCreateEnedisSgeConsentLoading={isCreateEnedisSgeConsentLoading}
                    />
                </div>
            }
        >
            <ErrorOutlineIcon sx={{ color: linksColor || warningMainHashColor, width: '32px', height: '32px' }} />
        </Tooltip>
    )
}
/**
 * Function that returns the Icon element used in the widget.
 *
 * @param params N/A.
 * @param params.widgetTarget Target of the widget.
 * @param params.hasMissingContracts Flag HasMissingContracts, that'll influence which widget icon will be shown.
 * @param params.enphaseOff Enphase Consent is inactive.
 * @param params.enedisSgeOff EnedisSge Consent is not Connected.
 * @returns Icon of the widget or null.
 */
export const getWidgetInfoIcon = ({
    widgetTarget,
    hasMissingContracts,
    enphaseOff,
    enedisSgeOff,
}: getWidgetInfoIconParamsType) => {
    if (hasMissingContracts && widgetTarget === metricTargetsEnum.eurosConsumption) return <EuroWidgetInfoIcon />
    if (enedisSgeOff && widgetTarget === metricTargetsEnum.pMax) return <PMaxWidgetInfoIcon />
    if (enphaseOff && widgetTarget === metricTargetsEnum.totalProduction) return <ProductionWidgetErrorIcon />
    // Otherwise any icon doesn't be shown in the Widget.
    return null
}
