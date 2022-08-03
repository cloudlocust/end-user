import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { NavLink } from 'react-router-dom'
import { useIntl } from 'react-intl'
import Button from '@mui/material/Button'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CardActions from '@mui/material/CardActions'

import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * This is a card for the display of a logement item.
 *
 * @param props Props.
 * @param props.element Logement object we cant to display.
 * @returns Card.
 */
const HousingCard = ({
    element: logement,
}: /**
 * Props Typing.
 */
{
    /**
     * The fields required for the display of the logement.
     */
    element: IHousing
}) => {
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState(false)

    const MY_HOUSING_AT = formatMessage({
        id: 'Mon Logement à ',
        defaultMessage: 'Mon Logement à ',
    })

    return (
        <Card
            className="relative cursor-pointer flex-wrap rounded-16"
            onMouseOver={() => setRaisedState(true)}
            onMouseOut={() => setRaisedState(false)}
            raised={raisedState}
        >
            <CardContent>
                <div className="flex items-center jutsify-center">
                    <Typography className="font-bold text-16 whitespace-normal">
                        {MY_HOUSING_AT + logement.address.city.toUpperCase()}
                    </Typography>
                </div>
                <Divider className="my-16" />
                <div className="flex flex-col">
                    <Typography variant="subtitle1" className="mb-10 text-13 flex">
                        {`${logement.address.city}, ${logement.address.zipCode}, ${logement.address.country}`}
                    </Typography>
                    <Typography variant="subtitle1" className="text-13 flex">
                        {logement.guid ? (
                            `Compteur n°${logement.guid}`
                        ) : (
                            <NavLink to="/nrlink-connection-steps" className="underline text-blue hover:text-blue-900">
                                {formatMessage({
                                    id: 'Veuillez renseigner votre compteur',
                                    defaultMessage: 'Veuillez renseigner votre compteur',
                                })}
                            </NavLink>
                        )}
                    </Typography>
                </div>
            </CardContent>
            <CardActions className="flex items-center content-center justify-end">
                <NavLink to={`${URL_MY_HOUSE}/${logement.id}`}>
                    <Button variant="contained" endIcon={<KeyboardArrowRightIcon />}>
                        {formatMessage({
                            id: 'Détails',
                            defaultMessage: 'Détails',
                        })}
                    </Button>
                </NavLink>
            </CardActions>
        </Card>
    )
}
export default HousingCard
