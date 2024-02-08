import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import { IWidgetItemProps } from 'src/modules/MyConsumption/components/WidgetItem/WidgetItem'

const NO_DATA_MESSAGE = 'Aucune donnée disponible'
const TITLE_WIDGET_ITEM = 'Consommation Totale'
const VALUE_TEXT = '70'
const UNIT_TEXT = 'Wh'

const mockWidgetPropsDefault: IWidgetItemProps = {
    target: metricTargetsEnum.consumption,
    title: TITLE_WIDGET_ITEM,
    value: 70,
    unit: 'Wh',
    percentageChange: 50,
}

describe('WidgetItem Component test', () => {
    test('when there is a value, the WidgetItem infos is shown correctly', async () => {
        const { getByText } = reduxedRender(<WidgetItem {...mockWidgetPropsDefault} />)

        expect(getByText(TITLE_WIDGET_ITEM)).toBeInTheDocument()
        expect(getByText(VALUE_TEXT)).toBeInTheDocument()
        expect(getByText(UNIT_TEXT)).toBeInTheDocument()
    })
    test('when there is no value, an error message is shown', async () => {
        const mockWidgetProps: IWidgetItemProps = {
            ...mockWidgetPropsDefault,
            value: 0,
            noValueMessage: <h1>{NO_DATA_MESSAGE}</h1>,
        }
        const { getByText } = reduxedRender(<WidgetItem {...mockWidgetProps} />)

        expect(getByText(TITLE_WIDGET_ITEM)).toBeInTheDocument()
        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })
    test('when the percentageChange is positive, the trending_up is shown', async () => {
        const { getByText } = reduxedRender(<WidgetItem {...mockWidgetPropsDefault} />)

        expect(getByText('trending_up')).toBeInTheDocument()
    })
    test('when the percentageChange is negative, the trending_down is shown', async () => {
        const mockWidgetProps: IWidgetItemProps = {
            ...mockWidgetPropsDefault,
            percentageChange: -50,
        }
        const { getByText } = reduxedRender(<WidgetItem {...mockWidgetProps} />)

        expect(getByText('trending_down')).toBeInTheDocument()
    })
    test('when the percentageChange is null, the trending_down should not be shown', async () => {
        const mockWidgetProps: IWidgetItemProps = {
            ...mockWidgetPropsDefault,
            percentageChange: 0,
        }
        const { queryByText } = reduxedRender(<WidgetItem {...mockWidgetProps} />)

        expect(queryByText('trending_down')).not.toBeInTheDocument()
        expect(queryByText('trending_up')).not.toBeInTheDocument()
    })

    test.each`
        target
        ${metricTargetsEnum.internalTemperature}
        ${metricTargetsEnum.externalTemperature}
    `('when the target is $target, the trending_up/down should not be shown', ({ target }) => {
        const mockWidgetProps: IWidgetItemProps = {
            ...mockWidgetPropsDefault,
            target,
            percentageChange: 50,
        }
        const { queryByText } = reduxedRender(<WidgetItem {...mockWidgetProps} />)

        expect(queryByText('trending_down')).not.toBeInTheDocument()
        expect(queryByText('trending_up')).not.toBeInTheDocument()
    })
})
