import { useForm, Controller, FormProvider } from 'react-hook-form'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { setYear } from 'date-fns'
import {
    EquipmentDetailsFormProps,
    EquipmentDetailsFormSubmitType,
} from 'src/modules/MyHouse/components/EquipmentsDetails/EquipmentsDetails.types'
import { ButtonLoader } from 'src/common/ui-kit'
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

const POWERED_EQUIPMENT_TYPES = [
    'water_heater',
    'electric_car',
    'heatpump',
    'radiator',
    'air_conditioner',
    'reversible_heatpump',
    'swimmingpool_heatpump',
]

/**
 * Equipment details form.
 *
 * @param props Equipment details form props.
 * @param props.housingEquipmentsDetails Housing equipments details array.
 * @returns Equipment details form.
 */
export default function EquipmentsDetailsForm(props: EquipmentDetailsFormProps) {
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
            isChargesAtHome: housingEquipmentsDetails[0]?.extraData?.isChargesAtHome,
            chargingMethod: housingEquipmentsDetails[0]?.extraData?.chargingMethod,
            power: housingEquipmentsDetails[0]?.power,
        },
        mode: 'all',
    })
    const { handleSubmit, register, control, setValue, watch } = methods

    const selectedEquipmentId = watch('id')
    const isChargesAtHome = watch('isChargesAtHome')

    const selectedEquipment = useMemo(() => {
        return housingEquipmentsDetails.find((housingEq) => housingEq.id === selectedEquipmentId)
    }, [housingEquipmentsDetails, selectedEquipmentId])

    const isElectricCar = selectedEquipment?.equipment.name === 'electric_car'
    const isPoweredEquipment = POWERED_EQUIPMENT_TYPES.includes(selectedEquipment?.equipment.name ?? '')

    useEffect(() => {
        if (selectedEquipment) {
            setValue('equipmentBrand', selectedEquipment.equipmentBrand)
            setValue('equipmentModel', selectedEquipment.equipmentModel)
            setValue(
                'yearOfPurchase',
                selectedEquipment.yearOfPurchase ? setYear(new Date(), selectedEquipment.yearOfPurchase) : null,
            )
            setValue('isChargesAtHome', selectedEquipment.extraData?.isChargesAtHome)
            setValue('chargingMethod', selectedEquipment.extraData?.chargingMethod)
            setValue('power', selectedEquipment.power)
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

            const extraData = isElectricCar
                ? {
                      isChargesAtHome: data.isChargesAtHome,
                      chargingMethod: data.isChargesAtHome ? data.chargingMethod : undefined,
                  }
                : undefined

            // const power = shouldShowPowerField ? data.power : undefined

            await addHousingEquipment([
                {
                    id: selectedEquipmentId,
                    equipmentBrand: data.equipmentBrand,
                    equipmentModel: data.equipmentModel,
                    equipmentId: selectedEquipment.equipmentId,
                    // Convert Date into number
                    yearOfPurchase: data.yearOfPurchase ? dayjs(data.yearOfPurchase).year() : null,
                    extraData,
                    power: shouldShowPowerField && data.power ? Number(data.power) : undefined,
                },
            ])
        } finally {
            setIsSubmitting(false)
        }
    }

    const shouldShowPowerField = isPoweredEquipment && (!isElectricCar || isChargesAtHome)

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex items-center mb-20 mt-10">
                    <IconButton className="shadow-lg mr-10" onClick={() => history.goBack()}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Select className="w-full" {...register('id')} value={selectedEquipmentId}>
                        {housingEquipmentsDetails?.map((equipment) => (
                            <MenuItem key={equipment.id} value={equipment.id}>
                                {equipment.equipmentLabel || `Equipement ${equipment.equipmentNumber}`}
                            </MenuItem>
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
                {isElectricCar && (
                    <div className="flex flex-col">
                        <FormControl className="mb-20 flex flex-col sm:flex-row sm:items-center sm:gap-36">
                            <TypographyFormatMessage text="Je charge ma voiture à mon domicile" />
                            <RadioGroup
                                row
                                value={isChargesAtHome}
                                onChange={(e) => setValue('isChargesAtHome', e.target.value === 'true')}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="Oui" />
                                <FormControlLabel value={false} control={<Radio />} label="Non" />
                            </RadioGroup>
                        </FormControl>
                        {isChargesAtHome && (
                            <Controller
                                name="chargingMethod"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={watch(field.name)}
                                        onChange={(e) => {
                                            setValue(field.name, e.target.value as 'chargingStation' | 'socket')
                                        }}
                                        className="flex flex-col sm:flex-row mb-20"
                                    >
                                        <FormControlLabel
                                            value={'chargingStation'}
                                            control={<Radio checked={watch(field.name) === 'chargingStation'} />}
                                            label="J’ai une borne de recharge"
                                        />
                                        <FormControlLabel
                                            value={'socket'}
                                            control={<Radio checked={watch(field.name) === 'socket'} />}
                                            label="Je branche sur une prise sans borne"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        )}
                    </div>
                )}
                {shouldShowPowerField && (
                    <TextField {...register('power')} label="Puissance" type="number" fullWidth className="mb-20" />
                )}
                <div className="w-full mt-10">
                    <ButtonLoader type="submit" fullWidth inProgress={isSubmitting}>
                        Enregistrer
                    </ButtonLoader>
                </div>
            </form>
        </FormProvider>
    )
}
