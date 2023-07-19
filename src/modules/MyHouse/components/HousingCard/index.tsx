import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as HousingIcon } from 'src/assets/images/navbarItems/Housings.svg'
import { useHousingsDetails } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { deleteAddFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import Tooltip from '@mui/material/Tooltip'

import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import { HousingCardForm } from 'src/modules/MyHouse/components/HousingCardForm'

/**
 * This is a card to display the infos of the current housing (selected housing).
 *
 * @returns Card.
 */
const HousingCard = () => {
    const { formatMessage } = useIntl()
    const dispatch = useDispatch<Dispatch>()

    const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)

    const { removeHousing } = useHousingsDetails()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

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
    const handleDeleteHousing = async (id: number) => {
        await removeHousing(id)
        onAfterDeleteUpdateSuccess()
        handleCloseConfirmModal()
    }

    /**
     * Handler onAfterDeleteUpdateSuccess function when updating or delete housing.
     */
    const onAfterDeleteUpdateSuccess = () => {
        dispatch.housingModel.loadHousingsList()
    }

    return (
        <>
            <Card className="relative cursor-pointer flex flex-col justify-between rounded-16 w-full housing-card">
                <CardContent className="p-8" style={{ paddingBottom: 8 }}>
                    <div className="flex justify-between">
                        <div className="flex items-center jutsify-center">
                            <Typography className="font-bold text-16 whitespace-normal">
                                {MY_HOUSING_AT + currentHousing!.address.city.toUpperCase()}
                            </Typography>
                        </div>
                        <div className="ml-12 flex">
                            <HousingCardForm
                                housing={currentHousing!}
                                onAfterDeleteUpdateSuccess={onAfterDeleteUpdateSuccess}
                            />

                            <Tooltip
                                arrow
                                placement="bottom-end"
                                disableHoverListener={!deleteAddFeatureState}
                                title={formatMessage({
                                    id: "Cette fonctionnalité n'est pas disponible sur cette version",
                                    defaultMessage: "Cette fonctionnalité n'est pas disponible sur cette version",
                                })}
                            >
                                <div className={`${deleteAddFeatureState && 'cursor-not-allowed'}`}>
                                    <IconButton
                                        className="ml-4"
                                        disabled={deleteAddFeatureState}
                                        aria-label="delete"
                                        onClick={handleOpenConfirmModal}
                                    >
                                        <DeleteOutlinedIcon color={deleteAddFeatureState ? 'disabled' : 'error'} />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex gap-8 items-center mt-16">
                        <SvgIcon color="primary">
                            <HousingIcon />
                        </SvgIcon>
                        <Typography variant="subtitle1" className="text-13 flex">
                            {`${currentHousing!.address.name}`}
                        </Typography>
                    </div>
                </CardContent>
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
                                handleDeleteHousing(currentHousing!.id)
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
