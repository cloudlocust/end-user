import { FormProvider, useForm, Controller } from 'react-hook-form'
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
    usageOptions,
} from 'src/modules/MyHouse/components/EquipmentsUsage/EquipmentsUsage.types'
import { myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { ButtonLoader } from 'src/common/ui-kit'
import isString from 'lodash/isString'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import capitalize from 'lodash/capitalize'

const months = {
    janvier: 'january',
    février: 'february',
    mars: 'march',
    avril: 'april',
    mai: 'may',
    juin: 'june',
    juillet: 'july',
    août: 'august',
    septembre: 'september',
    octobre: 'october',
    novembre: 'november',
    décembre: 'december',
}

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
    const [usageOption, setUsageOption] = useState<usageOptions | undefined>(undefined)

    const methods = useForm({
        defaultValues: {
            id: housingEquipmentsDetails?.[0].id,
            equipmentLabel: housingEquipmentsDetails?.[0].equipmentLabel,
            frequencyOfUsagePerWeek: housingEquipmentsDetails?.[0].frequencyOfUsagePerWeek,
            averageUsagePerMinute: housingEquipmentsDetails?.[0].averageUsagePerMinute,
            usage: housingEquipmentsDetails?.[0].usage,
        },
        mode: 'all',
    })
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        getValues,
        control,
        formState: { isDirty },
    } = methods

    const selectedEquipmentId = watch('id')

    // If the user checkbox all the months, we set the usage to ["all_year"]
    const usageWatch = watch('usage')

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
                    equipmentLabel: data.equipmentLabel!,
                    frequencyOfUsagePerWeek: isString(data.frequencyOfUsagePerWeek)
                        ? parseInt(data.frequencyOfUsagePerWeek)
                        : null,
                    averageUsagePerMinute: isString(data.averageUsagePerMinute)
                        ? parseInt(data.averageUsagePerMinute)
                        : null,
                    usage: data.usage,
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
            setValue('usage', selectedEquipment.usage)
        }
    }, [housingEquipmentsDetails, selectedEquipment, selectedEquipmentId, setValue])

    // If usage has all the months, we set the usageOption to ['all_year']
    useEffect(() => {
        if (Array.isArray(usageWatch) && usageWatch.length === Object.keys(months).length) {
            setValue('usage', ['all_year'])
            setUsageOption('all_year')
        }
    }, [usageWatch, setValue])

    useEffect(() => {
        // If usage has many values, we set the usageOption to specific
        if (Array.isArray(usageWatch) && usageWatch.length > 1) {
            setUsageOption('specific')
        }
    }, [usageOption, usageWatch])

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
                            {equipnentIcon ? (
                                equipnentIcon(theme)
                            ) : (
                                <DefaultEquipmentIcon fontSize="large" color="primary" />
                            )}
                        </div>
                        <Select
                            className="w-full"
                            {...register('id')}
                            value={selectedEquipmentId}
                            data-testid="housing-equipments-select"
                        >
                            {housingEquipmentsDetails?.map((equipment) => (
                                <MenuItem
                                    key={equipment.id}
                                    value={equipment.id}
                                    data-testid="housing-equipment-option"
                                >
                                    {equipment.equipmentLabel ?? `Equipement ${equipment.equipmentNumber}`}
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
                            placeholder="Par exemple : Télévision du salon"
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
                        <Typography className="text-13 md:text-16 mr-5">Fois par semaine</Typography>
                    </div>
                    <div className="flex mb-20 w-full items-center">
                        <Typography className="text-13 md:text-16 mr-5">
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
                    <div className="flex mb-20 w-full items-center">
                        <FormControl component="fieldset">
                            <FormLabel component="legend">J'utilise cet équipement :</FormLabel>
                            <RadioGroup
                                name="usageOption"
                                value={usageOption}
                                onChange={(e) => {
                                    setUsageOption(e.target.value as usageOptions)
                                }}
                                row
                            >
                                <Controller
                                    name="usage"
                                    control={control}
                                    defaultValue={['all_year']}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            value={['all_year']}
                                            control={
                                                <Radio
                                                    checked={field.value?.includes('all_year')}
                                                    onChange={(e) => field.onChange([e.target.value])}
                                                />
                                            }
                                            label="Toute l'année"
                                        />
                                    )}
                                />
                                <Controller
                                    name="usage"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            value="specific"
                                            control={
                                                <Radio
                                                    checked={usageOption?.includes('specific')}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            }
                                            label="Seulement :"
                                        />
                                    )}
                                />
                                {usageOption === 'specific' && (
                                    <RadioGroup className="flex flex-grow w-full" row>
                                        {Object.entries(months).map(([key, value]) => (
                                            <FormControlLabel
                                                key={key}
                                                value={value}
                                                control={
                                                    <Checkbox
                                                        {...register('usage')}
                                                        defaultChecked={getValues('usage')?.includes(value)}
                                                    />
                                                }
                                                label={capitalize(key)}
                                            />
                                        ))}
                                    </RadioGroup>
                                )}
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="w-full mt-10">
                        <ButtonLoader type="submit" fullWidth inProgress={isSubmitting} disabled={!isDirty}>
                            Enregistrer
                        </ButtonLoader>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
