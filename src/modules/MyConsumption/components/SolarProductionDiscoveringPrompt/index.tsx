import React from 'react'
import { useTheme, Button } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * The URL for the solar installation recommendation.
 */
export const URL_SOLAR_INSTALLATION_DISCOVERING = 'https://nrlink.myshopify.com/products/fonctionnalites-solaires'

/**
 * This component displays information about the solar production mode and allows users to discover more about the option.
 *
 * @returns SolarProductionDiscoveringPrompt component.
 */
const SolarProductionDiscoveringPrompt = () => {
    const theme = useTheme()

    return (
        <div className="flex flex-col items-center pt-40 px-16 sm:px-24 h-full bg-white">
            <div
                className="p-16 md:p-32 rounded-lg max-w-max mx-auto"
                style={{ backgroundColor: '#B5DBDF', color: theme.palette.primary.main }}
            >
                <TypographyFormatMessage
                    className="text-base md:text-xl font-bold underline pb-24"
                    text="Débloquer le mode solaire"
                />

                <TypographyFormatMessage className="font-semibold pb-8" text="Le mode solaire vous permet de :" />
                <div className="pl-16 mb-16">
                    <TypographyFormatMessage
                        className="font-semibold pb-8"
                        text="● visualiser votre production solaire *"
                    />
                    <TypographyFormatMessage
                        className="font-semibold pb-8"
                        text="● et / ou visualiser votre réinjection en € **"
                    />
                </div>

                <div className="mb-4">
                    <TypographyFormatMessage className="inline font-semibold" text="*Production solaire" />{' '}
                    <TypographyFormatMessage
                        className="inline"
                        text="uniquement avec des identifiants et une passerelle Enphase ou dans le cas d’une installation
                        plug&play avec une prise connectée Shelly plug S."
                    />
                </div>
                <div>
                    <TypographyFormatMessage className="inline font-semibold" text="**Réinjection solaire" />{' '}
                    <TypographyFormatMessage
                        className="inline"
                        text="uniquement si vous avez souscrit à un contrat de revente."
                    />
                </div>

                <Button
                    onClick={() => {
                        window.open(URL_SOLAR_INSTALLATION_DISCOVERING, '_blank', 'noopener noreferrer')
                    }}
                    variant="contained"
                    className="mt-16 p-16 rounded-lg"
                >
                    <TypographyFormatMessage className="font-semibold" text="Découvrir l’option solaire" />
                </Button>
            </div>
        </div>
    )
}

export default SolarProductionDiscoveringPrompt
