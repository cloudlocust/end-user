import { createElement, Fragment } from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { TEST_SUCCESS_DAY_METRICS } from 'src/mocks/handlers/metrics'
import {
    checkMissingDataList,
    getMaxTimeBetweenSuccessiveMissingValue,
    getMessageOfSuccessiveMissingDataOfCurrentDayByGapInterval,
    getMessageOfSuccessiveMissingDataOfCurrentDay,
    checkWhetherResalePriceFormShouldBeShown,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartFunctions'
import { equipmentType, installationInfosType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

let datapointsOfMetrics = [
    [
        [null, 1709856000000],
        [null, 1709856060000],
        [null, 1709856120000],
        [4, 1709856180000],
    ],
    [
        [5, 1709856000000],
        [null, 1709856060000],
        [null, 1709856120000],
        [8, 1709856180000],
    ],
    [
        [9, 1709856000000],
        [null, 1709856060000],
        [null, 1709856120000],
        [null, 1709856180000],
    ],
] as number[][][]

const MESSAGE_OF_MESSING_VALUES =
    'Oups ! Une partie de vos données sur la journée n’est pas disponible. La connexion avec votre nrLINK semble avoir été rompue pendant quelques minutes.'

const MESSAGE_OF_MESSING_VALUES_OF_LAST_TIME =
    'Oups ! Une partie de vos données sur la journée n’est pas disponible. La connexion avec votre nrLINK semble rompue, vérifiez sur son écran qu’il est bien connecté au wifi et à l’ERL, si besoin n’hésitez pas à le redémarrer, puis patientez quelques minutes.'

// Create range of current day
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const day = now.getDate()
// Create a new Date object with current year, month, and day (set hours, minutes, etc. to 0)
const beggingDayDate = new Date(year, month, day, 0, 0, 0, 0)
const endingDayDate = new Date(year, month, day, 23, 59, 59, 999)

let mockRange = {
    from: beggingDayDate.toISOString(),
    to: endingDayDate.toISOString(),
}

let mockData: IMetric[] = TEST_SUCCESS_DAY_METRICS(
    [metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption, metricTargetsEnum.peakHourBlueTempoConsumption],
    mockRange,
)

// mock data by set the value null
Array(5)
    .fill(null)
    .forEach((_, index) => {
        mockData.forEach((_, dataMetricIndex) => {
            mockData[dataMetricIndex]['datapoints'][index + 10][0] = null as unknown as number
        })
    })

describe('ConsumptionChartFunctions test', () => {
    // Should return an array of tuples with the same length as the input array
    it('should return an array of tuples with the same length as the input array when given a non-empty input array', () => {
        const result = checkMissingDataList(datapointsOfMetrics)
        expect(result.length).toBe(datapointsOfMetrics[0].length)
    })

    it('should return an empty array when given an empty input array', () => {
        const datapointsOfMetrics: number[][][] = []
        const result = checkMissingDataList(datapointsOfMetrics)
        expect(result.length).toBe(0)
    })

    it('should return the correct data', () => {
        const result = checkMissingDataList(datapointsOfMetrics)
        expect(result).toStrictEqual([
            [true, 1709856000000],
            [false, 1709856060000],
            [false, 1709856120000],
            [true, 1709856180000],
        ])
    })

    it('should return 2min the maximum time between successive missing values when given valid input', () => {
        const result = getMaxTimeBetweenSuccessiveMissingValue(datapointsOfMetrics)
        expect(result).toBe(2)
    })

    it('should return 0min when there are no missing values', () => {
        datapointsOfMetrics = datapointsOfMetrics.map((item, index) =>
            index === 0 ? item : item.map(([_value, time]) => [1, time]),
        )
        const result = getMaxTimeBetweenSuccessiveMissingValue(datapointsOfMetrics)
        expect(result).toBe(0)
    })
})

describe('getMessageOfSuccessiveMissingDataOfCurrentDay', () => {
    let mockPeriod = PeriodEnum.DAILY
    test('should return null when data is available for the whole day', () => {
        const result = getMessageOfSuccessiveMissingDataOfCurrentDay(mockData, mockPeriod, mockRange)
        expect(result).toBeNull()
    })

    test('should return null for empty consumptionChartData', () => {
        const result = getMessageOfSuccessiveMissingDataOfCurrentDay([], mockPeriod, mockRange)
        expect(result).toBeNull()
    })

    test('should return a message when data is missing for 5 minutes', () => {
        const minTimeBetweenSuccessiveMissingValues = 5
        const result = getMessageOfSuccessiveMissingDataOfCurrentDayByGapInterval(
            mockData,
            mockRange,
            minTimeBetweenSuccessiveMissingValues,
        )

        // Use this component to test the result because it should return FormattedMessage.
        const { getByText } = reduxedRender(createElement(Fragment, { children: result }))
        expect(getByText(MESSAGE_OF_MESSING_VALUES)).toBeInTheDocument()
    })

    test('should return a message when data is missing for last 5 minutes from current time', () => {
        const currentTime = new Date().getTime()
        const minTimeBetweenSuccessiveMissingValues = 5

        // mock data by set the value null between [currentTime, currentTime - 5min]
        mockData[0]['datapoints'].forEach(([_, time], index) => {
            if (time <= currentTime && time >= currentTime - 10 * 60 * 1000) {
                mockData.forEach((_, dataMetricIndex) => {
                    mockData[dataMetricIndex]['datapoints'][index][0] = null as unknown as number
                })
            }
        })

        const result = getMessageOfSuccessiveMissingDataOfCurrentDayByGapInterval(
            mockData,
            mockRange,
            minTimeBetweenSuccessiveMissingValues,
        )
        // Use this component to test the result because it should return FormattedMessage.
        const { getByText } = reduxedRender(createElement(Fragment, { children: result }))
        expect(getByText(MESSAGE_OF_MESSING_VALUES_OF_LAST_TIME)).toBeInTheDocument()
    })
})

describe('checkWhetherResalePriceFormShouldBeShown', () => {
    test('should return false if consumptionToggleButton is not autoconsmption-production', () => {
        const result = checkWhetherResalePriceFormShouldBeShown(SwitchConsumptionButtonTypeEnum.Consumption, null, {
            housingEquipments: [],
        })
        expect(result).toBe(false)
    })

    test('should return false if equipmentsList is null', () => {
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            null,
            { housingEquipments: [] },
        )
        expect(result).toBe(false)
    })

    test('should return false if installationInfos is null', () => {
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            [],
            null,
        )
        expect(result).toBe(false)
    })

    test('should return false if no solar panel equipment is present in equipmentsList', () => {
        const equipmentsList: equipmentType[] = [{ id: 1, name: 'heater', allowedType: ['electricity'] }]
        const installationInfos = { housingEquipments: [] }
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            equipmentsList,
            installationInfos,
        )
        expect(result).toBe(false)
    })

    test('should return false if no housing equipment matches the solar panel id', () => {
        const equipmentsList: equipmentType[] = [{ id: 1, name: 'solarpanel', allowedType: ['electricity'] }]
        const installationInfos = { housingEquipments: [] }
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            equipmentsList,
            installationInfos,
        )
        expect(result).toBe(false)
    })

    test('should return false if solar panel equipmentType is not existant', () => {
        const equipmentsList: equipmentType[] = [{ id: 1, name: 'solarpanel', allowedType: ['electricity'] }]
        const installationInfos: installationInfosType = {
            housingEquipments: [{ equipmentId: 1, equipmentType: 'nonexistant' }],
            solarInstallation: { hasResaleContract: true, resaleTariff: undefined },
        }
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            equipmentsList,
            installationInfos,
        )
        expect(result).toBe(false)
    })

    test('should return false if hasResaleContract is false', () => {
        const equipmentsList: equipmentType[] = [{ id: 1, name: 'solarpanel', allowedType: ['electricity'] }]
        const installationInfos: installationInfosType = {
            housingEquipments: [{ equipmentId: 1, equipmentType: 'existant' }],
            solarInstallation: { hasResaleContract: false, resaleTariff: undefined },
        }
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            equipmentsList,
            installationInfos,
        )
        expect(result).toBe(false)
    })

    test('should return false if resaleTariff is specified', () => {
        const equipmentsList: equipmentType[] = [{ id: 1, name: 'solarpanel', allowedType: ['electricity'] }]
        const installationInfos: installationInfosType = {
            housingEquipments: [{ equipmentId: 1, equipmentType: 'existant' }],
            solarInstallation: { hasResaleContract: true, resaleTariff: 0.15 },
        }
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            equipmentsList,
            installationInfos,
        )
        expect(result).toBe(false)
    })

    test('should return true if solar panel exists, has resale contract, and resaleTariff is null', () => {
        const equipmentsList: equipmentType[] = [{ id: 1, name: 'solarpanel', allowedType: ['electricity'] }]
        const installationInfos: installationInfosType = {
            housingEquipments: [{ equipmentId: 1, equipmentType: 'existant' }],
            solarInstallation: { hasResaleContract: true, resaleTariff: undefined },
        }
        const result = checkWhetherResalePriceFormShouldBeShown(
            SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            equipmentsList,
            installationInfos,
        )
        expect(result).toBe(true)
    })
})
