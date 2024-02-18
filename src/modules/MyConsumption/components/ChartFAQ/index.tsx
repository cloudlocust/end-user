import { useMemo, FC } from 'react'
import { FAQ } from 'src/modules/shared/FAQ'
import { FAQItem } from 'src/modules/shared/FAQ/FAQTypes.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * The title of the FAQ for the daily period.
 */
export const faqTitleForDailyPeriod = 'Comprendre ma consommation'
/**
 *  The FAQ items questions/answers for the daily period.
 */
export const faqForDailyPeriod: Array<FAQItem> = [
    {
        title: 'Comment expliquer ma consommation alors que je suis absent(e) ?',
        content:
            'Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa. Sit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
    },
    {
        title: 'Pourquoi ma facture ne reflète-t-elle pas ma consommation mensuelle ?',
        content:
            'Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est. Aute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
    },
    {
        title: 'Est-il possible de suivre ma consommation en temps réel ?',
        content:
            'Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa. Culpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
    },
    {
        title: 'Comment sont utilisées mes données de consommation ?',
        content:
            'Excepteur deserunt tempor do lorem elit id magna pariatur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor. Consequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
    },
]

/**
 * The title of the FAQ for the tempo.
 */
export const faqTitleForTempo = 'Comprendre ma consommation Tempo'
/**
 *  The FAQ items questions/answers for the tempo.
 */
export const faqForTempo: Array<FAQItem> = [
    {
        title: 'Comment expliquer ma consommation alors que je suis absent(e) tempo?',
        content:
            'Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa. Sit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
    },
    {
        title: 'Pourquoi ma facture ne reflète-t-elle pas ma consommation mensuelle tempo ?',
        content:
            'Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est. Aute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
    },
    {
        title: 'Est-il possible de suivre ma consommation en temps réel tempo?',
        content:
            'Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa. Culpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
    },
    {
        title: 'Comment sont utilisées mes données de consommation tempo ?',
        content:
            'Excepteur deserunt tempor do lorem elit id magna pariatur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor. Consequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
    },
]

/**
 * ChartFAQ Props.
 */
type FAQProps =
    /**
     * ChartFAQ Props.
     */
    {
        /**
         * Period used to display the right FAQ.
         */
        period: PeriodEnum
    }

/**
 * ChartFAQ Component used to help understand the charts.
 *
 * @param root0 Props.
 * @param root0.period Used to display the right FAQ.
 * @returns JSX.Element.
 */
export const ChartFAQ: FC<FAQProps> = ({ period }) => {
    const [faqItems, faqTitle] = useMemo(
        () =>
            period === PeriodEnum.DAILY ? [faqForDailyPeriod, faqTitleForDailyPeriod] : [faqForTempo, faqTitleForTempo],
        [period],
    )
    return <FAQ items={faqItems} title={faqTitle} style={{ maxWidth: '625px', margin: 'auto' }} />
}
