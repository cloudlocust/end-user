import { useMemo, FC } from 'react'
import { FAQ } from 'src/modules/shared/FAQ'
import { FAQProps } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQ.types'
import { getFAQItemsByPeriodAndContractType } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQFunctions'

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
    return <FAQ items={faqItems} title={faqTitle} style={{ maxWidth: '625px', margin: 'auto' }} />
}
