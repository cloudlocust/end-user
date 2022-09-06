import { rest } from 'msw'
import {
    getMetricType,
    IMetric,
    metricRangeType,
    metricTargetsEnum,
    metricTargetType,
} from 'src/modules/Metrics/Metrics.d'
import { METRICS_API } from 'src/modules/Metrics/metricsHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import dayjs from 'dayjs'
import { generateXAxisValues, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import Chance from 'chance'
/**
 * Data of one day with 2min interval.
 */
export const FAKE_DAY_DATA = [
    [79, 1640995200000],
    // [117, 1640995260000],
    [112, 1640995320000],
    // [92, 1640995380000],
    [109, 1640995440000],
    // [104, 1640995500000],
    [104, 1640995560000],
    // [69, 1640995620000],
    [86, 1640995680000],
    // [79, 1640995740000],
    [72, 1640995800000],
    // [65, 1640995860000],
    [100, 1640995920000],
    // [112, 1640995980000],
    [80, 1640996040000],
    // [120, 1640996100000],
    [86, 1640996160000],
    // [79, 1640996220000],
    [97, 1640996280000],
    // [121, 1640996340000],
    [62, 1640996400000],
    // [58, 1640996460000],
    [117, 1640996520000],
    // [105, 1640996580000],
    [87, 1640996640000],
    // [76, 1640996700000],
    [71, 1640996760000],
    // [86, 1640996820000],
    [113, 1640996880000],
    // [115, 1640996940000],
    [130, 1640997000000],
    // [88, 1640997060000],
    [110, 1640997120000],
    // [122, 1640997180000],
    [73, 1640997240000],
    // [57, 1640997300000],
    [91, 1640997360000],
    // [102, 1640997420000],
    [72, 1640997480000],
    // [103, 1640997540000],
    [76, 1640997600000],
    // [52, 1640997660000],
    [63, 1640997720000],
    // [99, 1640997780000],
    [119, 1640997840000],
    // [122, 1640997900000],
    [70, 1640997960000],
    // [76, 1640998020000],
    [59, 1640998080000],
    // [110, 1640998140000],
    [95, 1640998200000],
    // [58, 1640998260000],
    [78, 1640998320000],
    // [74, 1640998380000],
    [100, 1640998440000],
    // [85, 1640998500000],
    [110, 1640998560000],
    // [112, 1640998620000],
    [130, 1640998680000],
    // [66, 1640998740000],
    [123, 1640998800000],
    // [74, 1640998860000],
    [103, 1640998920000],
    // [74, 1640998980000],
    [92, 1640999040000],
    // [97, 1640999100000],
    [104, 1640999160000],
    // [91, 1640999220000],
    [90, 1640999280000],
    // [80, 1640999340000],
    [108, 1640999400000],
    // [83, 1640999460000],
    [67, 1640999520000],
    // [71, 1640999580000],
    [85, 1640999640000],
    // [63, 1640999700000],
    [87, 1640999760000],
    // [52, 1640999820000],
    [58, 1640999880000],
    // [97, 1640999940000],
    [59, 1641000000000],
    // [61, 1641000060000],
    [71, 1641000120000],
    // [68, 1641000180000],
    [104, 1641000240000],
    // [53, 1641000300000],
    [54, 1641000360000],
    // [82, 1641000420000],
    [63, 1641000480000],
    // [92, 1641000540000],
    [83, 1641000600000],
    // [122, 1641000660000],
    [126, 1641000720000],
    // [86, 1641000780000],
    [107, 1641000840000],
    // [118, 1641000900000],
    [89, 1641000960000],
    // [65, 1641001020000],
    [92, 1641001080000],
    // [54, 1641001140000],
    [53, 1641001200000],
    // [77, 1641001260000],
    [60, 1641001320000],
    // [52, 1641001380000],
    [79, 1641001440000],
    // [82, 1641001500000],
    [59, 1641001560000],
    // [84, 1641001620000],
    [81, 1641001680000],
    // [54, 1641001740000],
    [103, 1641001800000],
    // [86, 1641001860000],
    [75, 1641001920000],
    // [122, 1641001980000],
    [99, 1641002040000],
    // [61, 1641002100000],
    [121, 1641002160000],
    // [92, 1641002220000],
    [70, 1641002280000],
    // [58, 1641002340000],
    [79, 1641002400000],
    // [111, 1641002460000],
    [98, 1641002520000],
    // [120, 1641002580000],
    [114, 1641002640000],
    // [54, 1641002700000],
    [117, 1641002760000],
    // [71, 1641002820000],
    [112, 1641002880000],
    // [127, 1641002940000],
    [116, 1641003000000],
    // [130, 1641003060000],
    [66, 1641003120000],
    // [92, 1641003180000],
    [99, 1641003240000],
    // [112, 1641003300000],
    [59, 1641003360000],
    // [83, 1641003420000],
    [92, 1641003480000],
    // [70, 1641003540000],
    [65, 1641003600000],
    // [55, 1641003660000],
    [69, 1641003720000],
    // [116, 1641003780000],
    [102, 1641003840000],
    // [91, 1641003900000],
    [50, 1641003960000],
    // [124, 1641004020000],
    [83, 1641004080000],
    // [114, 1641004140000],
    [71, 1641004200000],
    // [74, 1641004260000],
    [79, 1641004320000],
    // [70, 1641004380000],
    [71, 1641004440000],
    // [55, 1641004500000],
    [102, 1641004560000],
    // [129, 1641004620000],
    [119, 1641004680000],
    // [104, 1641004740000],
    [82, 1641004800000],
    // [108, 1641004860000],
    [96, 1641004920000],
    // [53, 1641004980000],
    [109, 1641005040000],
    // [54, 1641005100000],
    [95, 1641005160000],
    // [100, 1641005220000],
    [89, 1641005280000],
    // [85, 1641005340000],
    [69, 1641005400000],
    // [87, 1641005460000],
    [81, 1641005520000],
    // [117, 1641005580000],
    [98, 1641005640000],
    // [113, 1641005700000],
    [89, 1641005760000],
    // [118, 1641005820000],
    [126, 1641005880000],
    // [61, 1641005940000],
    [103, 1641006000000],
    // [61, 1641006060000],
    [82, 1641006120000],
    // [89, 1641006180000],
    [79, 1641006240000],
    // [72, 1641006300000],
    [70, 1641006360000],
    // [120, 1641006420000],
    [55, 1641006480000],
    // [66, 1641006540000],
    [106, 1641006600000],
    // [86, 1641006660000],
    [98, 1641006720000],
    // [92, 1641006780000],
    [79, 1641006840000],
    // [59, 1641006900000],
    [126, 1641006960000],
    // [87, 1641007020000],
    [106, 1641007080000],
    // [118, 1641007140000],
    [94, 1641007200000],
    // [126, 1641007260000],
    [125, 1641007320000],
    // [109, 1641007380000],
    [110, 1641007440000],
    // [74, 1641007500000],
    [63, 1641007560000],
    // [101, 1641007620000],
    [71, 1641007680000],
    // [123, 1641007740000],
    [102, 1641007800000],
    // [50, 1641007860000],
    [63, 1641007920000],
    // [130, 1641007980000],
    [71, 1641008040000],
    // [107, 1641008100000],
    [119, 1641008160000],
    // [111, 1641008220000],
    [61, 1641008280000],
    // [59, 1641008340000],
    [125, 1641008400000],
    // [112, 1641008460000],
    [129, 1641008520000],
    // [58, 1641008580000],
    [124, 1641008640000],
    // [80, 1641008700000],
    [126, 1641008760000],
    // [98, 1641008820000],
    [88, 1641008880000],
    // [83, 1641008940000],
    [57, 1641009000000],
    // [109, 1641009060000],
    [61, 1641009120000],
    // [113, 1641009180000],
    [79, 1641009240000],
    // [52, 1641009300000],
    [93, 1641009360000],
    // [97, 1641009420000],
    [123, 1641009480000],
    // [53, 1641009540000],
    [88, 1641009600000],
    // [110, 1641009660000],
    [78, 1641009720000],
    // [124, 1641009780000],
    [116, 1641009840000],
    // [100, 1641009900000],
    [128, 1641009960000],
    // [64, 1641010020000],
    [95, 1641010080000],
    // [98, 1641010140000],
    [119, 1641010200000],
    // [118, 1641010260000],
    [111, 1641010320000],
    // [51, 1641010380000],
    [50, 1641010440000],
    // [96, 1641010500000],
    [52, 1641010560000],
    // [98, 1641010620000],
    [110, 1641010680000],
    // [56, 1641010740000],
    [125, 1641010800000],
    // [60, 1641010860000],
    [50, 1641010920000],
    // [101, 1641010980000],
    [83, 1641011040000],
    // [117, 1641011100000],
    [125, 1641011160000],
    // [112, 1641011220000],
    [120, 1641011280000],
    // [127, 1641011340000],
    [105, 1641011400000],
    // [58, 1641011460000],
    [55, 1641011520000],
    // [77, 1641011580000],
    [97, 1641011640000],
    // [53, 1641011700000],
    [82, 1641011760000],
    // [98, 1641011820000],
    [127, 1641011880000],
    // [67, 1641011940000],
    [118, 1641012000000],
    // [100, 1641012060000],
    [95, 1641012120000],
    // [84, 1641012180000],
    [59, 1641012240000],
    // [123, 1641012300000],
    [114, 1641012360000],
    // [118, 1641012420000],
    [71, 1641012480000],
    // [80, 1641012540000],
    [78, 1641012600000],
    // [79, 1641012660000],
    [54, 1641012720000],
    // [93, 1641012780000],
    [74, 1641012840000],
    // [61, 1641012900000],
    [67, 1641012960000],
    // [119, 1641013020000],
    [54, 1641013080000],
    // [123, 1641013140000],
]

/**
 * Data of 7 days with 1 day interval.
 */
export const FAKE_WEEK_DATA = [
    [33, 1640995200000],
    [34, 1641081600000],
    [41, 1641168000000],
    [38, 1641254400000],
    [45, 1641340800000],
    [62, 1641427200000],
    [42, 1641513600000],
]
/**
 * Data of 30 days with 1 day interval.
 */
export const FAKE_MONTH_DATA = [
    [22, 1640995200000],
    [11, 1641081600000],
    [33, 1641168000000],
    [45, 1641254400000],
    [22, 1641340800000],
    [35, 1641427200000],
    [64, 1641513600000],
    [23, 1641600000000],
    [54, 1641686400000],
    [44, 1641772800000],
    [63, 1641859200000],
    [78, 1641945600000],
    [13, 1642032000000],
    [28, 1642118400000],
    [29, 1642204800000],
    [55, 1642291200000],
    [66, 1642377600000],
    [44, 1642464000000],
    [43, 1642550400000],
    [48, 1642636800000],
    [41, 1642723200000],
    [38, 1642809600000],
    [39, 1642896000000],
    [31, 1642982400000],
    [28, 1643068800000],
    [58, 1643155200000],
    [60, 1643241600000],
    [65, 1643328000000],
    [62, 1643414400000],
    [58, 1643500800000],
    [78, 1643628944000],
]

/**
 * Data of 1 year with 1 month interval.
 */
export const FAKE_YEAR_DATA = [
    [33, 1640995200000],
    [34, 1643673600000],
    [41, 1646092800000],
    [38, 1648771200000],
    [45, 1651363200000],
    [62, 1654041600000],
    [42, 1656633600000],
    [32, 1659312000000],
    [66, 1661990400000],
    [37, 1664582400000],
    [24, 1667260800000],
    [78, 1669852800000],
]

/**
 * Function that return MOCK Metrics Data, for all targets given and timestamp list given, instead of repeating ourselves creating hard coded FAKE DATA LIST for each targets, through timestampList which will be dynamic according to the range of the request, mock metrics will always work no matter the date of using the mock.
 *
 * @param targets Targets of the request.
 * @param timeStampList TimeStampList used for all targets, it'll be generated outside according to the range and period of the request.
 * @returns Metrics response.
 */
function getMetrics(targets: metricTargetType[], timeStampList: number[]) {
    const chance = new Chance()
    return targets.map((target) => {
        let datapoints = timeStampList.map((timestamp) => {
            switch (target) {
                case metricTargetsEnum.internalTemperature:
                    // Generate a random internal temperature value, it can be between 22 - 30 with 90% chance, or 10% chance to be null
                    // Typing as Array<number>, because datapoints is considered as number[][], and with chance we can have null value, thus typescript will say number[] is not compatible with (number|null)[], thus this will stop typescript shouting, and this won't create any problem in the application if there are null values in metrics datapoints, just typescript shouting.
                    return [
                        chance.weighted([chance.integer({ min: 22, max: 30 }), null], [0.9, 0.1]),
                        timestamp,
                    ] as Array<number>
                case metricTargetsEnum.externalTemperature:
                    // Generate a random external temperature value, it can be between 14 - 21 with 90% chance, or 10% chance to be null
                    // Typing as Array<number>, because datapoints is considered as number[][], and with chance we can have null value, thus typescript will say number[] is not compatible with (number|null)[], thus this will stop typescript shouting, and this won't create any problem in the application if there are null values in metrics datapoints, just typescript shouting.
                    return [
                        chance.weighted([chance.integer({ min: 14, max: 21 }), null], [0.9, 0.1]),
                        timestamp,
                    ] as Array<number>
                case metricTargetsEnum.pMax:
                    // Generate a random pMax value, it can be between 4000 - 5000 with 90% chance, or 10% chance to be null
                    // Typing as Array<number>, because datapoints is considered as number[][], and with chance we can have null value, thus typescript will say number[] is not compatible with (number|null)[], thus this will stop typescript shouting, and this won't create any problem in the application if there are null values in metrics datapoints, just typescript shouting.
                    return [
                        chance.weighted([chance.integer({ min: 4000, max: 5000 }), null], [0.9, 0.1]),
                        timestamp,
                    ] as Array<number>
                case metricTargetsEnum.consumption:
                    // Generate a random consumption value, it can be between 1000 - 9000  with 90% chance, or 10% chance to be null
                    // Typing as Array<number>, because datapoints is considered as number[][], and with chance we can have null value, thus typescript will say number[] is not compatible with (number|null)[], thus this will stop typescript shouting, and this won't create any problem in the application if there are null values in metrics datapoints, just typescript shouting.
                    return [
                        chance.weighted([chance.integer({ min: 1000, max: 9000 }), null], [0.9, 0.1]),
                        timestamp,
                    ] as Array<number>
                default:
                    // Generate a random value what's left in target, it can be between 30 - 120 with 90% chance, or 10% chance to be null
                    // Typing as Array<number>, because datapoints is considered as number[][], and with chance we can have null value, thus typescript will say number[] is not compatible with (number|null)[], thus this will stop typescript shouting, and this won't create any problem in the application if there are null values in metrics datapoints, just typescript shouting.
                    return [
                        chance.weighted([chance.integer({ min: 30, max: 120 }), null], [0.9, 0.1]),
                        timestamp,
                    ] as Array<number>
            }
        })
        return {
            target,
            datapoints,
        }
    })
}

/**
 * Mock metrics response for a daily consumption, it'll generate timestampList dynamically according to the range and daily period so that we have dynamic metricDatapoints for the given range.
 *
 * @param targets Targets of the request.
 * @param range Range given, this can be the range of the request, to generate timeseries of the given range.
 * @returns Mock Metrics Data for a daily consumption.
 */
export const TEST_SUCCESS_DAY_METRICS: (
    targets: metricTargetType[],
    range?: metricRangeType,
    // eslint-disable-next-line jsdoc/require-jsdoc
) => SnakeCasedPropertiesDeep<IMetric[]> = (targets: metricTargetType[], range) =>
    getMetrics(targets, generateXAxisValues('daily', range || getRange('daily')))

/**
 * Mock metrics response for a weekly consumption, it'll generate timestampList dynamically according to the range and weekly period so that we have dynamic metricDatapoints for the given range.
 *
 * @param targets Targets of the request.
 * @param range Range given, this can be the range of the request, to generate timeseries of the given range.
 * @returns Mock Metrics Data for a weekly consumption.
 */
export const TEST_SUCCESS_WEEK_METRICS: (
    targets: metricTargetType[],
    range?: metricRangeType,
    // eslint-disable-next-line jsdoc/require-jsdoc
) => SnakeCasedPropertiesDeep<IMetric[]> = (targets: metricTargetType[], range) =>
    getMetrics(targets, generateXAxisValues('weekly', range || getRange('weekly')))

/**
 * Mock metrics response for a monthly consumption, it'll generate timestampList dynamically according to the range and monthly period so that we have dynamic metricDatapoints for the given range.
 *
 * @param targets Targets of the request.
 * @param range Range given, this can be the range of the request, to generate timeseries of the given range.
 * @returns Mock Metrics Data for a monthly consumption.
 */
export const TEST_SUCCESS_MONTH_METRICS: (
    targets: metricTargetType[],
    range?: metricRangeType,
    // eslint-disable-next-line jsdoc/require-jsdoc
) => SnakeCasedPropertiesDeep<IMetric[]> = (targets: metricTargetType[], range) =>
    getMetrics(targets, generateXAxisValues('monthly', range || getRange('monthly')))

/**
 * Mock metrics response for a yearly consumption, it'll generate timestampList dynamically according to the range and yearly period so that we have dynamic metricDatapoints for the given range.
 *
 * @param targets Targets of the request.
 * @param range Range given, this can be the range of the request, to generate timeseries of the given range.
 * @returns Mock Metrics Data for a yearly consumption.
 */
export const TEST_SUCCESS_YEAR_METRICS: (
    targets: metricTargetType[],
    range?: metricRangeType,
    // eslint-disable-next-line jsdoc/require-jsdoc
) => SnakeCasedPropertiesDeep<IMetric[]> = (targets: metricTargetType[], range) =>
    getMetrics(targets, generateXAxisValues('yearly', range || getRange('yearly')))

// eslint-disable-next-line jsdoc/require-jsdoc
export const metricsEndpoints = [
    // Get meters metrics endpoint
    rest.post<getMetricType>(`${METRICS_API}`, (req, res, ctx) => {
        const fromInMilliseconds = dayjs(
            new Date(dayjs(new Date(req.body.range.from)).startOf('day').toDate()).getTime(),
        )
        const toInMilliseconds = dayjs(new Date(dayjs(new Date(req.body.range.to)).startOf('day').toDate()).getTime())
        // Difference will be the number of day starting date is from, end date is to, and ending date is counted in the period. so for a week we need a difference of 6.
        const difference = toInMilliseconds.diff(fromInMilliseconds, 'day')
        const targets: metricTargetType[] = req.body.targets ? req.body.targets.map((target) => target.target) : []
        const range = req.body.range

        // Difference can be 0 when checking the consumption at start of 00:00 to the same day 23:59.
        if (difference === 1 || difference === 0)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_DAY_METRICS(targets, range)))
        if (difference === 6)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_WEEK_METRICS(targets, range)))
        if (difference === 30 || difference === 31)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_MONTH_METRICS(targets, range)))
        if (difference === 365 || difference === 366)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_YEAR_METRICS(targets, range)))
        return res(ctx.status(400), ctx.delay(1000), ctx.json(TEST_SUCCESS_MONTH_METRICS))
    }),
]
