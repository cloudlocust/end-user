import { Card, useTheme, Icon, CircularProgress } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { MuiCardContent } from 'src/common/ui-kit'
import { MeterStatusProps } from 'src/modules/MyHouse/components/MeterStatus/meterStatus.d'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useEffect } from 'react'
import { enedisConsentStatus, nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import dayjs from 'dayjs'

/* Circular Progress bar put in a const to avoid having to repeazt it multiple times in the code */
const circularProgress = <CircularProgress size={25} />

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
    const { getConsents, consentsLoading, nrlinkConsent, enedisConsent } = useConsents()

    const nrlinkConsentCreatedAt = dayjs(nrlinkConsent?.createdAt).format('DD/MM/YYYY')
    /* To have the ending date of the consent, we add 3 years to the date the consent was made */
    const enedisConsentEndingDate = dayjs(enedisConsent?.createdAt).add(3, 'year').format('DD/MM/YYYY')

    useEffect(() => {
        getConsents(meterGuid)
    }, [getConsents, meterGuid])

    /**
     * Function that renders JSX accorrding to nrlink status.
     *
     * @param nrlinkStatus Different nrlink statuses.
     * @returns JSX according to nrlink Status.
     */
    function renderNrlinkStatus(nrlinkStatus?: nrlinkConsentStatus) {
        switch (nrlinkStatus) {
            case 'CONNECTED':
                return (
                    <>
                        <Icon className="mr-12">
                            <img
                                src="/assets/images/content/housing/consent-status/meter-on.svg"
                                alt="connected-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <span className="text-grey-600">{`nrLink n° ${nrlinkConsent?.nrlinkGuid}`}</span>
                            <span className="text-grey-600">{`Connexion le ${nrlinkConsentCreatedAt}`}</span>
                        </div>
                    </>
                )
            case 'DISCONNECTED':
                return (
                    <>
                        <Icon className="mr-12">
                            <img src="/assets/images/content/housing/consent-status/meter-error.svg" alt="error-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage color={theme.palette.warning.main} className="underline">
                                Veuillez vérifier le branchement de votre appareil et/ou la connexion wifi.
                            </TypographyFormatMessage>
                        </div>
                    </>
                )
            case 'EXPIRED':
            case 'NONEXISTENT':
                return (
                    <>
                        <Icon className="mr-12">
                            <img src="/assets/images/content/housing/consent-status/meter-off.svg" alt="off-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <NavLink to={{ pathname: '/nrlink-connection-steps' }}>
                                <TypographyFormatMessage color={theme.palette.error.main} className="underline">
                                    Connectez votre nrLINK pour visualiser votre consommation.
                                </TypographyFormatMessage>
                            </NavLink>
                        </div>
                    </>
                )
            default:
                return (
                    <>
                        <Icon className="mr-12">
                            <img src="/assets/images/content/housing/consent-status/meter-off.svg" alt="off-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage color={theme.palette.error.main} className="underline">
                                C'est erreur est survenue.
                            </TypographyFormatMessage>
                        </div>
                    </>
                )
        }
    }

    /**
     * Function that renders JSX accorrding to enedis status.
     *
     * @param enedisConsent Different nrlink statuses.
     * @returns JSX according to enedis Status.
     */
    function renderEnedisStatus(enedisConsent?: enedisConsentStatus) {
        switch (enedisConsent) {
            case 'CONNECTED':
                return (
                    <>
                        <Icon className="mr-12">
                            <img
                                src="/assets/images/content/housing/consent-status/meter-on.svg"
                                alt="connected-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <span className="text-grey-600">Date de fin de consentement</span>
                            <span className="text-grey-600">{enedisConsentEndingDate}</span>
                        </div>
                    </>
                )
            case 'EXPIRED':
            case 'NONEXISTENT':
                return (
                    <>
                        <Icon className="mr-12">
                            <img src="/assets/images/content/housing/consent-status/meter-off.svg" alt="off-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage color={theme.palette.error.main} className="underline">
                                Autorisez la récupération de vos données de consommation pour avoir accès à votre
                                historique.
                            </TypographyFormatMessage>
                        </div>
                    </>
                )
        }
    }

    return (
        <Card className="my-12 md:mx-16" variant="outlined">
            <MuiCardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <div className="flex flex-row justify-between bg-grey-200 p-12 border-b-1 border-grey-300">
                    <div className="flex flex-col justify-between">
                        <TypographyFormatMessage className="text-base font-medium">Compteur</TypographyFormatMessage>
                        {meterGuid ? (
                            <span className="text-grey-600 text-base">{`n° ${meterGuid}`}</span>
                        ) : (
                            /* TODO: To be worked on in another story. It should open a pop up to add a meterr. */
                            <TypographyFormatMessage className="underline text-blue hover:text-blue-900 cursor-pointer">
                                Veuillez renseigner votre compteur
                            </TypographyFormatMessage>
                        )}
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
                <div className="flex flex-col md:flex-row">
                    {/* Nrlink Consent Status */}
                    <div className="w-full md:w-1/3 p-12 border-b-1 border-grey-300">
                        {!meterGuid ? (
                            <>
                                <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                    Consommation en temps réel
                                </TypographyFormatMessage>
                                <div className="flex flex-row items-center">{renderNrlinkStatus('NONEXISTENT')}</div>
                            </>
                        ) : consentsLoading ? (
                            circularProgress
                        ) : (
                            <>
                                <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                    Consommation en temps réel
                                </TypographyFormatMessage>
                                <div className="flex flex-row items-center">
                                    {renderNrlinkStatus(nrlinkConsent?.nrlinkConsentState)}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Enedis Consent Status */}
                    {/* TODO: To be worked on in MYEM-2555 */}
                    <div className="w-full md:w-1/3 p-12 border-b-1 border-grey-300">
                        {!meterGuid ? (
                            <>
                                <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                    Historique de consommation
                                </TypographyFormatMessage>
                                <div className="flex flex-row items-center">{renderEnedisStatus('NONEXISTENT')}</div>
                            </>
                        ) : consentsLoading ? (
                            circularProgress
                        ) : (
                            <>
                                <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                    Historique de consommation
                                </TypographyFormatMessage>
                                <div className="flex flex-row items-center">
                                    {renderEnedisStatus(enedisConsent?.enedisConsentState)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </MuiCardContent>
        </Card>
    )
}
