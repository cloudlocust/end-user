import { Card, CardContent, Icon, useTheme, CardActionArea } from '@mui/material'
import { useHistory } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcogestTag } from 'src/modules/Ecogestes/components/ecogeste'
import { URL_ECOGESTES_TAGS } from 'src/modules/Ecogestes/EcogestesConfig'

/**
 * A Card that shows information about a given tag.
 *
 * @param root0 N/A.
 * @param root0.ecogestTag The ecogestTag to display.
 * @returns EcogestTag component.
 */
export const EcogestTagCard = ({
    ecogestTag,
}: /**
 * Params object.
 */
{
    /**
     * EcogestTag object to display. Cannot be null.
     */
    ecogestTag: IEcogestTag
}) => {
    const theme = useTheme()

    // WARN: Need changing with react-router-dom >= 6.0.0 -> useNavigate.
    const history = useHistory()

    /**
     * Handles a click on the ActionArea.
     */
    const handleClick = () => {
        history.push(`${URL_ECOGESTES_TAGS}/${ecogestTag.id}`)
    }

    return (
        <>
            <Card style={{ width: '20rem', height: '23rem' }}>
                <CardActionArea className="w-full h-full" onClick={handleClick}>
                    <CardContent className="flex flex-col flex-nowrap justify-around h-full w-full">
                        <Icon
                            aria-hidden="true"
                            color="primary"
                            style={{ height: '10rem', alignSelf: 'center', width: '100%', margin: 'auto' }}
                        >
                            <img
                                // A note about the filter shenanigans under here:
                                // It works.
                                // If you have a better idea, that still allows for dynamic icons to be given, please, do make a PR for it.
                                // Until then, it works with black images :v
                                style={{
                                    filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                                    height: 'inherit',
                                    margin: 'auto',
                                }}
                                src={ecogestTag.icon}
                                alt=""
                            ></img>
                        </Icon>
                        <TypographyFormatMessage className="font-bold text-15 whitespace-normal text-center">
                            {ecogestTag.name}
                        </TypographyFormatMessage>
                        <TypographyFormatMessage className="text-center">
                            {ecogestTag.ecogestAmount + ' Écogestes'}
                        </TypographyFormatMessage>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}
