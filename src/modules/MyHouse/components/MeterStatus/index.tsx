import { Card, useTheme, Icon, CircularProgress } from '@mui/material'
import { NavLink, useParams } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { MuiCardContent } from 'src/common/ui-kit'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useEffect, useState } from 'react'
import { enedisSgeConsentStatus, nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { NrlinkConnectionStepsEnum } from 'src/modules/nrLinkConnection/nrlinkConnectionSteps.d'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
/**
 * Meter Status Component.
 *
 * @returns Meter Status component with different status for Nrlibk & Enedis.
 */
export const MeterStatus = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { getConsents, consentsLoading, nrlinkConsent, enedisSgeConsent } = useConsents()
    const { housingList } = useSelector(({ housingModel }: RootState) => housingModel)
    const [foundHousing, setFoundHousing] = useState<IHousing>()

    // Retrieving house id from url params /my-houses/:houseId
    // eslint-disable-next-line jsdoc/require-jsdoc
    const { houseId }: { houseId: string } = useParams()

    const nrlinkConsentCreatedAt = dayjs(nrlinkConsent?.createdAt).format('DD/MM/YYYY')
    /* To have the ending date of the consent, we add 3 years to the date the consent was made */
    const enedisConsentEndingDate = dayjs(enedisSgeConsent?.createdAt).add(3, 'year').format('DD/MM/YYYY')

    // UseEffect that find the housing with the house Id from url params.
    useEffect(() => {
        if (housingList) {
            setFoundHousing(housingList.find((housing) => housing.id === parseInt(houseId)))
        }
    }, [houseId, housingList])

    // UseEffect that fetches the consents with the found housing meter
    useEffect(() => {
        if (foundHousing?.meter?.guid) {
            getConsents(foundHousing?.meter?.guid)
        }
    }, [getConsents, foundHousing])

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
                            <span className="text-grey-600">{`${formatMessage({
                                id: 'nrLink n°',
                                defaultMessage: 'nrLink n°',
                            })} ${nrlinkConsent?.nrlinkGuid}`}</span>
                            <span className="text-grey-600">{`${formatMessage({
                                id: 'Connexion le',
                                defaultMessage: 'Connexion le',
                            })} ${nrlinkConsentCreatedAt}`}</span>
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
                            <TypographyFormatMessage color={theme.palette.warning.main} fontWeight={600}>
                                Veuillez vérifier le branchement de votre appareil et/ou la connexion wifi.
                            </TypographyFormatMessage>
                        </div>
                    </>
                )
            case 'EXPIRED':
            case 'NONEXISTENT':
            default:
                return (
                    <>
                        <Icon className="mr-12">
                            <img src="/assets/images/content/housing/consent-status/meter-off.svg" alt="off-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <NavLink
                                to={{
                                    pathname: '/nrlink-connection-steps',
                                    state: {
                                        activeStep: NrlinkConnectionStepsEnum.secondStep,
                                    },
                                }}
                            >
                                <TypographyFormatMessage
                                    color={theme.palette.error.main}
                                    className="underline"
                                    fontWeight={600}
                                >
                                    Connectez votre nrLINK pour visualiser votre consommation.
                                </TypographyFormatMessage>
                            </NavLink>
                        </div>
                    </>
                )
        }
    }

    /**
     * Function that renders JSX accorrding to enedis status.
     *
     * @param enedisSgeConsent Different enedis sge statuses.
     * @returns JSX according to enedis Status.
     */
    function renderEnedisStatus(enedisSgeConsent?: enedisSgeConsentStatus) {
        switch (enedisSgeConsent) {
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
                            <TypographyFormatMessage className="text-grey-600">
                                Date de fin de consentement
                            </TypographyFormatMessage>
                            <span className="text-grey-600">{enedisConsentEndingDate}</span>
                        </div>
                    </>
                )
            case 'EXPIRED':
            case 'NONEXISTENT':
            default:
                return (
                    <>
                        <Icon className="mr-12">
                            <img src="/assets/images/content/housing/consent-status/meter-off.svg" alt="off-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <EnedisSgePopup
                                openEnedisSgeConsentText={formatMessage({
                                    id: 'Autorisez la récupération de vos données de consommation pour avoir accès à votre historique.',
                                    defaultMessage:
                                        'Autorisez la récupération de vos données de consommation pour avoir accès à votre historique.',
                                })}
                                TypographyProps={{
                                    color: theme.palette.error.main,
                                }}
                                houseId={parseInt(houseId)}
                            />
                        </div>
                    </>
                )
        }
    }

    return (
        <>
            <Card className="my-12 md:mx-16" variant="outlined">
                <MuiCardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <div className="flex flex-row justify-between bg-grey-200 p-12 border-b-1 border-grey-300">
                        <div className="flex flex-col justify-between">
                            <TypographyFormatMessage className="text-base font-medium">
                                Compteur
                            </TypographyFormatMessage>
                            {foundHousing?.meter?.guid ? (
                                <span className="text-grey-600 text-base">{`n° ${foundHousing?.meter?.guid}`}</span>
                            ) : (
                                <TypographyFormatMessage className="text-grey-600 text-base">
                                    Aucun compteur renseigné
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
                    <div className="flex flex-col md:flex-row justify-evenly items-center">
                        {/* Nrlink Consent Status */}
                        <div className="w-full md:w-1/3 p-12 border-b-1 border-grey-300 md:border-b-0">
                            {!foundHousing ? (
                                <>
                                    <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                        Consommation en temps réel
                                    </TypographyFormatMessage>
                                    <div className="flex flex-row items-center">
                                        {renderNrlinkStatus('NONEXISTENT')}
                                    </div>
                                </>
                            ) : consentsLoading ? (
                                <CircularProgress size={25} />
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
                        <div className="w-full md:w-1/3 p-12 border-b-1 border-grey-300">
                            {!foundHousing ? (
                                <>
                                    <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                        Historique de consommation
                                    </TypographyFormatMessage>
                                    <div className="flex flex-row items-center">
                                        {renderEnedisStatus('NONEXISTENT')}
                                    </div>
                                </>
                            ) : consentsLoading ? (
                                <CircularProgress size={25} />
                            ) : (
                                <>
                                    <TypographyFormatMessage className="text-xs md:text-sm font-semibold">
                                        Historique de consommation
                                    </TypographyFormatMessage>
                                    <div className="flex flex-row items-center">
                                        {renderEnedisStatus(enedisSgeConsent?.enedisSgeConsentState)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </MuiCardContent>
            </Card>
        </>
    )
}
