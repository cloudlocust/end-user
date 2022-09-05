import { Card, useTheme, Icon } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { MuiCardContent } from 'src/common/ui-kit'
import { MeterStatusProps } from 'src/modules/MyHouse/components/MeterStatus/meterStatus.d'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * Meter Status Component.
 *
 * @param param0 N/A.
 * @param param0.houseId House Id coming from parent.
 * @param param0.meterGuid MeterGuid of the actual house's meter.
 * @returns Meter Status component with different status for Nrlibk & Enedis.
 */
export const MeterStatus = ({ houseId, meterGuid }: MeterStatusProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    return (
        <Card className="my-12 md:mx-16" variant="outlined">
            <MuiCardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <div className="flex flex-row justify-between bg-grey-200 p-12 border-b-1 border-grey-300">
                    <div className="flex flex-col justify-between">
                        <TypographyFormatMessage className="text-base font-medium">Compteur</TypographyFormatMessage>
                        <span className="text-grey-600 text-base">{`n° ${meterGuid}`}</span>
                    </div>
                    <NavLink to={`${URL_MY_HOUSE}/${houseId}/contracts`} className="flex">
                        <Card className="flex flex-col items-center rounded p-8">
                            <ContractIcon
                                style={{ fill: theme.palette.primary.main, marginBottom: '4px' }}
                                height={35}
                            />
                            <TypographyFormatMessage
                                variant="subtitle1"
                                color="CaptionText"
                                className="text-10 font-semibold"
                            >
                                Contrat
                            </TypographyFormatMessage>
                        </Card>
                    </NavLink>
                </div>
                <div className="flex flex-col md:flex-row justify-around">
                    {/* Nrlink Consent Status */}
                    <div className="p-12 border-b-1 border-grey-300">
                        <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                            Consommation en temps réel
                        </TypographyFormatMessage>
                        <div className="flex flex-row items-center">
                            <Icon className="mr-12">
                                <img
                                    src="/assets/images/content/housing/consent-status/meter-on.svg"
                                    alt="meter-status"
                                />
                            </Icon>
                            {/* TODO: MYEM-2951 To be remplaced by consent api response */}
                            <div className="flex flex-col">
                                <span className="text-grey-600">nrLink n° 0CA2F4OOFFO45O65</span>
                                <span className="text-grey-600">
                                    {formatMessage({ defaultMessage: 'Connexion le', id: 'Connexion le' })} 05/03/2020
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Enedis Consent Status */}
                    {/* TODO: Remove hidden class in MYEM-2555 */}
                    <div className="p-12 border-b-1 border-grey-300 hidden">
                        <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                            Historique de consommation
                        </TypographyFormatMessage>
                        <div className="flex flex-row items-center">
                            <Icon className="mr-12">
                                <img
                                    src="/assets/images/content/housing/consent-status/meter-on.svg"
                                    alt="meter-status"
                                />
                            </Icon>
                            {/* TODO: MYEM-2951 To be remplaced by consent api response */}
                            <div className="flex flex-col">
                                <span className="text-grey-600">Date de fin de consentement</span>
                                <span className="text-grey-600">01/01/2030</span>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiCardContent>
        </Card>
    )
}
