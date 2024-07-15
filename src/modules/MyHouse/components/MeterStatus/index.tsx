import 'src/modules/MyHouse/components/MeterStatus/SolarProductionStatus/MeterStatus.scss'
import { Card, CircularProgress, Icon, Tooltip, styled, useTheme } from '@mui/material'
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { MuiCardContent } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { enedisSgeConsentStatus, nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { sgeConsentFeatureState, sgeConsentFeatureStatePopup } from 'src/modules/MyHouse/MyHouseConfig'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseVariables'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { NrlinkConnectionStepsEnum } from 'src/modules/nrLinkConnection/nrlinkConnectionSteps.d'
import { RootState } from 'src/redux'
import { ReplaceNRLinkModule } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/ReplaceNRLinkModule'
import MeterInfos from 'src/modules/MyHouse/components/MeterInfo'
import { HousingAddressCard } from 'src/modules/MyHouse/components/HousingAddressCard'
// import { SolarProductionConsentStatus } from 'src/modules/MyHouse/components/MeterStatus/SolarProductionStatus'
import { RevokeNrlinkConsent } from 'src/modules/MyHouse/components/RevokeNrlinkConsent'
// import { isProductionActiveAndHousingHasAccess } from 'src/modules/MyHouse/MyHouseConfig'
import clsx from 'clsx'
import { useModal } from 'src/hooks/useModal'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import useEnphaseConsentChecker from 'src/hooks/useEnphaseConsentChecker'

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
 * Component for UnSynchronizedInfoDialog.
 *
 * @param param0 N/A.
 * @param param0.open Open state of the dialog.
 * @param param0.onClose Callback function to close the dialog.
 * @returns UnSynchronizedInfoDialog component.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
function UnSynchronizedInfoDialog({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Typography>
                    Afin que nous puissions faire un rapport à Enedis, veuillez contacter le service client par mail à{' '}
                    <strong>contact@myem.fr</strong> <span>avec les informations suivantes : N°nrLINK et N° PDL.</span>
                </Typography>
                <Typography>
                    <strong>Important : </strong>L'objet du mail doit être code erreur : <strong>unsynchronised</strong>
                </Typography>
            </DialogContent>
        </Dialog>
    )
}

/**
 * Meter Status Component.
 *
 * @returns Meter Status component with different status for Nrlibk & Enedis.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const MeterStatus = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const {
        getConsents,
        consentsLoading,
        nrlinkConsent,
        enedisSgeConsent,
        createEnedisSgeConsent,
        isCreateEnedisSgeConsentLoading,
        createEnedisSgeConsentError,
        // enphaseConsent,
        // isEnphaseConsentLoading,
        // revokeEnphaseConsent,
        revokeNrlinkConsent,
    } = useConsents()
    const {
        currentHousing,
        // currentHousingScopes
    } = useSelector(({ housingModel }: RootState) => housingModel)
    const [openCancelCollectionDataTooltip, setOpenCancelCollectionDataTooltip] = useState(false)
    const {
        closeModal: closeUnsynchronizedInfoDialog,
        isOpen: isUnsynchronizedInfoDialogOpen,
        openModal: openUnsynchronizedInfoDialog,
    } = useModal()

    // const isProductionActive = isProductionActiveAndHousingHasAccess(currentHousingScopes)

    /*  Nrlink created at date formatted */
    const nrlinkConsentCreatedAt = dayjs(nrlinkConsent?.createdAt).format(FORMATTED_DATA)
    /* To have the ending date of the consent, we add 3 years to the date the consent was made */
    const enedisConsentEndingDate = dayjs(enedisSgeConsent?.createdAt).add(3, 'year').format('DD/MM/YYYY')

    useEnphaseConsentChecker(currentHousing, getConsents)

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
                        <div className="flex flex-1 justify-end">
                            <ReplaceNRLinkModule
                                nrLinkConsent={nrlinkConsent}
                                onAfterReplaceNRLink={() => {
                                    getConsents(currentHousing?.id)
                                }}
                            />
                            <RevokeNrlinkConsent
                                nrLinkConsent={nrlinkConsent}
                                revokeNrlinkConsent={revokeNrlinkConsent}
                            />
                        </div>
                    </>
                )
            case 'DISCONNECTED':
                return (
                    <div className="flex flex-col">
                        {nrlinkConsent?.nrlinkGuid ? (
                            <div className="flex flex-row items-center">
                                <TypographyFormatMessage
                                    color={theme.palette.grey[700]}
                                    fontWeight={600}
                                    className="pb-4"
                                >
                                    {`nrLINK N° ${nrlinkConsent?.nrlinkGuid}`}
                                </TypographyFormatMessage>
                                <div className="flex flex-1 justify-end">
                                    <ReplaceNRLinkModule
                                        nrLinkConsent={nrlinkConsent}
                                        onAfterReplaceNRLink={() => {
                                            getConsents(currentHousing?.id)
                                        }}
                                    />
                                    <RevokeNrlinkConsent
                                        nrLinkConsent={nrlinkConsent}
                                        revokeNrlinkConsent={revokeNrlinkConsent}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="flex flex-row items-center">
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
                        </div>
                    </div>
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
                                    pathname: `/nrlink-connection-steps/${currentHousing?.id}`,
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
                                Les données de votre récolte d'historique semblent incohérentes par rapport à celle de
                                votre nrLINK
                            </TypographyFormatMessage>
                            <TypographyFormatMessage
                                className="italic underline font-600 cursor-pointer"
                                color={theme.palette.grey[500]}
                                onClick={() => openUnsynchronizedInfoDialog()}
                            >
                                Que faire ?
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
                                houseId={currentHousing?.id}
                                createEnedisSgeConsent={createEnedisSgeConsent}
                                createEnedisSgeConsentError={createEnedisSgeConsentError}
                                isCreateEnedisSgeConsentLoading={isCreateEnedisSgeConsentLoading}
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
                    <HousingAddressCard />
                    <div
                        className={`flex flex-row justify-between bg-gray-50 p-12 border-t-1 border-b-1 border-slate-600`}
                    >
                        <MeterInfos element={currentHousing!} />
                        <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`} className="flex">
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
                    <div className={clsx('flex flex-col md:flex-row items-stretch consents-container')}>
                        {/* Nrlink Consent Status */}
                        <div>
                            {consentsLoading ? (
                                <div className="circular-progress">
                                    <CircularProgress size={25} />
                                </div>
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

                        {/* Enedis Consent Status */}
                        <Tooltip
                            arrow
                            placement="top"
                            disableHoverListener={sgeConsentFeatureState}
                            title={formatMessage({
                                id: `${sgeConsentFeatureStatePopup}`,
                                defaultMessage: `${sgeConsentFeatureStatePopup}`,
                            })}
                        >
                            <div className={!sgeConsentFeatureState ? 'cursor-not-allowed' : ''}>
                                {consentsLoading ? (
                                    <div className="circular-progress">
                                        <CircularProgress size={25} />
                                    </div>
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
                        {/* TO-ENABLE-SOMEDAY */}
                        {/* {['CONNECTED', 'DISCONNECTED'].includes(nrlinkConsent?.nrlinkConsentState ?? '') && (
                            <div className={!isProductionActive ? 'hidden' : ''}>
                                <SolarProductionConsentStatus
                                    solarProductionConsentLoadingInProgress={consentsLoading || isEnphaseConsentLoading}
                                    solarProductionConsent={enphaseConsent}
                                    onRevokeEnphaseConsent={async () => {
                                        // When revoking enphase Consent means there is currentHousing!.meter.guid
                                        await revokeEnphaseConsent(currentHousing!.id)
                                        getConsents(currentHousing?.id)
                                    }}
                                />
                            </div>
                        )} */}
                    </div>
                </MuiCardContent>
            </Card>

            {isUnsynchronizedInfoDialogOpen && (
                <UnSynchronizedInfoDialog
                    open={isUnsynchronizedInfoDialogOpen}
                    onClose={closeUnsynchronizedInfoDialog}
                />
            )}
        </>
    )
}
