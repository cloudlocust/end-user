import { Card, useTheme, CardContent, CardActions, Tooltip } from '@mui/material'
import { HousingDetailsCardProps } from 'src/modules/MyHouse/components/HousingDetails/housingDetails'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { NavLink, useParams } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { ButtonLoader } from 'src/common/ui-kit'
import { isEquipmentsAccomodationFeatureDisabled } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * This is a component to display different elements of equipements/home-configuration in a card.
 *
 * @param props Props.
 * @param props.title The title of the card.
 * @param props.elements List of Elements to display in the card.
 * @param props.typeOfDetails List of Elements to display in the card.
 * @param props.isConfigured Are the elements on the card configured.
 * @param props.loadingInProgress Are the elements loaded.
 * @returns Void.
 */
export const HousingDetailsCard = ({
    title,
    elements,
    typeOfDetails,
    isConfigured,
    loadingInProgress,
}: HousingDetailsCardProps) => {
    const theme = useTheme()
    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    /**
     * Extracts the first three elements from the 'elements' prop.
     *
     * If the 'elements' prop contains more than three elements, only the first three will be included in 'firstThreeElements'.
     */
    const firstThreeElements = elements?.filter((_, index) => index < 3)

    return (
        <Card className="rounded-16 border border-slate-600 bg-gray-50 mb-20 w-full h-256 md:w-400 flex flex-col justify-between">
            <TypographyFormatMessage className="font-bold mt-20 ml-20 text-14 whitespace-normal">
                {title}
            </TypographyFormatMessage>
            <CardContent className="flex content-center items-start p-0">
                {firstThreeElements?.map((element, index) => {
                    return (
                        <div
                            className="w-70 h-120 flex flex-1 flex-col items-center justify-items-center m-10"
                            key={index}
                        >
                            <div className="w-56 h-56 bg-white rounded-md flex items-center justify-center mb-5 shadow-md border border-slate-800">
                                {typeof element.icon === 'function' ? element.icon(theme) : element.icon}
                            </div>
                            <p className="text-center">{element.label}</p>
                        </div>
                    )
                })}
            </CardContent>
            <CardActions className="flex items-center content-center justify-end">
                <Tooltip
                    arrow
                    placement="top"
                    disableHoverListener={!isEquipmentsAccomodationFeatureDisabled}
                    title={
                        !isEquipmentsAccomodationFeatureDisabled && (
                            <TypographyFormatMessage>
                                Cette fonctionnalité n'est pas disponible sur cette version
                            </TypographyFormatMessage>
                        )
                    }
                >
                    <div className={`${isEquipmentsAccomodationFeatureDisabled && 'cursor-not-allowed'}`}>
                        <NavLink
                            className={`${isEquipmentsAccomodationFeatureDisabled && 'pointer-events-none'}`}
                            to={`${URL_MY_HOUSE}/${houseId}/${typeOfDetails}`}
                        >
                            <ButtonLoader
                                variant="contained"
                                color="primary"
                                className="text-white"
                                disabled={isEquipmentsAccomodationFeatureDisabled}
                                endIcon={isConfigured && <SettingsOutlinedIcon />}
                                inProgress={loadingInProgress}
                            >
                                {isConfigured ? (
                                    <TypographyFormatMessage>Détail</TypographyFormatMessage>
                                ) : (
                                    <TypographyFormatMessage>Configuration</TypographyFormatMessage>
                                )}
                            </ButtonLoader>
                        </NavLink>
                    </div>
                </Tooltip>
            </CardActions>
        </Card>
    )
}
