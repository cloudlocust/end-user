import { useForm, Controller, FormProvider } from 'react-hook-form'
import Select from '@mui/material/Select'
import MenuIten from '@mui/material/MenuItem'
import { useEffect, useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { setYear } from 'date-fns'
import {
    EquipmentDetailsFormProps,
    EquipmentDetailsFormSubmitType,
} from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetails.types'
import { ButtonLoader } from 'src/common/ui-kit'
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs'

/**
 * Equipment details form.
 *
 * @param props Equipment details form props.
 * @param props.housingEquipmentsDetails Housing equipments details array.
 * @returns Equipment details form.
 */
export default function EquipmentDetailsForm(props: EquipmentDetailsFormProps) {
    const history = useHistory()
    const { housingEquipmentsDetails, addHousingEquipment } = props
    const [isSubmitting, setIsSubmitting] = useState(false)
    const methods = useForm({
        defaultValues: {
            id: housingEquipmentsDetails[0]?.id,
            equipmentBrand: housingEquipmentsDetails[0]?.equipmentBrand,
            equipmentModel: housingEquipmentsDetails[0]?.equipmentModel,
            yearOfPurchase: housingEquipmentsDetails[0]?.yearOfPurchase
                ? setYear(new Date(), housingEquipmentsDetails[0]?.yearOfPurchase)
                : null,
        },
        mode: 'all',
    })
    const { handleSubmit, register, control, setValue, watch } = methods

    const selectedEquipmentId = watch('id')

    const selectedEquipment = useMemo(() => {
        return housingEquipmentsDetails.find((housingEq) => housingEq.id === selectedEquipmentId)
    }, [housingEquipmentsDetails, selectedEquipmentId])

    useEffect(() => {
        if (selectedEquipment) {
            setValue('equipmentBrand', selectedEquipment.equipmentBrand)
            setValue('equipmentModel', selectedEquipment.equipmentModel)
            setValue(
                'yearOfPurchase',
                selectedEquipment.yearOfPurchase ? setYear(new Date(), selectedEquipment.yearOfPurchase) : null,
            )
        }
    }, [housingEquipmentsDetails, selectedEquipment, selectedEquipmentId, setValue])

    /**
     * Function to handle form submit.
     *
     * @param data Form data.
     */
    async function handleFormSubmit(data: EquipmentDetailsFormSubmitType) {
        if (!selectedEquipment) return

        try {
            setIsSubmitting(true)
            await addHousingEquipment([
                {
                    id: selectedEquipmentId,
                    equipmentBrand: data.equipmentBrand,
                    equipmentModel: data.equipmentModel,
                    equipmentId: selectedEquipment.equipmentId,
                    // Convert Date into number
                    yearOfPurchase: data.yearOfPurchase ? dayjs(data.yearOfPurchase).year() : null,
                },
            ])
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex items-center mb-20 mt-10">
                    <IconButton className="shadow-lg mr-10" onClick={() => history.goBack()}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Select className="w-full" {...register('id')} value={selectedEquipmentId}>
                        {housingEquipmentsDetails?.map((equipment) => (
                            <MenuIten key={equipment.id} value={equipment.id}>
                                {equipment.equipmentLabel || `Equipement ${equipment.equipmentNumber}`}
                            </MenuIten>
                        ))}
                    </Select>
                </div>
                <TextField {...register('equipmentBrand')} label="Marque" fullWidth className="mb-20" />
                <TextField {...register('equipmentModel')} label="Modèle" fullWidth className="mb-20" />
                <Controller
                    control={control}
                    name="yearOfPurchase"
                    render={({ field }) => {
                        return (
                            <DatePicker
                                label="Date de l'achat"
                                value={field.value}
                                inputRef={field.ref}
                                onChange={(date) => {
                                    field.onChange(date)
                                }}
                                views={['year']}
                                renderInput={(params) => <TextField className="mb-20" fullWidth {...params} />}
                            />
                        )
                    }}
                />
                <div className="w-full mt-10">
                    <ButtonLoader type="submit" fullWidth inProgress={isSubmitting}>
                        Enregistrer
                    </ButtonLoader>
                </div>
            </form>
        </FormProvider>
    )
}
