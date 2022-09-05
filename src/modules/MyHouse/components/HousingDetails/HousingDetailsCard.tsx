import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useIntl } from 'react-intl'
import { HouseDetailsElementType } from 'src/modules/MyHouse/components/HousingDetails/housingDetails'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { NavLink, useParams } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import EditIcon from '@mui/icons-material/Edit'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { ButtonLoader } from 'src/common/ui-kit'
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
}: /**
 */ {
    /**
     * Title of the card.
     */
    title: string
    /**
     * Elements to display (element is a icon and a label).
     */
    elements: HouseDetailsElementType[]
    /**
     * Title of the card.
     */
    typeOfDetails: string
    /**
     * Are the elements configured.
     */
    isConfigured: boolean
    /**
     * Are the elements loaded or not.
     */
    loadingInProgress: boolean
}) => {
    const { formatMessage } = useIntl()

    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    return (
        <Card className="rounded-16 border border-slate-600 bg-gray-50 mb-20 mx-10 w-400 h-256 flex flex-col justify-between">
            <TypographyFormatMessage className="font-bold mt-20 ml-20 text-14 whitespace-normal">
                {title}
            </TypographyFormatMessage>
            <CardContent className="flex content-center items-baseline">
                {elements.map((element) => (
                    <div className="w-70 h-120 flex flex-1 flex-col items-center justify-items-center m-10">
                        <div className="p-10 bg-white rounded-md flex items-center justify-items-center mb-5 shadow-md border border-slate-800">
                            {element.icon}
                        </div>
                        <p className="text-center">{element.label}</p>
                    </div>
                ))}
            </CardContent>
            <CardActions className="flex items-center content-center justify-end">
                <NavLink to={`${URL_MY_HOUSE}/${houseId}/${typeOfDetails}`}>
                    <ButtonLoader
                        variant="contained"
                        color="primary"
                        className="text-white"
                        endIcon={isConfigured ? <SettingsOutlinedIcon /> : <EditIcon />}
                        inProgress={loadingInProgress}
                    >
                        {isConfigured
                            ? formatMessage({
                                  id: 'Modifier',
                                  defaultMessage: 'Modifier',
                              })
                            : formatMessage({
                                  id: 'Configuration',
                                  defaultMessage: 'Configuration',
                              })}
                    </ButtonLoader>
                </NavLink>
            </CardActions>
        </Card>
    )
}

export default HousingDetailsCard
