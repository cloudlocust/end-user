import { Card, CardContent, Icon, useTheme, CardActionArea } from '@mui/material'
import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcogesteCategoryCardProps } from 'src/modules/Ecogestes/components/ecogesteCategories/ecogesteCategory'
import { URL_ROOT_ECOGESTES } from 'src/modules/Ecogestes/EcogestesConfig'

/**
 * Card that will display an Ecogeste Category.
 *
 * @param root0 N/A.
 * @param root0.ecogestCategory The ecogestCategory to display.
 * @param root0.categoryType The ecogestCategory type.
 * @returns JSX.Element - EcogesteCategory extending mUI Card.
 */
export const EcogesteCategoryCard: FC<IEcogesteCategoryCardProps> = ({
    ecogestCategory,
    categoryType,
}: IEcogesteCategoryCardProps): JSX.Element => {
    const theme = useTheme()
    const history = useHistory()

    /**
     * Redirect to EcogestCard.
     */
    const handleClick = () => {
        history.push(`${URL_ROOT_ECOGESTES}/${categoryType}/${ecogestCategory.id}`)
    }

    const ecogestsNumberFormatted = `${ecogestCategory.nbEcogeste} Écogeste${ecogestCategory.nbEcogeste > 1 ? 's' : ''}`

    return (
        <Card sx={{ width: '135px', height: '180px', boxShadow: 3 }} aria-label="ecogestCategoryCard">
            <CardActionArea className="w-full h-full" onClick={handleClick}>
                <CardContent className="flex flex-col flex-nowrap justify-around h-full w-full">
                    <Icon
                        aria-hidden="true"
                        color="primary"
                        style={{ height: '8rem', alignSelf: 'center', width: '100%', margin: '0 0 0.5rem 0' }}
                    >
                        <img
                            style={{
                                filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                                height: 'inherit',
                                margin: 'auto',
                            }}
                            src={ecogestCategory.icon}
                            alt={ecogestCategory.name}
                        />
                    </Icon>
                    <div className="flex flex-col justify-evenly items-center">
                        <TypographyFormatMessage className="font-bold text-12 sm:text-13 whitespace-normal text-center mb-4">
                            {ecogestCategory.name}
                        </TypographyFormatMessage>
                        <TypographyFormatMessage className="text-center text-12 sm:text-13">
                            {ecogestsNumberFormatted}
                        </TypographyFormatMessage>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
