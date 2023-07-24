import { Card, CircularProgress, Divider, Icon, Tooltip, styled, useMediaQuery, useTheme } from '@mui/material'
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { MuiCardContent } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { enedisSgeConsentStatus, enphaseConsentStatus, nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { URL_MY_HOUSE, globalProductionFeatureState, sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { EnphaseConsentPopup } from 'src/modules/MyHouse/components/MeterStatus/EnphaseConsentPopup'
import { NrlinkConnectionStepsEnum } from 'src/modules/nrLinkConnection/nrlinkConnectionSteps.d'
import { RootState } from 'src/redux'
import { ReplaceNRLinkModule } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/ReplaceNRLinkModule'
import MeterInfos from 'src/modules/MyHouse/components/MeterInfo'

const FORMATTED_DATA = 'DD/MM/YYYY'
const TEXT_CONNEXION_LE = 'Connexion le'

/**
 * GreyTooltip: Styled tooltip with Grey background.
 * TODO: Add reusable Styled tooltip.
 */
const GreyTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.grey.A400,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.grey.A400,
        color: 'rgba(0, 0, 0, 0.87)',
        padding: 10,
        fontSize: 11,
    },
}))

/**
 * Meter Status Component.
 *
 * @returns Meter Status component with different status for Nrlibk & Enedis.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const MeterStatus = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const {
        getConsents,
        consentsLoading,
        nrlinkConsent,
        enedisSgeConsent,
        createEnedisSgeConsent,
        isCreateEnedisSgeConsentLoading,
        createEnedisSgeConsentError,
        enphaseConsent,
        enphaseLink,
        getEnphaseLink,
    } = useConsents()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [openEnphaseConsentPopup, setOpenEnphaseConsentPopup] = useState(false)
    const [openCancelCollectionDataTooltip, setOpenCancelCollectionDataTooltip] = useState(false)

    // Retrieving house id from url params /my-houses/:houseId
    // eslint-disable-next-line jsdoc/require-jsdoc
    const { houseId }: { houseId: string } = useParams()

    /*  Nrlink created at date formatted */
    const nrlinkConsentCreatedAt = dayjs(nrlinkConsent?.createdAt).format(FORMATTED_DATA)
    /* To have the ending date of the consent, we add 3 years to the date the consent was made */
    const enedisConsentEndingDate = dayjs(enedisSgeConsent?.createdAt).add(3, 'year').format('DD/MM/YYYY')
    /* Enphase created at date formatted */
    const enphaseConsentCreatedAt = dayjs(enphaseConsent?.createdAt).format(FORMATTED_DATA)

    /**
     * Function that handle closing the popup.
     */
    const handleOnCloseEnphasePopup = () => {
        setOpenEnphaseConsentPopup(false)
    }

    /**
     * This useEffect listen to changes in localStorage for enphaseConsentState.
     *
     * It also listen to changes in currentHousing that triggers getConsents.
     *
     */
    useEffect(() => {
        getConsents(currentHousing?.meter?.guid, currentHousing?.id)

        /**
         * OnStorage function that execute the setter for EnphaseStateFromLocalStorage.
         */
        const onStorage = () => {
            const enphaseConfirmConsentState = localStorage.getItem('enphaseConfirmState')
            if (enphaseConfirmConsentState === 'SUCCESS' && currentHousing?.meter?.guid) {
                localStorage.removeItem('enphaseConfirmState')
                getConsents(currentHousing.meter.guid)
            }
        }

        /**
         * Listen to localStorage changes.
         */
        window.addEventListener('storage', onStorage)

        /**
         * Clear up function when the component unmounts.
         */
        return () => {
            window.removeEventListener('storage', onStorage)
        }
    }, [currentHousing?.meter?.guid, currentHousing?.id, getConsents])

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
                                src="./assets/images/content/housing/consent-status/meter-on.svg"
                                alt="connected-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <span className="text-grey-600">{`${formatMessage({
                                id: 'nrLINK n°',
                                defaultMessage: 'nrLINK n°',
                            })} ${nrlinkConsent?.nrlinkGuid}`}</span>
                            <span className="text-grey-600">{`${formatMessage({
                                id: TEXT_CONNEXION_LE,
                                defaultMessage: TEXT_CONNEXION_LE,
                            })} ${nrlinkConsentCreatedAt}`}</span>
                        </div>
                        <ReplaceNRLinkModule
                            nrLinkConsent={nrlinkConsent}
                            onAfterReplaceNRLink={() => {
                                getConsents(currentHousing?.meter?.guid, parseInt(houseId))
                            }}
                        />
                    </>
                )
            case 'DISCONNECTED':
                return (
                    <>
                        <Icon className="mr-12">
                            <img
                                src="./assets/images/content/housing/consent-status/meter-error.svg"
                                alt="error-icon"
                            />
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
                            <img src="./assets/images/content/housing/consent-status/meter-off.svg" alt="off-icon" />
                        </Icon>
                        <div className="flex flex-col">
                            <NavLink
                                to={{
                                    pathname: `/nrlink-connection-steps/${parseInt(houseId)}`,
                                    state: {
                                        activeStep: currentHousing?.meter?.guid
                                            ? NrlinkConnectionStepsEnum.thirdStep
                                            : NrlinkConnectionStepsEnum.secondStep,
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
                                src="./assets/images/content/housing/consent-status/meter-on.svg"
                                alt="connected-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage className="text-grey-600">
                                Date de fin de consentement
                            </TypographyFormatMessage>
                            <span className="text-grey-600">{enedisConsentEndingDate}</span>
                            <GreyTooltip
                                arrow
                                placement="top-end"
                                open={openCancelCollectionDataTooltip}
                                onClose={() => setOpenCancelCollectionDataTooltip(false)}
                                onClick={() => setOpenCancelCollectionDataTooltip((prevState) => !prevState)}
                                title={formatMessage({
                                    id: 'Contacter support@myem.fr',
                                    defaultMessage: 'Contacter support@myem.fr',
                                })}
                            >
                                <div>
                                    <TypographyFormatMessage
                                        className="underline cursor-pointer"
                                        color={theme.palette.primary.main}
                                        fontWeight={500}
                                    >
                                        Annuler la récolte de mes données
                                    </TypographyFormatMessage>
                                </div>
                            </GreyTooltip>
                        </div>
                    </>
                )
            case 'UNSYNCHRONIZED':
                return (
                    <>
                        <Icon className="mr-12">
                            <img
                                src="./assets/images/content/housing/consent-status/meter-error.svg"
                                alt="sge-error-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage color={theme.palette.warning.main} fontWeight={600}>
                                Les données de votre récolte dhistorique semblent incohérentes par rapport à celle de
                                votre nrLINK
                            </TypographyFormatMessage>
                        </div>
                    </>
                )
            case 'EXPIRED':
            case 'NONEXISTENT':
            default:
                return (
                    <>
                        {!sgeConsentFeatureState ? (
                            <Icon className="mr-12 text-grey-600">
                                <img
                                    src="./assets/images/content/housing/consent-status/meter-disabled.svg"
                                    alt="off-icon"
                                />
                            </Icon>
                        ) : (
                            <Icon className="mr-12 text-grey-600">
                                <img
                                    src="./assets/images/content/housing/consent-status/meter-off.svg"
                                    alt="off-icon"
                                />
                            </Icon>
                        )}
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
                                createEnedisSgeConsent={createEnedisSgeConsent}
                                createEnedisSgeConsentError={createEnedisSgeConsentError}
                                isCreateEnedisSgeConsentLoading={isCreateEnedisSgeConsentLoading}
                            />
                        </div>
                    </>
                )
        }
    }

    /**
     * Function that renders enphase statuses.
     *
     * @param enphaseStatus Enphase statuses.
     * @returns JSX according to enphase status.
     */
    function renderEnphaseStatus(enphaseStatus?: enphaseConsentStatus) {
        switch (enphaseStatus) {
            case 'ACTIVE':
                return (
                    <>
                        <Icon className="mr-12">
                            <img
                                src="./assets/images/content/housing/consent-status/meter-on.svg"
                                alt="enphase-active-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <span className="text-grey-600">
                                <span className="text-grey-600">{`${formatMessage({
                                    id: TEXT_CONNEXION_LE,
                                    defaultMessage: TEXT_CONNEXION_LE,
                                })} ${enphaseConsentCreatedAt}`}</span>
                            </span>
                        </div>
                    </>
                )
            case 'PENDING':
                return (
                    <>
                        <Icon className="mr-12" color="warning">
                            replay
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage color={theme.palette.warning.main} fontWeight={600}>
                                Votre connexion est en cours et sera active dans les plus brefs délais
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
                            <img
                                src="./assets/images/content/housing/consent-status/meter-off.svg"
                                alt="enphase-off-icon"
                            />
                        </Icon>
                        <div className="flex flex-col">
                            <TypographyFormatMessage
                                color={theme.palette.error.main}
                                className="underline cursor-pointer"
                                fontWeight={600}
                                onClick={() => {
                                    getEnphaseLink(parseInt(houseId))
                                    setOpenEnphaseConsentPopup(true)
                                }}
                            >
                                Connectez votre onduleur pour visualiser votre production
                            </TypographyFormatMessage>
                        </div>
                    </>
                )
        }
    }

    return (
        <>
            <Card className="my-12 md:mx-16" variant="outlined">
                <MuiCardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <div className={`flex flex-row justify-between bg-grey-200 p-12 border-b-1 border-grey-300`}>
                        <MeterInfos element={currentHousing!} />
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
                    <div
                        className={`flex flex-col md:flex-row ${
                            !globalProductionFeatureState ? 'justify-between' : 'justify-evenly'
                        } items-center`}
                    >
                        {/* Nrlink Consent Status */}
                        <div className="w-full md:w-1/3 p-12">
                            {consentsLoading ? (
                                <CircularProgress size={25} />
                            ) : (
                                <>
                                    <TypographyFormatMessage className="text-xs md:text-sm font-semibold mb-6">
                                        Consommation en temps réel
                                    </TypographyFormatMessage>
                                    <div className="flex flex-row items-center">
                                        {renderNrlinkStatus(nrlinkConsent?.nrlinkConsentState)}
                                    </div>
                                </>
                            )}
                        </div>
                        <Divider orientation={mdDown ? 'horizontal' : undefined} flexItem variant="fullWidth" />

                        {/* Enedis Consent Status */}
                        <Tooltip
                            arrow
                            placement="top"
                            disableHoverListener={sgeConsentFeatureState}
                            title={formatMessage({
                                id: "Cette fonctionnalité n'est pas encore disponible",
                                defaultMessage: "Cette fonctionnalité n'est pas encore disponible",
                            })}
                        >
                            <div className={`w-full md:w-1/3 p-12 ${!sgeConsentFeatureState && 'cursor-not-allowed'}`}>
                                {consentsLoading ? (
                                    <CircularProgress size={25} />
                                ) : (
                                    <>
                                        <TypographyFormatMessage className="text-xs md:text-sm font-semibold mb-6">
                                            Historique de consommation
                                        </TypographyFormatMessage>
                                        <div className="flex flex-row items-center">
                                            {renderEnedisStatus(enedisSgeConsent?.enedisSgeConsentState)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </Tooltip>
                        <Divider orientation={mdDown ? 'horizontal' : undefined} flexItem variant="fullWidth" />
                        {/* Enphase Consent Status */}
                        <div className={`w-full md:w-1/3 p-12 ${!globalProductionFeatureState && 'hidden'}`}>
                            {consentsLoading ? (
                                <CircularProgress size={25} />
                            ) : (
                                <>
                                    <TypographyFormatMessage className="text-xs md:text-sm font-semibold mb-6">
                                        Production solaire
                                    </TypographyFormatMessage>
                                    <div className="flex flex-row items-center">
                                        {renderEnphaseStatus(enphaseConsent?.enphaseConsentState)}
                                    </div>
                                </>
                            )}
                        </div>
                        {openEnphaseConsentPopup && (
                            <EnphaseConsentPopup onClose={handleOnCloseEnphasePopup} url={enphaseLink} />
                        )}
                    </div>
                </MuiCardContent>
            </Card>
        </>
    )
}
