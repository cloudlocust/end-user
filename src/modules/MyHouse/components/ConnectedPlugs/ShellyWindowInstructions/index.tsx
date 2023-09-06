import { renderToStaticMarkup } from 'react-dom/server'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'

/**
 *  ShellyWindowInstructions Component.
 *
 * @param props N/A.
 * @param props.shellyUrl Shelly Url.
 * @returns ShellyWindowInstructions Component.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const ShellyWindowInstructions = ({ shellyUrl }: { shellyUrl?: string }) => {
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    marginTop: '64px',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                        color: warningMainHashColor,
                    }}
                >
                    Information
                </h1>
                <h2>Veuillez fermer votre espace Shelly une fois votre traitement terminé.</h2>
                <a style={{ color: warningMainHashColor }} href={shellyUrl}>
                    <h3>Accèder à mon espace Shelly</h3>
                </a>
            </div>
        </>
    )
}

export default ShellyWindowInstructions

/**
 * Get the HTML Code to show shelly instructions HTML Page.
 *
 * @param shellyUrl Shelly Url page.
 * @returns The HTML Code of Shelly Instructions Compoennt.
 */
export const getShellyWindowInstructionsHTML = (shellyUrl?: string) =>
    renderToStaticMarkup(<ShellyWindowInstructions shellyUrl={shellyUrl} />)
