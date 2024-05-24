import { FormProvider, useForm } from 'react-hook-form'
import { ButtonLoader } from 'src/common/ui-kit'
import {
    AddUpdateSolarSizingType,
    AllHousingSolarSizingType,
    ISolarSizing,
    SolarSizingFormType,
} from 'src/modules/SolarSizing/solarSizeing.types'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { CustomRadioGroup } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import { useCallback, useEffect, useMemo, useState } from 'react'
import isNull from 'lodash/isNull'
import { useSolarSizing } from 'src/modules/SolarSizing/solarSizingHook'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import convert from 'convert-units'
import type { AxiosResponse } from 'axios'
import floor from 'lodash/floor'
import clsx from 'clsx'
import isNumber from 'lodash/isNumber'
import last from 'lodash/last'

const oneSolarPanelSurface = 1.6 // m2 (Hard coded for now)

/**
 * Solar sizing form component.
 *
 * @returns Solar sizing form component.
 */
export default function SolarSizingForm() {
    const currentHousing = useCurrentHousing()

    const [orientationValue, setOrientationValue] = useState<number | null>(null)
    const [inclinationValue, setInclinationValue] = useState<number | null>(null)
    const [potentialSolarPanelPerSurface, setPotentialSolarPanelPerSurface] = useState<number | null>(null)
    const [solarSizingData, setSolarSizingData] = useState<AllHousingSolarSizingType | null>(null)
    const [isCalculating, setIsCalculating] = useState<boolean>(false)
    const [lastSolarSizing, setLastSolarSizing] = useState<ISolarSizing | null>(null)

    const {
        addSolarSizing,
        updateHousingSolarSizingBySolarSizingId,
        allHousingSolarSizing: { refetch: fetchAllHousingSolarSizing },
    } = useSolarSizing(currentHousing?.id, lastSolarSizing?.id)

    // Only surface is needed because the other states are handled by the useState.
    const methods = useForm({
        defaultValues: {
            surface: lastSolarSizing?.surface,
        },
    })

    const { handleSubmit, register, setValue } = methods

    /**
     * On change handler for the Orientation value.
     *
     * @param value Orientation value.
     */
    const onOrientationValueChange: (value: string) => void = (value) => {
        setOrientationValue(parseInt(value))
    }

    /**
     * On change handler for the Inclination value.
     *
     * @param value Inclination value.
     */
    const onInclinationValueChange: (value: string) => void = (value) => {
        setInclinationValue(parseInt(value))
    }

    const getLastSolarSizing = useCallback(async () => {
        const allHousingSolarSizingResponse = await fetchAllHousingSolarSizing()

        const lastSolarSizing = last(allHousingSolarSizingResponse.data?.data.solarSizings)

        if (lastSolarSizing) {
            setLastSolarSizing(lastSolarSizing)
            setValue('surface', lastSolarSizing.surface)
        }
    }, [fetchAllHousingSolarSizing, setValue])

    /**
     * Handle the response.
     *
     * @param response Axios response.
     */
    const handleResponse = async (response: AxiosResponse<AddUpdateSolarSizingType>) => {
        if (response.status === 200 || response.status === 201) {
            setPotentialSolarPanelPerSurface(Math.floor(response.data.surface / oneSolarPanelSurface))
            setIsCalculating(true)
            const allHousingSolarSizingResponse = await fetchAllHousingSolarSizing()

            if (allHousingSolarSizingResponse.data?.status === 200) {
                setSolarSizingData(allHousingSolarSizingResponse.data.data)
            }
            setIsCalculating(false)
        }
    }

    let annualProduction = floor(convert(solarSizingData?.annualProduction).from('kWh').to('MWh'), 1)
    let autoConsumptionPercentage = floor(solarSizingData?.autoConsumptionPercentage!, 1)
    let autoProductionPercentage = floor(solarSizingData?.autoProductionPercentage!, 1)
    let nominalPower = floor(solarSizingData?.nominalPower!, 1)

    const averageConsumptionFromAnualProduction = useMemo(
        () => floor((annualProduction * autoConsumptionPercentage) / 100, 1),
        [annualProduction, autoConsumptionPercentage],
    )

    const averageProducationFromAnualProduction = useMemo(
        () => floor((annualProduction * autoProductionPercentage) / 100, 1),
        [annualProduction, autoProductionPercentage],
    )

    /**
     * Handle solar sizing form submit.
     *
     * @param data Form data.
     */
    async function handleFormSubmit(data: SolarSizingFormType) {
        if (!data.surface || !orientationValue || !inclinationValue) return

        let surface = parseInt(data.surface as unknown as string) // surface is a string in the input
        let orientation = orientationValue
        let inclination = inclinationValue

        let dataToBeSent = {
            surface,
            orientation,
            inclination,
        }

        // If the solar sizing details already exist, update them, else add new solar sizing details.
        // User case: At first the user adds the solar sizing details, then updates them.
        const response =
            lastSolarSizing && !isNull(lastSolarSizing) && lastSolarSizing.id
                ? await updateHousingSolarSizingBySolarSizingId.mutateAsync({
                      id: lastSolarSizing.id,
                      ...dataToBeSent,
                  })
                : await addSolarSizing.mutateAsync({
                      ...dataToBeSent,
                  })

        await handleResponse(response as AxiosResponse<AddUpdateSolarSizingType>)
    }

    const isDataReadyToBeShown = useMemo(() => {
        return Boolean(
            solarSizingData &&
                isNumber(annualProduction) &&
                isNumber(autoConsumptionPercentage) &&
                isNumber(averageConsumptionFromAnualProduction) &&
                isNumber(autoProductionPercentage) &&
                isNumber(averageProducationFromAnualProduction) &&
                isNumber(nominalPower),
        )
    }, [
        annualProduction,
        autoConsumptionPercentage,
        autoProductionPercentage,
        averageConsumptionFromAnualProduction,
        averageProducationFromAnualProduction,
        nominalPower,
        solarSizingData,
    ])

    useEffect(() => {
        getLastSolarSizing()
    }, [getLastSolarSizing])

    useEffect(() => {
        if (lastSolarSizing) {
            setOrientationValue(lastSolarSizing.orientation)
            setInclinationValue(lastSolarSizing.inclination)
        }
    }, [lastSolarSizing])

    return (
        <div
            className={clsx(
                'w-full grid grid-rows-1 gap-10',
                isDataReadyToBeShown ? 'md:grid-cols-8' : 'md:grid-cols-6',
                isDataReadyToBeShown && 'grid-rows-2',
            )}
        >
            <div className={isDataReadyToBeShown ? 'col-span-5' : 'col-span-6'}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <TextField
                            className="mb-10"
                            {...register('surface')}
                            label="Dimensions de ma toiture"
                            placeholder="m2"
                            fullWidth
                            type="number"
                            // No negative numbers
                            inputProps={{ min: '0' }}
                        />
                        <div className="flex flex-col full-w mb-14">
                            <Typography className="mb-3 text-14 font-medium">Orientation :</Typography>
                            <CustomRadioGroup
                                data-testid="orientation-radio-group"
                                boxClassName="grid grid-cols-2 md:grid-cols-4 gap-5"
                                elements={[
                                    { value: '180', label: 'Nord' },
                                    { value: '135', label: 'Nord-Est' },
                                    { value: '90', label: 'Est' },
                                    { value: '45', label: 'Sud-Est' },
                                    { value: '0', label: 'Sud' },
                                    { value: '-45', label: 'Sud-Ouest' },
                                    { value: '-90', label: 'Ouest' },
                                    { value: '-135', label: 'Nord-Ouest' },
                                ]}
                                value={orientationValue?.toString()}
                                onValueChange={onOrientationValueChange}
                            />
                        </div>
                        <div className="flex flex-col full-w mb-14">
                            <Typography className="mb-3 text-14 font-medium">Inclinaison :</Typography>
                            <CustomRadioGroup
                                data-testid="inclination-radio-group"
                                boxClassName="grid grid-cols-2 md:grid-cols-4 gap-5"
                                elements={[
                                    { value: '0', label: '0%' },
                                    { value: '15', label: '15%' },
                                    { value: '30', label: '30%' },
                                    { value: '40', label: '40%' },
                                ]}
                                value={inclinationValue?.toString()}
                                onValueChange={onInclinationValueChange}
                            />
                        </div>
                        <ButtonLoader
                            className="mt-10"
                            type="submit"
                            fullWidth
                            inProgress={addSolarSizing.isLoading || updateHousingSolarSizingBySolarSizingId.isLoading}
                            disabled={isNull(orientationValue) || isNull(inclinationValue)}
                        >
                            <Typography>Simuler mon installation solaire</Typography>
                        </ButtonLoader>
                    </form>
                </FormProvider>
            </div>
            {isCalculating ? (
                <div className="col-span-3">
                    <Typography paragraph className="mb-10 text-14">
                        Calcul en cours...
                    </Typography>
                </div>
            ) : (
                isDataReadyToBeShown && (
                    <div className="col-span-3">
                        <Typography paragraph className="mb-10 text-14">
                            {`Votre maison peut être équipée de `}
                            <strong>{potentialSolarPanelPerSurface}</strong>
                            {` panneaux solaires, cela représente un potentiel `}
                            <strong>{nominalPower}</strong>
                            {` kWc / an avec l'ensoleillement de l'année passée dans votre ville. En fonction de la répartition de votre consommation dans la journée, vous pourriez alors autoconsommer `}
                            <strong>{averageConsumptionFromAnualProduction}</strong>
                            {` MWh soit `}
                            <strong>{autoConsumptionPercentage}</strong>
                            {` % de votre consommation totale.`}
                            <strong>{autoProductionPercentage}</strong>
                            {` % de votre production soit `}
                            <strong>{averageProducationFromAnualProduction}</strong>
                            {` MWh`}
                        </Typography>
                    </div>
                )
            )}
        </div>
    )
}
