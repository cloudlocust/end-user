import { motion } from 'framer-motion'
import { ConsumptionEnedisSgeWarning } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { AnalysisHeaderProps } from 'src/modules/Analysis/components/AnalysisHeader/AnalysisHeader.d'

/**
 * Analysis header component.
 *
 * @param param0 N/A.
 * @param param0.setRange Setter for range.
 * @param param0.range Metric range.
 * @param param0.enedisSgeOff Boolean when enedis is off.
 * @returns Analysis header JSX.
 */
export default function AnalysisHeader({ setRange, range, enedisSgeOff }: AnalysisHeaderProps) {
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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
            <MyConsumptionDatePicker
                period={'monthly' as periodType}
                setRange={setRange}
                range={range}
                onDatePickerChange={handleDatePickerOnChange}
                maxDate={endOfMonth(subMonths(new Date(), 1))}
            />
            <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />
        </motion.div>
    )
}
