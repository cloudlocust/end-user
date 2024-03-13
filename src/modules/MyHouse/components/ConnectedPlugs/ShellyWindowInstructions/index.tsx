import { renderToStaticMarkup } from 'react-dom/server'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import WarningIcon from '@mui/icons-material/Warning'

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
                <h2>Veuillez fermer votre espace Shelly une fois votre liaison terminé.</h2>

                <p className="description">
                    <WarningIcon className="warning-icon" /> &nbsp; Actuellement, les prises Shelly peuvent être liées à
                    l’application uniquement dans le cadre d’une connexion avec des panneaux solaires Plug&play afin de
                    visualiser la production solaire.
                </p>

                <p>NB : Seules les prises Shelly modèle Plug S sont compatibles.</p>
                <a style={{ color: warningMainHashColor }} href={shellyUrl}>
                    <h3>Accèder à mon espace Shelly</h3>
                </a>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .description {
                    text-align: center;
                    margin-left: 15px;
                    margin-right: 15px;
                    line-height: 12px;
                    @media (min-width: 960px) {
                        margin-left: 100px;
                        margin-right: 100px;
                    }
                }
                .description .warning-icon {
                    height: 40px;
                    fill: ${warningMainHashColor};
                    vertical-align: middle;
                }
            `,
                }}
            />
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
