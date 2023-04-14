import { Card, CardContent, Icon, useTheme, CardActionArea } from '@mui/material'
import { useHistory } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { IEcogesteCategoryTypes, URL_ROOT_ECOGESTES } from 'src/modules/Ecogestes/EcogestesConfig'

/**
 * Card that will display an Ecogeste Category.
 *
 * @param root0 N/A.
 * @param root0.ecogestCategory The ecogestCategory to display.
 * @param root0.categoryType The ecogestCategory type.
 * @returns JSX.Element - EcogesteCategory extending mUI Card.
 */
export const EcogesteCategoryCard = ({
    ecogestCategory,
    categoryType,
}: /**
 * Params object.
 */
{
    /**
     * Ecogest Category.
     */
    ecogestCategory: IEcogestCategory

    /**
     * Type of Category.
     */
    categoryType: IEcogesteCategoryTypes
}) => {
    const theme = useTheme()
    const history = useHistory()

    /**
     * Redirect to EcogestCard.
     */
    const handleClick = () => {
        history.push(`${URL_ROOT_ECOGESTES}/${categoryType}/${ecogestCategory.id}`)
    }

    return (
        <Card style={{ width: '150px', height: '180px' }} aria-label="ecogest-category, card">
            <CardActionArea className="w-full h-full" onClick={handleClick}>
                <CardContent className="flex flex-col flex-nowrap justify-around h-full w-full">
                    <Icon
                        aria-hidden="true"
                        color="primary"
                        style={{ height: '10rem', alignSelf: 'center', width: '100%', margin: 'auto' }}
                    >
                        <img
                            style={{
                                filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                                height: 'inherit',
                                margin: 'auto',
                            }}
                            src={ecogestCategory.icon}
                            alt=""
                        ></img>
                    </Icon>
                    <TypographyFormatMessage className="font-bold text-15 whitespace-normal text-center">
                        {ecogestCategory.name}
                    </TypographyFormatMessage>
                    <TypographyFormatMessage className="text-center">
                        {`${ecogestCategory.nbEcogeste} Écogestes`}
                    </TypographyFormatMessage>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
