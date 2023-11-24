import { LastDataStatus } from 'src/modules/Dashboard/utils/utils.d'
import { findLastNonNullableDatapoint } from 'src/modules/Dashboard/utils/utils'
import { IMetric } from 'src/modules/Metrics/Metrics'

jest.mock('dayjs', () => {
    const originalDayjs = jest.requireActual('dayjs')
    const utc = require('dayjs/plugin/utc')
    const frLocale = require('dayjs/locale/fr')

    // eslint-disable-next-line jsdoc/require-jsdoc
    const mockDayjs = (...args: string[]) => {
        return args.length ? originalDayjs(...args) : originalDayjs('2023-01-01T12:00:00.000Z')
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    mockDayjs.extend = (plugin: any) => {
        originalDayjs.extend(plugin)
    }

    // Apply the UTC plugin (and other plugins if necessary)
    mockDayjs.extend(utc)

    // eslint-disable-next-line jsdoc/require-jsdoc
    mockDayjs.locale = (locale: any) => {
        if (locale === 'fr') {
            originalDayjs.locale(frLocale)
            return
        }
        originalDayjs.locale(locale)
    }

    return mockDayjs
})

describe('findLastNonNullableDatapoint', () => {
    it('should return No data received for more than 6 minutes', () => {
        const data = [
            {
                target: 'consumption_metrics',
                datapoints: [
                    [6.0, new Date('2023-01-01T11:54:00.000Z').getTime()], // Within 6 mins
                ],
            },
        ] as IMetric[]
        expect(findLastNonNullableDatapoint(data)).toStrictEqual({
            message: LastDataStatus.UPDATED,
            timestamp: data[0].datapoints[0][1],
            value: 6.0,
        })
    })

    it('should indicate no data received for more than 6 minutes for old data point', () => {
        const data = [
            {
                target: 'consumption_metrics',
                datapoints: [
                    [6.0, new Date('2023-01-01T11:51:00.000Z').getTime()], // More than 6 mins ago
                ],
            },
        ] as IMetric[]
        expect(findLastNonNullableDatapoint(data)).toStrictEqual({
            message: LastDataStatus.OUTDATED,
            timestamp: data[0].datapoints[0][1],
            value: 6.0,
        })
    })

    it('should handle the case with no valid data points', () => {
        const data = [
            {
                target: 'consumption_metrics',
                datapoints: [
                    [null, new Date('2023-01-01T11:51:00.000Z').getTime()], // Null value
                ],
            },
        ] as IMetric[]
        expect(findLastNonNullableDatapoint(data)).toBeNull()
    })
})
