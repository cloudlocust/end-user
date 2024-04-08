import { useMemo, FC } from 'react'
import { FAQ } from 'src/modules/shared/FAQ'
import { FAQProps } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQ.types'
import { getFAQItemsByPeriodAndContractType } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQFunctions'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * ChartFAQ Component used to help understand the charts.
 *
 * @param root0 Props.
 * @param root0.period Used to display the right FAQ.
 * @param root0.hasTempoContract Used to check if the user has tempo contract.
 * @returns JSX.Element.
 */
export const ChartFAQ: FC<FAQProps> = ({ period, hasTempoContract }) => {
    const [faqItems, faqTitle] = useMemo(
        () => getFAQItemsByPeriodAndContractType(period, hasTempoContract),
        [period, hasTempoContract],
    )
    // todo: activate later when the FAQ content be ready
    if (period !== PeriodEnum.DAILY || hasTempoContract) {
        return null
    }
    return <FAQ items={faqItems} title={faqTitle} />
}
