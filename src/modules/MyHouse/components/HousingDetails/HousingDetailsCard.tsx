import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useIntl } from 'react-intl'
import { HousingDetailsCardProps } from 'src/modules/MyHouse/components/HousingDetails/housingDetails'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { NavLink, useParams } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { ButtonLoader } from 'src/common/ui-kit'
import { equipmentsAccomodationFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import Tooltip from '@mui/material/Tooltip'
import { isArray } from 'lodash'

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
const HousingDetailsCard = ({
    title,
    elements,
    typeOfDetails,
    isConfigured,
    loadingInProgress,
}: HousingDetailsCardProps) => {
    const { formatMessage } = useIntl()

    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    return (
        <Card className="rounded-16 border border-slate-600 bg-gray-50 mb-20 w-full h-256 md:w-400 flex flex-col justify-between">
            <TypographyFormatMessage className="font-bold mt-20 ml-20 text-14 whitespace-normal">
                {title}
            </TypographyFormatMessage>
            <CardContent className="flex content-center items-start p-0">
                {elements.map((element, index) => {
                    return (
                        <div
                            className="w-70 h-120 flex flex-1 flex-col items-center justify-items-center m-10"
                            key={index}
                        >
                            <div className="w-56 h-56 bg-white rounded-md flex items-center justify-center mb-5 shadow-md border border-slate-800">
                                {isArray(element) ? element[0].icon : element.icon}
                            </div>
                            <p className="w-56 md:w-80 truncate text-center">
                                {isArray(element) ? element[0].label : element.label}
                            </p>
                        </div>
                    )
                })}
            </CardContent>
            <CardActions className="flex items-center content-center justify-end">
                <Tooltip
                    arrow
                    placement="top"
                    disableHoverListener={!equipmentsAccomodationFeatureState}
                    title={
                        equipmentsAccomodationFeatureState &&
                        formatMessage({
                            id: "Cette fonctionnalité n'est pas disponible sur cette version",
                            defaultMessage: "Cette fonctionnalité n'est pas disponible sur cette version",
                        })
                    }
                >
                    <div className={`${equipmentsAccomodationFeatureState && 'cursor-not-allowed'}`}>
                        <NavLink
                            className={`${equipmentsAccomodationFeatureState && 'pointer-events-none'}`}
                            to={`${URL_MY_HOUSE}/${houseId}/${typeOfDetails}`}
                        >
                            <ButtonLoader
                                variant="contained"
                                color="primary"
                                className="text-white"
                                disabled={equipmentsAccomodationFeatureState}
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

export default HousingDetailsCard
