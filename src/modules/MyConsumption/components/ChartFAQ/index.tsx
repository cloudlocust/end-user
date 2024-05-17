import { useMemo, FC } from 'react'
import { FAQ } from 'src/modules/shared/FAQ'
import { FAQProps } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQ.types'
import { getFAQItemsByPeriodAndContractType } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQFunctions'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useContractList } from 'src/modules/Contracts/contractsHook'

/**
 * ChartFAQ Component used to help understand the charts.
 *
 * @param root0 Props.
 * @param root0.period Used to display the right FAQ.
 * @param root0.housingId House id used to get it contracts.
 * @returns JSX.Element.
 */
export const ChartFAQ: FC<FAQProps> = ({ period, housingId }) => {
    const { elementList: contractList } = useContractList(housingId)

    // check if the user has a tempo contract
    const doesUserHasTempoContract = useMemo(() => {
        if (!contractList) return false
        return contractList?.some((contract) => contract.tariffType.name === 'Jour Tempo')
    }, [contractList])

    const [faqItems, faqTitle] = useMemo(
        () => getFAQItemsByPeriodAndContractType(period, doesUserHasTempoContract),
        [period, doesUserHasTempoContract],
    )

    // todo: activate later when the FAQ content be ready
    if (period !== PeriodEnum.DAILY || doesUserHasTempoContract) {
        return null
    }
    return <FAQ items={faqItems} title={faqTitle} />
}
