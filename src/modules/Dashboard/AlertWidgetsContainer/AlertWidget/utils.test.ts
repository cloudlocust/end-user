import {
    calculateGaugeChartPercent,
    getFormatedAlertThreshold,
} from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/utils'
import { AlertTypeEnum } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/AlertWidget.d'

describe('calculateGaugeChartPercent', () => {
    test('should return 1 when alertThreshold is less than or equal to 0 or when alertThreshold is greater than currentValue', () => {
        const testCases = [
            { alertThreshold: -1, currentValue: 10, expectedPercent: 1 },
            { alertThreshold: 0, currentValue: 12, expectedPercent: 1 },
            { alertThreshold: 2, currentValue: 4, expectedPercent: 1 },
        ]
        testCases.forEach(({ alertThreshold, currentValue, expectedPercent }) => {
            expect(calculateGaugeChartPercent(alertThreshold, currentValue)).toBe(expectedPercent)
        })
    })

    test('should calculate the correct percent prop value', () => {
        const testCases = [
            { alertThreshold: 50, currentValue: 25, expectedPercent: 0.5 },
            { alertThreshold: 100, currentValue: 75, expectedPercent: 0.75 },
            { alertThreshold: 70, currentValue: 15, expectedPercent: 0.21 },
        ]
        testCases.forEach(({ alertThreshold, currentValue, expectedPercent }) => {
            expect(calculateGaugeChartPercent(alertThreshold, currentValue)).toBe(expectedPercent)
        })
    })
})

describe('getFormatedAlertThreshold', () => {
    test('should return the correct formatted alertThreshold value for each AlertTypeEnum', () => {
        const testCases = [
            { alertThreshold: 50, alertType: AlertTypeEnum.PRICE, expectedAlertThreshold: '50 €' },
            { alertThreshold: 3.178, alertType: AlertTypeEnum.PRICE, expectedAlertThreshold: '3.18 €' },
            { alertThreshold: 120, alertType: AlertTypeEnum.CONSUMPTION, expectedAlertThreshold: '120 Wh' },
            { alertThreshold: 3041, alertType: AlertTypeEnum.CONSUMPTION, expectedAlertThreshold: '3.04 kWh' },
            { alertThreshold: 10, alertType: 'invalidType' as AlertTypeEnum, expectedAlertThreshold: '' },
        ]
        testCases.forEach(({ alertThreshold, alertType, expectedAlertThreshold }) => {
            expect(getFormatedAlertThreshold(alertThreshold, alertType)).toBe(expectedAlertThreshold)
        })
    })
})
