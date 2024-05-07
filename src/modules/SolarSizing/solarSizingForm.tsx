import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader, MuiTextField as TextField } from 'src/common/ui-kit'
import {
    AddUpdateSolarSizingType,
    AllHousingSolarSizingType,
    SolarSizingFormType,
} from 'src/modules/SolarSizing/solarSizeing.types'
import Typography from '@mui/material/Typography'
import { CustomRadioGroup } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import { useEffect, useMemo, useState } from 'react'
import isNull from 'lodash/isNull'
import { useCurrentSolarSizing } from 'src/hooks/SolarSizing'
import { useSolarSizing } from 'src/modules/SolarSizing/solarSizingHook'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'src/redux'
import convert from 'convert-units'
import type { AxiosResponse } from 'axios'
import floor from 'lodash/floor'
import clsx from 'clsx'
import isNumber from 'lodash/isNumber'

const oneSolarPanelSurface = 1.6 // m2 (Hard coded for now)

/**
 * Solar sizing form component.
 *
 * @returns Solar sizing form component.
 */
export default function SolarSizingForm() {
    const currentHousing = useCurrentHousing()
    const reduxSolarSizingDetails = useCurrentSolarSizing()
    const dispatch = useDispatch<Dispatch>()

    const {
        addSolarSizing,
        updateHousingSolarSizingBySolarSizingId,
        allHousingSolarSizing: { refetch: fetchAllHousingSolarSizing },
    } = useSolarSizing(currentHousing?.id, reduxSolarSizingDetails?.id)

    // Only surface is needed because the other states are handled by the useState.
    const formDefaultValues = {
        surface: reduxSolarSizingDetails?.surface ?? '',
    }

    const [orientationValue, setOrientationValue] = useState<number | null>(null)
    const [inclinationValue, setInclinationValue] = useState<number | null>(null)
    const [potentialSolarPanelPerSurface, setPotentialSolarPanelPerSurface] = useState<number | null>(null)
    const [solarSizingData, setSolarSizingData] = useState<AllHousingSolarSizingType | null>(null)

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

    /**
     * Handle the response.
     *
     * @param response Axios response.
     */
    const handleResponse = async (response: AxiosResponse<AddUpdateSolarSizingType>) => {
        if (response.status === 200 || response.status === 201) {
            dispatch.housingModel.setSolarSizing(response.data)
            setPotentialSolarPanelPerSurface(Math.floor(response.data.surface / oneSolarPanelSurface))
            const allHousingSolarSizingResponse = await fetchAllHousingSolarSizing()
            if (allHousingSolarSizingResponse.data?.status === 200) {
                setSolarSizingData(allHousingSolarSizingResponse.data.data)
            }
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

        let surface = parseInt(data.surface as string)
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
            !isNull(reduxSolarSizingDetails) && reduxSolarSizingDetails?.id
                ? await updateHousingSolarSizingBySolarSizingId.mutateAsync({
                      id: reduxSolarSizingDetails.id,
                      ...dataToBeSent,
                  })
                : await addSolarSizing.mutateAsync({
                      ...dataToBeSent,
                  })

        await handleResponse(response as AxiosResponse<AddUpdateSolarSizingType>)
    }

    const isDataReadyToBeShown = useMemo(() => {
        return (
            solarSizingData &&
            isNumber(annualProduction) &&
            isNumber(autoConsumptionPercentage) &&
            isNumber(averageConsumptionFromAnualProduction) &&
            isNumber(autoProductionPercentage) &&
            isNumber(averageProducationFromAnualProduction) &&
            isNumber(nominalPower)
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
        if (reduxSolarSizingDetails) {
            setOrientationValue(reduxSolarSizingDetails.orientation)
            setInclinationValue(reduxSolarSizingDetails.inclination)
        }
    }, [reduxSolarSizingDetails])

    return (
        <>
            <div
                className={clsx(
                    'w-full grid grid-rows-1 gap-10',
                    Boolean(isDataReadyToBeShown) ? 'md:grid-cols-8' : 'md:grid-cols-6',
                    Boolean(isDataReadyToBeShown) && 'grid-rows-2',
                )}
            >
                <div className={clsx(Boolean(isDataReadyToBeShown) ? 'col-span-5' : 'col-span-6')}>
                    <Form onSubmit={handleFormSubmit} defaultValues={formDefaultValues}>
                        <TextField
                            className="mb-10"
                            name="surface"
                            label="Dimensions de ma toiture"
                            placeholder="m2"
                            fullWidth
                            type="number"
                            validateFunctions={[requiredBuilder()]}
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
                    </Form>
                </div>
                {Boolean(isDataReadyToBeShown) && (
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
                )}
            </div>
        </>
    )
}
