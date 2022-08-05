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
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { requiredBuilder } from 'src/common/react-platform-components'
import { useForm, FormProvider } from 'react-hook-form'

import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { useHousingList, useHousingsDetails } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
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
    element?: IHousing
}) => {
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState(false)

    const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)
    const { removeHousing } = useHousingsDetails()

    const MY_HOUSING_AT = formatMessage({
        id: 'Mon Logement à ',
        defaultMessage: 'Mon Logement à ',
    })

    const NEW_HOUSING = formatMessage({
        id: 'Mon Nouveau Logement',
        defaultMessage: 'Mon Nouveau Logement',
    })

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'red',
        borderRadius: 10,
        p: 4,
    }

    //eslint-disable-next-line
    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false)
    }

    //eslint-disable-next-line
    const handleOpenConfirmModal = () => {
        setConfirmModalOpen(true)
    }

    //eslint-disable-next-line
    const handleDeleteHousing = (id: number) => {
        removeHousing(id)
        handleCloseConfirmModal()
    }

    const methods = useForm()
    const { addElement: addHousing } = useHousingList()
    return (
        <>
            <Card
                className="relative cursor-pointer flex-wrap rounded-16"
                onMouseOver={() => setRaisedState(true)}
                onMouseOut={() => setRaisedState(false)}
                raised={raisedState}
            >
                <CardContent>
                    <div className="flex justify-between">
                        <div className="flex items-center jutsify-center">
                            <Typography className="font-bold text-16 whitespace-normal">
                                {logement ? MY_HOUSING_AT + logement.address.city.toUpperCase() : NEW_HOUSING}
                            </Typography>
                        </div>
                        {logement && (
                            <IconButton aria-label="delete" className="ml-12" onClick={handleOpenConfirmModal}>
                                <DeleteOutlinedIcon color="error" />
                            </IconButton>
                        )}
                    </div>
                    <Divider className="my-16" />
                    {logement ? (
                        <div className="flex flex-col">
                            <Typography variant="subtitle1" className="mb-10 text-13 flex">
                                {`${logement.address.name}`}
                            </Typography>
                            <Typography variant="subtitle1" className="text-13 flex">
                                {logement?.guid ? (
                                    `Compteur n°${logement.guid}`
                                ) : (
                                    <NavLink
                                        to="/nrlink-connection-steps"
                                        className="underline text-blue hover:text-blue-900"
                                    >
                                        {formatMessage({
                                            id: 'Veuillez renseigner votre compteur',
                                            defaultMessage: 'Veuillez renseigner votre compteur',
                                        })}
                                    </NavLink>
                                )}
                            </Typography>
                        </div>
                    ) : (
                        <FormProvider {...methods}>
                            <form id="form" onSubmit={methods.handleSubmit((data: any) => addHousing(data))}>
                                <GoogleMapsAddressAutoCompleteField
                                    name="address"
                                    validateFunctions={[requiredBuilder()]}
                                />
                            </form>
                        </FormProvider>
                    )}
                </CardContent>
                <CardActions
                    className={`flex items-center content-center ${logement ? 'justify-end' : 'justify-center'}`}
                >
                    {!logement ? (
                        <Button type="submit" size="large" form="form" variant="contained">
                            {formatMessage({
                                id: 'Enregistrer',
                                defaultMessage: 'Enregistrer',
                            })}
                        </Button>
                    ) : (
                        <NavLink to={`${URL_MY_HOUSE}/${logement?.id}`}>
                            <Button
                                variant={logement ? 'contained' : 'outlined'}
                                endIcon={logement && <KeyboardArrowRightIcon />}
                                disabled={logement ? false : true}
                            >
                                {formatMessage({
                                    id: 'Détails',
                                    defaultMessage: 'Détails',
                                })}
                            </Button>
                        </NavLink>
                    )}
                </CardActions>
            </Card>
            <Modal open={confirmModalOpen} onClose={handleCloseConfirmModal}>
                <Box sx={style} className="flex-col w-2/3 h-2/4 sm:w-1/3 sm:h-2/4">
                    <div className="flex flex-col justify-center align-center text-white text-center text-sm font-medium my-20">
                        <p className="mb-5">
                            {formatMessage({
                                id: 'Vous êtes sur le point de supprimer votre logement.',
                                defaultMessage: 'Vous êtes sur le point de supprimer votre logement.',
                            })}
                        </p>
                        <p className="mb-5">
                            {formatMessage({
                                id: 'Attention, toutes les données relatives à ce logement seront supprimées.',
                                defaultMessage:
                                    'Attention, toutes les données relatives à ce logement seront supprimées.',
                            })}
                        </p>
                        <p className="mb-5">
                            {formatMessage({
                                id: 'Êtes-vous sûr de vouloir continuer ?',
                                defaultMessage: 'Êtes-vous sûr de vouloir continuer ?',
                            })}
                        </p>
                    </div>
                    <div className="flex items-center content-center">
                        <Button
                            variant="outlined"
                            className="text-white m-12 border-white"
                            onClick={handleCloseConfirmModal}
                        >
                            {formatMessage({
                                id: 'Annuler',
                                defaultMessage: 'Annuler',
                            })}
                        </Button>
                        <Button
                            variant="outlined"
                            className="text-white m-12 border-white"
                            onClick={() => {
                                logement && handleDeleteHousing(logement.id)
                            }}
                        >
                            {formatMessage({
                                id: 'Continuer',
                                defaultMessage: 'Continuer',
                            })}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}
export default HousingCard
