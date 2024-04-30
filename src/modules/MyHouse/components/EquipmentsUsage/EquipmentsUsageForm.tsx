import { FormProvider, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@mui/material'
import DefaultEquipmentIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useEffect, useMemo, useState } from 'react'
import {
    EquipmentsUsageFormProps,
    EquipmentsUsageFormSubmitType,
} from 'src/modules/MyHouse/components/EquipmentsUsage/EquipmentsUsage.types'
import { myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { ButtonLoader } from 'src/common/ui-kit'
import isNumber from 'lodash/isNumber'

/**
 * Equipment usage component.
 *
 * @param props Equipment usage props.
 * @returns Equipment usage JSX.
 */
export default function EquipmentsUsageForm(props: EquipmentsUsageFormProps) {
    const { housingEquipmentsDetails, addHousingEquipment, title } = props
    const history = useHistory()
    const theme = useTheme()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const methods = useForm({
        defaultValues: {
            id: housingEquipmentsDetails?.[0].id,
            equipmentLabel: housingEquipmentsDetails?.[0].equipmentLabel,
            frequencyOfUsagePerWeek: housingEquipmentsDetails?.[0].frequencyOfUsagePerWeek,
            averageUsagePerMinute: housingEquipmentsDetails?.[0].averageUsagePerMinute,
        },
        mode: 'all',
    })
    const { register, watch, setValue, handleSubmit } = methods

    const selectedEquipmentId = watch('id')

    const selectedEquipment = useMemo(() => {
        return housingEquipmentsDetails?.find((housingEq) => housingEq.id === selectedEquipmentId)
    }, [housingEquipmentsDetails, selectedEquipmentId])

    const equipnentIcon = useMemo(
        () => myEquipmentOptions.find((option) => option.labelTitle === title)?.iconComponent,
        [title],
    )

    /**
     * Function to handle form submit.
     *
     * @param data Form data.
     */
    async function handleFormSubmit(data: EquipmentsUsageFormSubmitType) {
        if (!selectedEquipment) return

        try {
            setIsSubmitting(true)
            await addHousingEquipment([
                {
                    id: selectedEquipmentId,
                    equipmentBrand: data.equipmentLabel,
                    frequencyOfUsagePerWeek: isNumber(data.frequencyOfUsagePerWeek)
                        ? data.frequencyOfUsagePerWeek
                        : null,
                    averageUsagePerMinute: isNumber(data.averageUsagePerMinute) ? data.averageUsagePerMinute : null,
                    equipmentId: selectedEquipment.equipmentId,
                },
            ])
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (selectedEquipment) {
            setValue('equipmentLabel', selectedEquipment.equipmentLabel)
            setValue('frequencyOfUsagePerWeek', selectedEquipment.frequencyOfUsagePerWeek)
            setValue('averageUsagePerMinute', selectedEquipment.averageUsagePerMinute)
        }
    }, [housingEquipmentsDetails, selectedEquipment, selectedEquipmentId, setValue])

    return (
        <div className="py-20">
            <FormProvider {...methods}>
                <div className="flex items-center mb-10">
                    <IconButton className="shadow-lg mr-10" onClick={() => history.goBack()}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography className="font-semibold text-20">{title}</Typography>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex items-center mb-20">
                        <div className="mr-20">
                            {equipnentIcon ? equipnentIcon(theme) : <DefaultEquipmentIcon fontSize="large" />}
                        </div>
                        <Select className="w-full" {...register('id')} value={selectedEquipmentId}>
                            {housingEquipmentsDetails?.map((equipment) => (
                                <MenuItem key={equipment.id} value={equipment.id}>
                                    {equipment.equipmentLabel || `Equipement ${equipment.equipmentNumber}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <Typography className="font-semibold text-20 mb-20">Information équipement</Typography>
                    <div className="flex mb-20 w-full items-center">
                        <Typography className="text-13 md:text-16 mr-5">Nom :</Typography>
                        <TextField
                            className="flex-grow"
                            {...register('equipmentLabel')}
                            placeholder="Micro-onde salon"
                        />
                    </div>
                    <div className="flex mb-20 w-full items-center">
                        <Typography className="text-13 md:text-16 md:mr-5">
                            J'utilise cet équipement environ :
                        </Typography>
                        <TextField
                            className="mr-5 flex-grow"
                            {...register('frequencyOfUsagePerWeek')}
                            type="number"
                            InputProps={{ inputProps: { min: 0, pattern: '[0-9]*' } }}
                        />
                        <Typography className="text-13 md:text-16 md:mr-5">Fois par semaine</Typography>
                    </div>
                    <div className="flex mb-20 w-full items-center">
                        <Typography className="text-13 md:text-16 md:mr-5">
                            Combien de temps dure chaque utilisation en moyenne :
                        </Typography>
                        <TextField
                            className="mr-5 flex-grow"
                            {...register('averageUsagePerMinute')}
                            type="number"
                            InputProps={{ inputProps: { min: 0, pattern: '[0-9]*' } }}
                        />
                        <Typography className="text-13 md:text-16 md:mr-10">sur 24h</Typography>
                    </div>
                    <div className="w-full mt-10">
                        <ButtonLoader type="submit" fullWidth inProgress={isSubmitting}>
                            Enregistrer
                        </ButtonLoader>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
