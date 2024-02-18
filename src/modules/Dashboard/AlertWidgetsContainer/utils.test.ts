import { AlertPeriodEnum } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/AlertWidget.d'
import { convertAlertPeriodEnumToPeriodEnum } from 'src/modules/Dashboard/AlertWidgetsContainer/utils'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

describe('convertToPeriodEnum', () => {
    test('should convert DAILY AlertPeriodEnum to DAILY PeriodEnum', () => {
        const testCases = [
            { alertPeriod: AlertPeriodEnum.DAILY, period: PeriodEnum.DAILY },
            { alertPeriod: AlertPeriodEnum.WEEKLY, period: PeriodEnum.WEEKLY },
            { alertPeriod: AlertPeriodEnum.MONTHLY, period: PeriodEnum.MONTHLY },
        ]
        testCases.forEach(({ alertPeriod, period }) => {
            expect(convertAlertPeriodEnumToPeriodEnum(alertPeriod)).toBe(period)
        })
    })
})
