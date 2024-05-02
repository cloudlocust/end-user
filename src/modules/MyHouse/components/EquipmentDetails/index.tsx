import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { HousingEquipmentType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Form } from 'src/common/react-platform-components'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import dayjs from 'dayjs'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import IconButton from '@mui/material/IconButton'

/**
 * Equipment details.
 *
 * @returns Equipment details component.
 */
export default function EquipmentDetails() {
    const { formatMessage } = useIntl()
    const history = useHistory()
    const currentHousing = useCurrentHousing()
    const location = useLocation</**
     *
     */
    {
        /**
         * The equipment details object.
         */
        equipment: HousingEquipmentType
    }>()

    let equipment: HousingEquipmentType | null = null

    // Redirect to the equipment list if the equipment is not passed in the location state.
    if (!location.state) {
        history.push(`${URL_MY_HOUSE}/${currentHousing?.id}/equipments`)
    } else {
        const { equipment: locationEquipment } = location.state
        equipment = locationEquipment
    }

    const { addHousingEquipment } = useEquipmentList(currentHousing?.id)
    // State for form submitting loading, give it a meaningful name.
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultEquipmentDetails = {
        equipmentBrand: equipment?.equipmentBrand || null,
        equipmentModel: equipment?.equipmentModel || null,
        yearOfPurchase: equipment?.yearOfPurchase || null,
    }

    /**
     * Function to handle form submit.
     *
     * @param formData Form data.
     */
    async function handleOnSubmit(formData: typeof defaultEquipmentDetails) {
        setIsSubmitting(true)
        const { yearOfPurchase, ...restOfFormData } = formData

        // Parse year of purchase to integer.
        const parsedYearOfPurchase = yearOfPurchase ? parseInt(dayjs(yearOfPurchase).format('YYYY'), 10) : null

        await addHousingEquipment([
            {
                equipmentId: equipment!.housingEquipmentId!,
                equipmentType: equipment!.allowedType[0],
                equipmentNumber: equipment!.number,
                yearOfPurchase: parsedYearOfPurchase,
                ...restOfFormData,
            },
        ])
        setIsSubmitting(false)
    }

    return (
        <PageSimple
            content={
                <Container>
                    <div className="flex flex-col py-10">
                        <div className="flex items-center mb-24">
                            <IconButton className="shadow-lg mr-10" onClick={() => history.goBack()}>
                                <ArrowBackIosNewIcon />
                            </IconButton>
                            <Typography variant="h6" className="text-16 lg:text-xl" fontWeight="bold">
                                {formatMessage({
                                    id: 'Informations relatives à mon équipement',
                                    defaultMessage: 'Informations relatives à mon équipement',
                                })}
                            </Typography>
                        </div>
                        <Form defaultValues={defaultEquipmentDetails} onSubmit={handleOnSubmit}>
                            <TextField name="equipmentBrand" label="Marque" />
                            <TextField name="equipmentModel" label="Modèle" />
                            <DatePicker
                                name="yearOfPurchase"
                                label="Année d'achat"
                                views={['year']}
                                textFieldProps={{
                                    className: 'mt-0',
                                }}
                            />
                            <div className="w-full mt-10">
                                <ButtonLoader type="submit" fullWidth inProgress={isSubmitting}>
                                    {formatMessage({
                                        id: 'Enregistrer',
                                        defaultMessage: 'Enregistrer',
                                    })}
                                </ButtonLoader>
                            </div>
                        </Form>
                    </div>
                </Container>
            }
        />
    )
}
