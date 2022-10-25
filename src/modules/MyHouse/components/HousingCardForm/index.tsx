import { Card, CardContent, Modal, Button, CardActions } from '@mui/material'
import { useIntl } from 'react-intl'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader } from 'src/common/ui-kit'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import {
    HousingCardFormProps,
    housingCardFormValuesType,
} from 'src/modules/MyHouse/components/HousingCardForm/HousingCardFormProps.d'
import { useState } from 'react'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { useHousingsDetails } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * HousingCardForm popup component.
 *
 * @param props Edit HousingCard form popup props.
 * @param props.housing Housing object.
 * @param props.onAfterDeleteUpdateSuccess Callback onAfterDeleteUpdateSuccess.
 * @returns HousingCardForm component.
 */
export const HousingCardForm = ({ housing, onAfterDeleteUpdateSuccess }: HousingCardFormProps) => {
    const { formatMessage } = useIntl()
    const [isOpenHousingCardForm, setIsOpenHousingCardForm] = useState(false)
    const { editHousing, loadingRequest } = useHousingsDetails()

    /**
     * Handler to closeHousingCardFormModal.
     */
    const closeHousingCardFormModal = () => {
        setIsOpenHousingCardForm(false)
    }

    /**
     * Handler when onSubmit.
     *
     * @param body Body HousingCardForm.
     */
    const onSubmit = async (body: housingCardFormValuesType) => {
        try {
            await editHousing(housing.id, body)
            onAfterDeleteUpdateSuccess && onAfterDeleteUpdateSuccess()
            closeHousingCardFormModal()
        } catch (err) {}
    }
    return (
        <div>
            <IconButton color="primary" size="medium" onClick={() => setIsOpenHousingCardForm(true)}>
                <EditIcon />
            </IconButton>
            <Modal open={isOpenHousingCardForm} onClose={closeHousingCardFormModal}>
                <Form
                    onSubmit={onSubmit}
                    defaultValues={{
                        address: housing.address,
                    }}
                >
                    <div
                        className="flex justify-center absolute top-1/2 left-1/2"
                        style={{ transform: 'translate(-50%, -50%)', width: '300px' }}
                    >
                        <Card className="relative cursor-pointer flex-wrap rounded-16">
                            <CardContent className="mt-10 pb-0">
                                <Typography className="font-bold text-16 whitespace-normal mb-16">
                                    {`${formatMessage({
                                        id: 'Mon Logement à',
                                        defaultMessage: 'Mon Logement à',
                                    })} ${housing.address.city.toUpperCase()}`}
                                </Typography>
                                <GoogleMapsAddressAutoCompleteField
                                    name="address"
                                    validateFunctions={[requiredBuilder()]}
                                />
                            </CardContent>
                            <CardActions className="flex items-center content-center justify-center">
                                <Button variant="outlined" className="mr-4" onClick={closeHousingCardFormModal}>
                                    {formatMessage({
                                        id: 'Annuler',
                                        defaultMessage: 'Annuler',
                                    })}
                                </Button>
                                <ButtonLoader
                                    inProgress={loadingRequest}
                                    variant="contained"
                                    type="submit"
                                    className="ml-4"
                                >
                                    {formatMessage({
                                        id: 'Enregistrer',
                                        defaultMessage: 'Enregistrer',
                                    })}
                                </ButtonLoader>
                            </CardActions>
                        </Card>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}
