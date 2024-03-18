import { useEffect, useMemo, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { Container, Button, Icon } from '@mui/material'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader, MuiTextField as TextField, Typography } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { ISolarSizing } from 'src/modules/SolarSizing/solarSizeing.types'
import { useSolarSizing } from 'src/modules/SolarSizing/solarSizingHook'
import { CustomRadioGroup } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import floor from 'lodash/floor'
import convert from 'convert-units'

/**
 * Solar sizing page.
 *
 * @returns Solar sizing page.
 */
export default function SolarSizing() {
    const currentHousing = useCurrentHousing()
    const [orientationValue, setOrientationValue] = useState<number>(0)
    const [inclinationValue, setInclinationValue] = useState<number>(0)
    const { addSolarSizing, refetch, solarSizingData } = useSolarSizing(currentHousing?.id)
    const history = useHistory()
    const [latestSurface, setLatestSurface] = useState<number>(0)
    const [potentialSolarPanelPerSurface, setPotentialSolarPanelPerSurface] = useState<number>(0)

    const oneSolarPanelSurface = 1.6 // m2 (Hard coded for now)

    const solarSizingDefaultValues = {}

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
     * Handle the form submission.
     *
     * @param data Form data.
     */
    const onSubmit = async (data: ISolarSizing) => {
        const dataToSubmit = { ...data, orientation: orientationValue, inclination: inclinationValue }
        const { surface } = data
        setLatestSurface(surface)
        await addSolarSizing.mutateAsync({ ...dataToSubmit, surface: parseInt(surface as unknown as string) })
        await refetch()
    }

    useEffect(() => {
        if (latestSurface) {
            setPotentialSolarPanelPerSurface(floor(latestSurface / oneSolarPanelSurface))
        }
    }, [latestSurface])

    const annualProduction = floor(convert(solarSizingData?.data['annualProduction']).from('kWh').to('MWh'), 1)
    // Kilowatt crête (kWc)
    const nominalPower = floor(solarSizingData?.data['nominalPower']!, 1)

    const autoConsumptionPercentage = floor(solarSizingData?.data['autoConsumptionPercentage']!, 1)
    const autoProductionPercentage = floor(solarSizingData?.data['autoProductionPercentage']!, 1)

    const averageConsumptionFromAnualProduction = useMemo(
        () => floor((annualProduction * autoConsumptionPercentage) / 100, 1),
        [annualProduction, autoConsumptionPercentage],
    )

    const averageProducationFromAnualProduction = useMemo(
        () => floor((annualProduction * autoProductionPercentage) / 100, 1),
        [annualProduction, autoProductionPercentage],
    )

    const isDataReadyToBeShown = useMemo(() => {
        return (
            addSolarSizing.isSuccess &&
            Number(annualProduction) &&
            Number(autoConsumptionPercentage) &&
            Number(averageConsumptionFromAnualProduction) &&
            Number(autoProductionPercentage) &&
            Number(averageProducationFromAnualProduction)
        )
    }, [
        addSolarSizing.isSuccess,
        annualProduction,
        autoConsumptionPercentage,
        autoProductionPercentage,
        averageConsumptionFromAnualProduction,
        averageProducationFromAnualProduction,
    ])

    return (
        <PageSimple
            header={
                <div className="w-full flex justify-between items-center">
                    <Button onClick={history.goBack} className="text-12 md:text-16 ml-10 mt-8" color="inherit">
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 mr-2"
                        >
                            arrow_back
                        </Icon>
                        <TypographyFormatMessage>Retour</TypographyFormatMessage>
                    </Button>
                </div>
            }
            content={
                <Container maxWidth="lg">
                    <div className="p-10">
                        <div className="mb-20">
                            <Typography className="mb-10 text-20">
                                Vous êtes vous déjà demandé combien pourrait vous rapporter une installation solaire ?
                            </Typography>
                            <Typography className="mb-10 text-20">
                                Simuler une installation solaire pour ma maison
                            </Typography>
                            <Typography className="text-16 font-medium">
                                Ensemble calculons votre potentiel solaire à partir de votre consommation, de votre
                                maison et du taux d'ensoleillement de votre ville.
                            </Typography>
                        </div>
                        <div
                            className={clsx(
                                'w-full grid grid-rows-1 md:grid-cols-8 gap-10',
                                addSolarSizing.isSuccess && 'grid-rows-2',
                            )}
                        >
                            <div className={clsx(addSolarSizing.isSuccess ? 'col-span-6' : 'col-span-8')}>
                                <Form onSubmit={onSubmit} defaultValues={solarSizingDefaultValues}>
                                    {/* Surface */}
                                    <TextField
                                        className="mb-10"
                                        name="surface"
                                        label="Dimensions de ma toiture"
                                        placeholder="m2"
                                        fullWidth
                                        type="number"
                                        validateFunctions={[requiredBuilder()]}
                                    />
                                    {/* Orientation */}
                                    <div className="flex flex-col full-w mb-14">
                                        <Typography className="mb-3 text-14 font-medium">Orientation :</Typography>
                                        <CustomRadioGroup
                                            data-testid="orientation-radio-group"
                                            boxClassName="grid grid-cols-2 md:grid-cols-4 gap-5"
                                            elements={[
                                                { value: '0', label: 'Nord' },
                                                { value: '45', label: 'Nord-Est' },
                                                { value: '90', label: 'Est' },
                                                { value: '135', label: 'Sud-Est' },
                                                { value: '180', label: 'Sud' },
                                                { value: '225', label: 'Sud-Ouest' },
                                                { value: '270', label: 'Ouest' },
                                                { value: '315', label: 'Nord-Ouest' },
                                            ]}
                                            onValueChange={onOrientationValueChange}
                                        />
                                    </div>
                                    {/* Inclination */}
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
                                            onValueChange={onInclinationValueChange}
                                        />
                                    </div>
                                    <ButtonLoader
                                        className="mt-10"
                                        type="submit"
                                        fullWidth
                                        inProgress={addSolarSizing.isLoading}
                                    >
                                        <Typography>Simuler mon installation solaire</Typography>
                                    </ButtonLoader>
                                </Form>
                            </div>
                            {Boolean(isDataReadyToBeShown) && (
                                <div className="col-span-2">
                                    <Typography paragraph className="mb-10 text-14">
                                        Votre maison peut être équipée de{' '}
                                        <strong>{potentialSolarPanelPerSurface}</strong> panneaux solaires, cela
                                        représente un potentiel <strong>{nominalPower}</strong> kWc / an avec
                                        l'ensoleillement de l'année passée dans votre ville. En fonction de la
                                        répartition de votre consommation dans la journée, vous pourriez alors
                                        autoconsommer <strong>{averageConsumptionFromAnualProduction}</strong> MWh soit
                                        <strong>{autoConsumptionPercentage}</strong>% de votre consommation totale.
                                        <strong>{autoProductionPercentage}</strong> % de votre production soit
                                        <strong>{averageProducationFromAnualProduction}</strong> MWh
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            }
        />
    )
}
