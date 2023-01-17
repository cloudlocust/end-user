import React from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import {
    DefaultContractWarningProps,
    ConsumptionEnedisSgeWarningProps,
} from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useIntl } from 'react-intl'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { useConsents } from 'src/modules/Consents/consentsHook'

/**
 * Default Contract Warning message component.
 *
 * @param props N/A.
 * @param props.isShowWarning Indicates if the Default Contract Warning should be shown.
 * @returns Default Contract Warning message component.
 */
export const DefaultContractWarning = ({ isShowWarning }: DefaultContractWarningProps) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    if (!isShowWarning) return <></>
    return (
        <div className="flex items-center justify-center flex-col mt-12">
            <ErrorOutlineIcon
                sx={{
                    color: warningMainHashColor,
                    width: { xs: '24px', md: '32px' },
                    height: { xs: '24px', md: '32px' },
                    margin: { xs: '0 0 4px 0', md: '0 8px 0 0' },
                }}
            />

            <div className="w-full">
                <TypographyFormatMessage
                    sx={{ color: warningMainHashColor }}
                    className="text-13 md:text-16 text-center"
                >
                    {
                        "Ce graphe est un exemple basé sur un tarif Bleu EDF Base. Vos données contractuelles de fourniture d'énergie ne sont pas disponibles sur toute la période."
                    }
                </TypographyFormatMessage>
                <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}>
                    <TypographyFormatMessage
                        className="underline text-13 md:text-16 text-center"
                        sx={{ color: warningMainHashColor }}
                    >
                        Renseigner votre contrat d'énergie
                    </TypographyFormatMessage>
                </NavLink>
            </div>
        </div>
    )
}

/**
 * Consumption History Warning message component.
 *
 * @param props N/A.
 * @param props.isShowWarning Indicates if the Consumption History Warning should be shown.
 * @returns Consumption History Warning message component.
 */
export const ConsumptionEnedisSgeWarning = ({ isShowWarning }: ConsumptionEnedisSgeWarningProps) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { formatMessage } = useIntl()
    const { createEnedisSgeConsent, isCreateEnedisSgeConsentLoading, createEnedisSgeConsentError } = useConsents()

    if (!isShowWarning) return <></>
    return (
        <div className="flex items-center justify-center flex-col mt-12">
            <ErrorOutlineIcon
                sx={{
                    color: warningMainHashColor,
                    width: { xs: '24px', md: '32px' },
                    height: { xs: '24px', md: '32px' },
                    margin: { xs: '0 0 4px 0', md: '0 8px 0 0' },
                }}
            />

            <EnedisSgePopup
                openEnedisSgeConsentText={formatMessage({
                    id: 'Accéder à votre historique de consommation',
                    defaultMessage: 'Accéder à votre historique de consommation',
                })}
                TypographyProps={{
                    sx: {
                        color: warningMainHashColor,
                        cursor: 'pointer',
                        fontWeight: '400',
                        textAlign: 'center',
                        fontSize: { xs: '13px', md: '16px' },
                    },
                }}
                houseId={currentHousing!.id}
                createEnedisSgeConsent={createEnedisSgeConsent}
                createEnedisSgeConsentError={createEnedisSgeConsentError}
                isCreateEnedisSgeConsentLoading={isCreateEnedisSgeConsentLoading}
            />
        </div>
    )
}
