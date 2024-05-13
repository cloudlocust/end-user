import { CircularProgress, Icon, useTheme, Box } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { enphaseConsentStatus } from 'src/modules/Consents/Consents'
import { EnphaseConsentPopup } from 'src/modules/MyHouse/components/MeterStatus/EnphaseConsentPopup'
import { ISolarProductionConsentStatusProps } from 'src/modules/MyHouse/components/MeterStatus/MeterStatus.d'
import ConnectedPlugProductionConsentPopup from 'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/MyHouseConfig'
import { useSolarProductionLinking } from 'src/hooks/SolarProductionLinking'

/**
 * Solar Production Consent Status Component, that shows and isolates the solar production consent of MeterStatus.
 *
 * @param props N/A.
 * @param props.solarProductionConsentLoadingInProgress Indicates whether or not the solar production consent is loading.
 * @param props.solarProductionConsent Solar Production Consent to be shown.
 * @param props.onRevokeEnphaseConsent Handler function to revoke Enphase Consent.
 * @returns Solar Production Consent Status component.
 */
export const SolarProductionConsentStatus = ({
    solarProductionConsentLoadingInProgress,
    solarProductionConsent,
    onRevokeEnphaseConsent,
}: ISolarProductionConsentStatusProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const {
        enphaseLink,
        isEnphaseConsentPopupOpen,
        isConnectedPlugProductionConsentPopupOpen,
        handleOnOpenEnphaseConsentPopup,
        handleOnOpenConnectedPlugConsentPopup,
        handleOnCloseEnphaseConsentPopup,
        handleOnCloseConnectedPlugConsentPopup,
    } = useSolarProductionLinking()

    // Load connected plug only when housing is defined
    const {
        loadingInProgress: isConnectedPlugListLoadingInProgress,
        loadConnectedPlugList,
        associateConnectedPlug,
        getProductionConnectedPlug,
    } = useConnectedPlugList(currentHousing?.id)

    /* Enphase created at date formatted */
    const solarProductionConsentCreatedAt = dayjs(solarProductionConsent?.createdAt).format('DD/MM/YYYY')

    useEffect(() => {
        loadConnectedPlugList()
    }, [loadConnectedPlugList])

    /**
     * Function that renders solarProductionConsent statuses.
     *
     * @param solarProductionConsent Solar Production Consent.
     * @returns JSX according to solarProductionConsent status.
     */
    function renderSolarProductionConsentStatus(solarProductionConsent?: enphaseConsentStatus) {
        switch (solarProductionConsent) {
            case 'ACTIVE':
                const productionConnectedPlug = getProductionConnectedPlug()
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
                                <span className="text-grey-600">
                                    {productionConnectedPlug
                                        ? `${formatMessage({
                                              id: 'Prise Shelly connectée le',
                                              defaultMessage: 'Prise Shelly connectée le',
                                          })} ${dayjs(productionConnectedPlug.createdAt).format('DD/MM/YYYY')}`
                                        : `${formatMessage({
                                              id: 'Onduleur Enphase connecté le',
                                              defaultMessage: 'Onduleur Enphase connecté le',
                                          })} ${solarProductionConsentCreatedAt}`}
                                </span>
                            </span>
                            <TypographyFormatMessage
                                color={theme.palette.primary.main}
                                className="underline cursor-pointer"
                                fontWeight={500}
                                onClick={
                                    currentHousing && productionConnectedPlug
                                        ? async () => {
                                              await associateConnectedPlug(
                                                  productionConnectedPlug.deviceId,
                                                  currentHousing.id,
                                                  currentHousing.meter?.guid,
                                                  false,
                                              )
                                              await loadConnectedPlugList()
                                          }
                                        : async () => {
                                              await onRevokeEnphaseConsent()
                                          }
                                }
                            >
                                Annuler la récolte de mes données
                            </TypographyFormatMessage>
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
                            <TypographyFormatMessage>
                                Pour visualiser votre production solaire :
                            </TypographyFormatMessage>
                            <div className="flex pl-4 gap-4 items-center">
                                <Box
                                    sx={{
                                        borderRadius: '50%',
                                        width: '4px',
                                        height: '4px',
                                        backgroundColor: 'error.main',
                                    }}
                                ></Box>

                                <TypographyFormatMessage
                                    color={theme.palette.error.main}
                                    className="underline cursor-pointer"
                                    fontWeight={600}
                                    onClick={handleOnOpenEnphaseConsentPopup}
                                >
                                    Connectez votre onduleur Enphase
                                </TypographyFormatMessage>
                            </div>
                            {arePlugsUsedBasedOnProductionStatus(currentHousingScopes) && (
                                <>
                                    <TypographyFormatMessage>Ou</TypographyFormatMessage>

                                    <div className="flex pl-4 gap-4 md:items-center">
                                        <div
                                            className="mt-7 md:mt-0"
                                            style={{
                                                borderRadius: '50%',
                                                width: '4px',
                                                height: '4px',
                                                backgroundColor: theme.palette.error.main,
                                            }}
                                        ></div>

                                        <span>
                                            <TypographyFormatMessage
                                                color={theme.palette.error.main}
                                                className="underline cursor-pointer"
                                                fontWeight={600}
                                                onClick={handleOnOpenConnectedPlugConsentPopup}
                                            >
                                                Reliez la prise Shelly de vos panneaux plug&play
                                            </TypographyFormatMessage>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )
        }
    }

    return (
        <>
            {/* Enphase Consent Status */}
            {solarProductionConsentLoadingInProgress || isConnectedPlugListLoadingInProgress ? (
                <CircularProgress size={25} />
            ) : (
                <>
                    <TypographyFormatMessage className="text-xs md:text-sm font-semibold mb-6">
                        Production solaire
                    </TypographyFormatMessage>
                    <div className="flex flex-row items-center">
                        {/* If there is a connected plug that's in production mode, then solarProduction consent is active */}
                        {renderSolarProductionConsentStatus(
                            getProductionConnectedPlug() ? 'ACTIVE' : solarProductionConsent?.enphaseConsentState,
                        )}
                    </div>
                </>
            )}

            {isEnphaseConsentPopupOpen && (
                <EnphaseConsentPopup onClose={handleOnCloseEnphaseConsentPopup} url={enphaseLink} />
            )}
            {isConnectedPlugProductionConsentPopupOpen && (
                <ConnectedPlugProductionConsentPopup onClose={handleOnCloseConnectedPlugConsentPopup} />
            )}
        </>
    )
}
