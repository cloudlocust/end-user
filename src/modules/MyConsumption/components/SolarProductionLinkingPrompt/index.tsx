import { useTheme, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EnphaseConsentPopup } from 'src/modules/MyHouse/components/MeterStatus/EnphaseConsentPopup'
import ConnectedPlugProductionConsentPopup from 'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup'
import { useSolarProductionLinking } from 'src/hooks/SolarProductionLinking'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/MyHouseConfig'
import { useCurrentHousingScopes } from 'src/hooks/CurrentHousing'

/**
 * Renders a prompt to facilitate linking solar production to the application.
 * Users can link either through Enphase inverters or through connected plug production.
 *
 * @returns Returns the JSX for the SolarProductionLinkingPrompt component.
 */
const SolarProductionLinkingPrompt = (): JSX.Element => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    const currentHousingScopes = useCurrentHousingScopes()
    const {
        enphaseLink,
        isEnphaseConsentPopupOpen,
        isConnectedPlugProductionConsentPopupOpen,
        handleOnOpenEnphaseConsentPopup,
        handleOnOpenConnectedPlugConsentPopup,
        handleOnCloseEnphaseConsentPopup,
        handleOnCloseConnectedPlugConsentPopup,
    } = useSolarProductionLinking()

    return (
        <>
            <div className="flex flex-col items-center pt-40 px-16 h-full bg-white">
                <div className="flex flex-col gap-8">
                    <TypographyFormatMessage
                        color={theme.palette.grey[500]}
                        className="text-base md:text-lg text-center"
                    >
                        Actuellement aucune production solaire n'est liée à l'application
                    </TypographyFormatMessage>
                    <div
                        style={{ backgroundColor: alpha(theme.palette.primary.main, 0.2) }}
                        className="flex flex-col p-16 md:p-24 rounded-lg"
                    >
                        <TypographyFormatMessage
                            color={theme.palette.primary.main}
                            className="text-base md:text-xl font-bold"
                        >
                            Lier ma production solaire:
                        </TypographyFormatMessage>
                        <div className="p-16 flex flex-col gap-16">
                            <div>
                                <TypographyFormatMessage
                                    color={theme.palette.primary.main}
                                    className="text-sm md:text-base mb-8"
                                >
                                    Installation avec un onduleur Enphase:
                                </TypographyFormatMessage>
                                <Button
                                    onClick={handleOnOpenEnphaseConsentPopup}
                                    variant="contained"
                                    className="rounded-xl"
                                >
                                    {formatMessage({
                                        id: 'Liaison avec mon compte Enphase',
                                        defaultMessage: 'Liaison avec mon compte Enphase',
                                    })}
                                </Button>
                            </div>
                            {arePlugsUsedBasedOnProductionStatus(currentHousingScopes) && (
                                <div>
                                    <TypographyFormatMessage
                                        color={theme.palette.primary.main}
                                        className="text-sm md:text-base mb-8"
                                    >
                                        Installation "plug & play"
                                    </TypographyFormatMessage>
                                    <Button
                                        onClick={handleOnOpenConnectedPlugConsentPopup}
                                        variant="contained"
                                        className="rounded-xl"
                                    >
                                        {formatMessage({
                                            id: 'Liaison avec une prise connectée Shelly plug S',
                                            defaultMessage: 'Liaison avec une prise connectée Shelly plug S',
                                        })}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isEnphaseConsentPopupOpen && (
                <EnphaseConsentPopup onClose={handleOnCloseEnphaseConsentPopup} url={enphaseLink} />
            )}
            {isConnectedPlugProductionConsentPopupOpen && (
                <ConnectedPlugProductionConsentPopup onClose={handleOnCloseConnectedPlugConsentPopup} />
            )}
        </>
    )
}

export default SolarProductionLinkingPrompt
