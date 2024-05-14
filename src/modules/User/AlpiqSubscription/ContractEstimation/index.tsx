import { useTheme, Card, Slider, Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Form } from 'src/common/react-platform-components'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import MenuItem from '@mui/material/MenuItem'
import {
    AlpiqContractTypeSelectOptions,
    AlpiqContractTypeSelectOptionsType,
    AlpiqPowerValuesSelectOptions,
} from './index.types'
import { ButtonLoader } from 'src/common/ui-kit'
import { NavigateNext } from '@mui/icons-material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAlpiqProvider } from 'src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import { IApliqMonthlySubscriptionEstimationResponse, IContractInfos } from 'src/modules/User/AlpiqSubscription'
import { IEnedisSgeConsent } from 'src/modules/Consents/Consents'
import { useHousingMeterDetails } from 'src/modules/Meters/metersHook'

/**
 * ContractEstimation step in alpiq.
 *
 * @param props Props.
 * @param props.handleNext Handle next Step.
 * @param props.enedisSgeConsent Enedis Sge.
 * @returns JSX Element.
 */
const ContractEstimation = ({
    /**
     * HandleNext.
     */
    handleNext,
    enedisSgeConsent,
}: /**
 */ {
    /**
     * Handle next.
     */
    handleNext: () => void
    /**
     * Enedis consent.
     */
    enedisSgeConsent?: IEnedisSgeConsent
}) => {
    const theme = useTheme()
    const dispatch = useDispatch<Dispatch>()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { formatMessage } = useIntl()
    // this one is used to store the estimation from the api
    const [monthlyEstimation, setMonthlyEstimation] = useState<IApliqMonthlySubscriptionEstimationResponse | undefined>(
        undefined,
    )
    // this one is used to calculate the estimation with the slider and render it in the UI.
    const [calculatedMonthlyEstimation, setCalculatedMonthlyEstimation] = useState<
        IApliqMonthlySubscriptionEstimationResponse | undefined
    >(undefined)
    const [sliderValue, setSliderValue] = useState<number | number[]>(0)
    const initialMountConsent = useRef(true)

    const { currentHousing, alpiqSubscriptionSpecs } = useSelector(({ housingModel }: RootState) => housingModel)
    const { getMonthlySubscriptionEstimation, loadingInProgress } = useAlpiqProvider()

    const { elementDetails: housingMeter, loadElementDetails: loadMeterInfos } = useHousingMeterDetails(
        currentHousing?.id ?? 0,
        false,
    )

    const loadOffpeakHouse = useCallback(async () => {
        await loadMeterInfos()
    }, [loadMeterInfos])

    useEffect(() => {
        if (initialMountConsent.current && currentHousing) {
            loadOffpeakHouse()
            initialMountConsent.current = false
        }
    }, [currentHousing, loadOffpeakHouse])

    /**
     * Format timestring from 22:00:00 to 22h00.
     *
     * @param timeString Time string to format.
     * @returns Time formatted.
     */
    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':')
        return `${hours}h${minutes}`
    }

    /**
     * Get peak hours text.
     *
     * @returns Peak hours text.
     */
    const getPeakHoursText = () => {
        return housingMeter?.features?.offpeak?.offpeakHours.map(
            (offpeakHour) => `${formatTime(offpeakHour.start)} à ${formatTime(offpeakHour.end)}`,
        )
    }

    /**
     * Function that allows to set default contract infos.
     *
     * @returns Default contract infos.
     */
    const setDefaultContractInfos = () => {
        if (alpiqSubscriptionSpecs)
            return {
                contractType: alpiqSubscriptionSpecs.optionTarifaire,
                power: alpiqSubscriptionSpecs.puissanceSouscrite,
            }
        else if (enedisSgeConsent?.extraData)
            return {
                power: enedisSgeConsent.extraData.maxPower.value,
                contractType: enedisSgeConsent.extraData.contractType === 'Base' ? 'BASE' : 'HPHC',
            }
        else
            return {
                power: undefined,
                contractType: undefined,
            }
    }

    const defaultFormValue = setDefaultContractInfos()

    const [contractInfos, setContractInfos] = useState<IContractInfos>(defaultFormValue)

    /**
     * On Submit function.
     *
     * @param data Data to send.
     * @param data.contractType Contract Type.
     * @param data.power Power.
     * @returns Void.
     */
    const onSubmit = async (data: IContractInfos) => {
        const monthlyEstimationData: IApliqMonthlySubscriptionEstimationResponse | undefined =
            await getMonthlySubscriptionEstimation(data.power, data.contractType, currentHousing?.id)

        if (monthlyEstimationData) {
            setMonthlyEstimation(monthlyEstimationData)
            setCalculatedMonthlyEstimation(monthlyEstimationData)
            setSliderValue(0)
            setContractInfos(data)
        }
    }

    /**
     * Calculate the variation of the estimation and the car based on the stored estimation got from the api.
     *
     * @param pourcentage Pourcentage that we want to vary.
     * @returns New estimation.
     */
    const calculateEstimationAndCarVariation = (pourcentage: number | number[]) => {
        if (!monthlyEstimation || Array.isArray(pourcentage)) return { price: undefined, kwh: undefined }
        const priceVariation = monthlyEstimation.monthlySubscriptionEstimation * (pourcentage / 100)
        const carVariation = monthlyEstimation.annualReferenceConsumption * (pourcentage / 100)

        const newPrice = monthlyEstimation.monthlySubscriptionEstimation + priceVariation
        const newKwh = monthlyEstimation.annualReferenceConsumption + carVariation
        return {
            price: Math.floor(newPrice),
            kwh: Math.floor(newKwh),
        }
    }

    /**
     * On Change for slider.
     *
     * @param _ Event.
     * @param value Value.
     */
    const handleChange = (_: Event, value: number | number[]) => {
        setSliderValue(value)
        const { price, kwh } = calculateEstimationAndCarVariation(value)
        if (price && kwh)
            setCalculatedMonthlyEstimation({ monthlySubscriptionEstimation: price, annualReferenceConsumption: kwh })
    }

    return (
        <div className="flex flex-col w-full items-center justify-start">
            <div className="flex items-center justify-center mb-32 md:mb-48 flex-col">
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    textAlign="center"
                    variant={isMobile ? 'body1' : 'h6'}
                    fontWeight={600}
                >
                    Mon contrat BôWatts par Alpiq
                </TypographyFormatMessage>
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    textAlign="center"
                    variant={isMobile ? 'body1' : 'h6'}
                    fontWeight={600}
                >
                    L'électricité verte du beaujolais
                </TypographyFormatMessage>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col w-full items-center mb-20 mx-0 md:mx-20">
                    <div className="w-full flex-col mb-12 md:mb-24">
                        <div
                            className={`flex w-full ${
                                isMobile ? 'justify-center' : 'justify-start'
                            } items-center ml-10`}
                        >
                            <TypographyFormatMessage
                                color={theme.palette.primary.main}
                                textAlign="center"
                                variant="body1"
                                fontWeight={600}
                            >
                                Paramétrez votre contrat Bôwatts :
                            </TypographyFormatMessage>
                        </div>
                        <div className="w-full">
                            <Form
                                onSubmit={onSubmit}
                                defaultValues={{
                                    power: contractInfos?.power,
                                    contractType: contractInfos?.contractType,
                                }}
                            >
                                <div className="flex w-full flex-col md:flex-row items-center justify-start">
                                    <SelectAlpiqContractForm
                                        title="Type de contrat"
                                        options={AlpiqContractTypeSelectOptions}
                                        name="contractType"
                                    />
                                    <SelectAlpiqContractForm
                                        title="Puissance"
                                        options={AlpiqPowerValuesSelectOptions}
                                        name="power"
                                    />
                                    <div className="flex items-center justify-center flex-1 mx-10">
                                        <ButtonLoader inProgress={loadingInProgress} type="submit">
                                            Estimer ma mensualité
                                        </ButtonLoader>
                                    </div>
                                </div>
                                {housingMeter?.features?.offpeak?.offpeakHours && (
                                    <div className="ml-10 mt-10">
                                        <TypographyFormatMessage sx={{ color: textNrlinkColor }} variant="caption">
                                            {`Les périodes de consommation réduites de votre compteur sont de : ${getPeakHoursText()?.join(
                                                'et de ',
                                            )}`}
                                        </TypographyFormatMessage>
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
                <div
                    className={`w-full flex ${
                        isMobile ? 'flex-col items-center justify-center' : 'flex-row items-end justify-between mb-20'
                    }`}
                >
                    <Card
                        className={`rounded-16 border border-slate-600 bg-gray-50 mx-0 md:mx-10 w-full md:w-400 h-320 flex flex-col justify-center ${
                            isMobile && 'mb-20'
                        }`}
                    >
                        <div className="flex flex-col items-start justify-between ml-10 mb-24">
                            <TypographyFormatMessage
                                color={theme.palette.primary.main}
                                textAlign="center"
                                variant="h6"
                                className="mb-12"
                            >
                                Votre mensualité:
                            </TypographyFormatMessage>
                            <TypographyFormatMessage
                                variant={isMobile ? 'body2' : 'body1'}
                                color={theme.palette.common.black}
                                fontWeight={400}
                            >
                                Mensualité calculée à partir de vos consommations passées.
                            </TypographyFormatMessage>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <TypographyFormatMessage color={theme.palette.primary.main} textAlign="center" variant="h6">
                                {`${calculatedMonthlyEstimation?.monthlySubscriptionEstimation ?? '--'} €TTC/Mois`}
                            </TypographyFormatMessage>
                            {calculatedMonthlyEstimation && (
                                <div className="flex items-center w-1/2">
                                    <Slider
                                        value={sliderValue}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="off"
                                        step={1}
                                        min={-15}
                                        max={15}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-center mx-10">
                                <Typography
                                    variant={isMobile ? 'body2' : 'body1'}
                                    color={theme.palette.common.black}
                                    fontWeight={300}
                                    data-testid="estimation-result"
                                >
                                    {formatMessage(
                                        {
                                            id: 'Pour une consommation estimée à {value}',
                                            defaultMessage: 'Pour une consommation estimée à {value}',
                                        },
                                        {
                                            value: (
                                                <b style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                                    {calculatedMonthlyEstimation
                                                        ? Math.floor(
                                                              calculatedMonthlyEstimation?.annualReferenceConsumption,
                                                          )
                                                        : '--'}{' '}
                                                    kWh/an
                                                </b>
                                            ),
                                        },
                                    )}
                                </Typography>
                            </div>
                        </div>
                        <div className="w-11/12 ml-10 mt-12">
                            <TypographyFormatMessage variant="caption" sx={{ color: textNrlinkColor }}>
                                * Votre mensualité pourra être ajustée dans votre espace client ALPIQ 2 mois après votre
                                souscription
                            </TypographyFormatMessage>
                        </div>
                    </Card>
                    <div className={`${!isMobile ? 'px-20' : 'w-full'} flex justify-end items-center`}>
                        <ButtonLoader
                            disabled={calculatedMonthlyEstimation === undefined || contractInfos === undefined}
                            color="primary"
                            endIcon={<NavigateNext />}
                            onClick={() => {
                                if (contractInfos && calculatedMonthlyEstimation) {
                                    // save them for next step
                                    dispatch.housingModel.setAlpiqSubscriptionSpecs({
                                        puissanceSouscrite: contractInfos.power,
                                        optionTarifaire: contractInfos.contractType,
                                        mensualite: calculatedMonthlyEstimation.monthlySubscriptionEstimation,
                                        car: calculatedMonthlyEstimation.annualReferenceConsumption,
                                    })
                                    handleNext()
                                }
                            }}
                        >
                            {formatMessage({
                                id: 'Continuer',
                                defaultMessage: 'Continuer',
                            })}
                        </ButtonLoader>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractEstimation

/**
 * Custom Select for Alpiq contract form.
 *
 * @param props Props.
 * @param props.title Title of placeholder.
 * @param props.options Available Options.
 * @param props.name Name of the value to send in form.
 * @returns JSX Element.
 */
const SelectAlpiqContractForm = ({
    title,
    options,
    name,
}: /**
 *
 */
{
    /**
     * Title.
     */
    title: string
    /**
     * Options.
     */
    options: AlpiqContractTypeSelectOptionsType[]
    /**
     * Name.
     */
    name: string
}) => {
    const { formatMessage } = useIntl()
    return (
        <div className="flex flex-1 w-5/6 md:2/3 mx-10">
            <Select
                name={name}
                label={title}
                style={{
                    width: '100%',
                }}
                validateFunctions={[requiredBuilder()]}
                formControlProps={{
                    margin: 'normal',
                }}
            >
                {options.map((option, _index) => (
                    <MenuItem key={_index} value={option.value}>
                        {formatMessage({
                            id: option.label,
                            defaultMessage: option.label,
                        })}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}
