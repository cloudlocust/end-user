import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import {
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Link } from 'react-router-dom'
import { Icon, Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { useConsents } from 'src/modules/Consents/consentsHook'
import CircularProgress from '@mui/material/CircularProgress'
import { subMonths, startOfMonth, endOfMonth, subDays } from 'date-fns'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { computeTotalConsumption } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import AnalysisInformationList from 'src/modules/Analysis/components/AnalysisInformationList'
import AnalysisPercentageChangeArrows from 'src/modules/Analysis/components/AnalysisPercentageChangeArrows'
import convert, { Unit } from 'convert-units'
import AnalysisChart from 'src/modules/Analysis/components/AnalysisChart'
import { analysisInformationName } from './analysisTypes'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * InitialMetricsStates for useMetrics.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '1d',
    range: {
        from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(new Date(), 1))),
        to: getDateWithoutTimezoneOffset(endOfMonth(subMonths(new Date(), 1))),
    },
    targets: [
        {
            target: metricTargetsEnum.consumption,
            type: 'timeserie',
        },
    ],
    filters: [],
}

/**
 * Analysis.
 * Parent component.
 *
 * @returns Analysis and its children.
 */
const Analysis = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { getConsents, nrlinkConsent, enedisConsent } = useConsents()
    const { data, setRange, setFilters, isMetricsLoading, filters, range } = useMetrics(initialMetricsHookValues)
    const [activeInformationName, setActiveInformationName] = useState<analysisInformationName | undefined>(undefined)

    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    /**
     * Handler to set the correct information name (min, max, mean) Based on the selected value element fill color in analysisChart.
     *
     * @param color Fill Color of the selected value element.
     */
    const getSelectedValueElementColor = (color: string) => {
        switch (color) {
            case theme.palette.primary.light:
                setActiveInformationName('minConsumptionDay')
                break
            case theme.palette.primary.dark:
                setActiveInformationName('maxConsumptionDay')
                break
            default:
                setActiveInformationName('meanConsumption')
        }
    }

    useEffect(() => {
        if (currentHousing && currentHousing.meter) setFilters(formatMetricFilter(currentHousing.meter.guid))
    }, [currentHousing, setFilters])

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (filters.length > 0) {
            getConsents(filters[0].value)
        }
    }, [filters, getConsents])

    /**
     * Handler when DatePicker change, to apply the range related to Analysis Component and overwrites the default ConsumptionDatePicker.
     * In Analysis range always go from: start month of a given date, to: end of same month for the same given date.
     *
     * @param newDate Represent the new picked date on DatePicker.
     */
    const handleDatePickerOnChange = (newDate: Date) => {
        const newRange = {
            from: getDateWithoutTimezoneOffset(startOfMonth(newDate)),
            to: getDateWithoutTimezoneOffset(endOfMonth(newDate)),
        }
        setRange(newRange)
    }

    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (
        (nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT' && enedisConsent?.enedisConsentState === 'NONEXISTENT') ||
        (currentHousing && currentHousing.meter === null)
    ) {
        return (
            <div className="container relative h-200 sm:h-256 p-16 sm:p-24 flex-col text-center flex items-center justify-center">
                <>
                    <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: theme.palette.secondary.main }}>
                        error_outline_outlined
                    </Icon>
                </>
                <Typography>
                    {formatMessage({
                        id: "Pour voir votre consommation vous devez d'abord ",
                        defaultMessage: "Pour voir votre consommation vous devez d'abord ",
                    })}
                    <Link to={`/nrlink-connection-steps/${currentHousing?.id}`} className="underline">
                        {formatMessage({
                            id: 'enregistrer votre compteur et votre nrLink',
                            defaultMessage: 'enregistrer votre compteur et votre nrLink',
                        })}
                    </Link>
                </Typography>
            </div>
        )
    }

    const totalConsumption = data.length !== 0 ? computeTotalConsumption(data) : { value: 0, unit: 'kWh' }
    const referenceConsumptionValue = Number(
        convert(totalConsumption.value)
            .from(totalConsumption.unit as Unit)
            .to('Wh'),
    )
    return (
        <div>
            <div
                style={{ background: theme.palette.primary.main, minHeight: '64px' }}
                className="w-full relative flex flex-col justify-center items-center p-16"
            >
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <TypographyFormatMessage
                        className="text-18 md:text-24"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        Consommation Quotidienne pour
                    </TypographyFormatMessage>
                    <MyConsumptionDatePicker
                        period={'monthly' as periodType}
                        setRange={setRange}
                        range={range}
                        onDatePickerChange={handleDatePickerOnChange}
                        maxDate={endOfMonth(subMonths(new Date(), 1))}
                    />
                </motion.div>
            </div>

            <div style={{ position: 'relative' }}>
                {isMetricsLoading ? (
                    <div
                        style={{ height: '300px' }}
                        className="p-24 CircularProgress flex flex-col justify-center items-center "
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <AnalysisChart data={data} getSelectedValueElementColor={getSelectedValueElementColor}>
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-16 md:text-20 font-medium mb-8">
                                {totalConsumption.value} {totalConsumption.unit}
                            </p>
                            <AnalysisPercentageChangeArrows
                                dateReferenceConsumptionValue={subDays(new Date(range.to), 1)}
                                referenceConsumptionValue={referenceConsumptionValue}
                                filters={filters}
                            />
                        </div>
                    </AnalysisChart>
                )}
            </div>
            {!isMetricsLoading && (
                <div className="p-24 analysis-information-list">
                    <AnalysisInformationList activeInformationName={activeInformationName} data={data} range={range} />
                </div>
            )}
        </div>
    )
}

export default Analysis
