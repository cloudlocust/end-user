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
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { Form, max, min, requiredBuilder } from 'src/common/react-platform-components'

import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { useHousingsDetails } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { addMeterInputType } from 'src/modules/Meters/Meters'

/**
 * This is a card for the display of a logement item.
 *
 * @param props Props.
 * @param props.element Logement object we cant to display.
 * @param props.reloadHousings Reload elements.
 * @returns Card.
 */
const HousingCard = ({
    element: logement,
    reloadHousings,
}: /**
 * Props Typing.
 */
{
    /**
     * The fields required for the display of the logement.
     */
    element: IHousing
    /**
     * Reload Elements after an operation.
     */
    reloadHousings: () => void
}) => {
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState(false)

    const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)
    const [addMeterOpen, setAddMeterOpen] = React.useState(false)

    const { removeHousing } = useHousingsDetails()
    const { addMeter, loadingInProgress: isMeterInProgress } = useMeterForHousing()

    const MY_HOUSING_AT = formatMessage({
        id: 'Mon Logement à ',
        defaultMessage: 'Mon Logement à ',
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

    /**
     * What should be done when closing the add meter popup.
     */
    const handleCloseAddMeterOpen = () => {
        setAddMeterOpen(false)
    }

    /**
     * What should be done when opening add meter pop up.
     */
    const handleOpenAddMeterOpen = () => {
        setAddMeterOpen(true)
    }

    /**
     * What should be done when closing the confirm Modal that pop up before deleting element.
     */
    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false)
    }

    /**
     * What should be done when opening the confirm Modal that pop up before deleting element.
     */
    const handleOpenConfirmModal = () => {
        setConfirmModalOpen(true)
    }

    /**
     * What should be done to delete housing.
     *
     * @param id Identifier of the Housing to delete.
     */
    const handleDeleteHousing = (id: number) => {
        removeHousing(id, reloadHousings)
        handleCloseConfirmModal()
    }

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
                                {MY_HOUSING_AT + logement.address.city.toUpperCase()}
                            </Typography>
                        </div>
                        <IconButton aria-label="delete" className="ml-12" onClick={handleOpenConfirmModal}>
                            <DeleteOutlinedIcon color="error" />
                        </IconButton>
                    </div>
                    <Divider className="my-16" />
                    <div className="flex flex-col">
                        <Typography variant="subtitle1" className="mb-10 text-13 flex">
                            {`${logement.address.name}`}
                        </Typography>
                        <Typography variant="subtitle1" className="text-13 flex">
                            {logement?.meter?.guid ? (
                                `Compteur n°${logement.meter.guid}`
                            ) : (
                                <div
                                    onClick={handleOpenAddMeterOpen}
                                    className="underline text-blue hover:text-blue-900"
                                >
                                    {formatMessage({
                                        id: 'Veuillez renseigner votre compteur',
                                        defaultMessage: 'Veuillez renseigner votre compteur',
                                    })}
                                </div>
                            )}
                        </Typography>
                    </div>
                </CardContent>
                <CardActions className="flex items-center content-center justify-end">
                    <NavLink to={`${URL_MY_HOUSE}/${logement?.id}`}>
                        <Button variant="contained" endIcon={<KeyboardArrowRightIcon />}>
                            {formatMessage({
                                id: 'Détails',
                                defaultMessage: 'Détails',
                            })}
                        </Button>
                    </NavLink>
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
            <Modal open={addMeterOpen} onClose={handleCloseAddMeterOpen}>
                <Form
                    onSubmit={async (value: addMeterInputType) => {
                        await addMeter(logement.id, value, reloadHousings)
                        handleCloseAddMeterOpen()
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                        }}
                    >
                        <Card className="relative cursor-pointer flex-wrap rounded-16">
                            <CardContent className="mt-10">
                                <TextField
                                    name="name"
                                    label="Nom de mon compteur"
                                    placeholder={formatMessage({
                                        id: 'Donnez un nom à votre compteur',
                                        defaultMessage: 'Donnez un nom à votre compteur',
                                    })}
                                    validateFunctions={[requiredBuilder()]}
                                />
                                <TextField
                                    name="guid"
                                    label="Numéro de mon compteur"
                                    placeholder={formatMessage({
                                        id: 'Donnez le numéro de votre compteur',
                                        defaultMessage: 'Donnez le numéro de votre compteur',
                                    })}
                                    validateFunctions={[requiredBuilder(), min(14), max(14)]}
                                />
                            </CardContent>
                            <CardActions className="flex items-center content-center justify-center mb-10">
                                <Button variant="outlined" className="mr-4" onClick={handleCloseAddMeterOpen}>
                                    {formatMessage({
                                        id: 'Annuler',
                                        defaultMessage: 'Annuler',
                                    })}
                                </Button>
                                <ButtonLoader
                                    inProgress={isMeterInProgress}
                                    variant="contained"
                                    type="submit"
                                    className="ml-4"
                                >
                                    {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                                </ButtonLoader>
                            </CardActions>
                        </Card>
                    </Box>
                </Form>
            </Modal>
        </>
    )
}
export default HousingCard
