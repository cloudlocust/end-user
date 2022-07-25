import { Card } from '@mui/material'
import React, { useState } from 'react'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import EditOutlined from '@mui/icons-material/EditOutlined'
import IconButton from '@mui/material/IconButton'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { NavLink } from 'react-router-dom'
import { useIntl } from 'react-intl'

import { IHousing } from 'src/modules/MyHouse/components/HousingCard/housing.d'

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
    const [onEditName, setOnEditName] = useState(false)

    const DEFAULT_HOUSE_NAME = formatMessage({
        id: 'Mon Logement',
        defaultMessage: 'Mon Logement',
    })

    return (
        <Card className="relative rounded-16">
            <div className="px-24 pt-16 pb-0 flex items-center flex-wrap">
                {onEditName ? (
                    <>
                        <TextField
                            defaultValue={logement.name ?? DEFAULT_HOUSE_NAME}
                            variant="standard"
                            className="mr-8 w-96"
                        />
                        <IconButton color="success" onClick={() => setOnEditName(false)}>
                            <Check />
                        </IconButton>
                        <IconButton color="error" onClick={() => setOnEditName(false)}>
                            <Close />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <Typography className="font-bold text-20 whitespace-normal mr-8">
                            {logement.name ?? DEFAULT_HOUSE_NAME}
                        </Typography>
                        <IconButton color="primary" onClick={() => setOnEditName(true)}>
                            <EditOutlined />
                        </IconButton>
                    </>
                )}
            </div>
            <CardContent className="px-32 py-0">
                <Divider className="my-16" />
                <div className="flex flex-col">
                    <Typography variant="subtitle1" className="mb-10 text-13 flex">
                        {`${logement.address.city}, ${logement.address.zipCode}, ${logement.address.country}`}
                    </Typography>
                    <Typography variant="subtitle1" className="mb-10 text-13 flex">
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
        </Card>
    )
}
export default HousingCard
