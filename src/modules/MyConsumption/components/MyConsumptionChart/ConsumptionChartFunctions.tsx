import { isSameDay } from 'date-fns'
import { FormattedMessage } from 'src/common/react-platform-translation'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { metricRangeType } from 'src/modules/Metrics/Metrics'
import { equipmentType, installationInfosType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

/**
 * Check the presence of value in the given datapoints of metrics on each time point.
 *
 * @param datapointsOfMetrics - An array of arrays representing the datapoints for each metric at each time point.
 * @returns An array of tuples, where the first element is a boolean indicating whether the value is null,
 *          and the second element is the corresponding time point.
 * @example
 * when the input is
 * [
 *      [[null, 1709856000000], [null, 1709856060000], [null, 1709856120000], [4, 1709856180000]],
 *      [[5, 1709856000000],    [null, 1709856060000], [null, 1709856120000], [8, 1709856180000]],
 *      [[9, 1709856000000],    [null, 1709856060000], [null, 1709856120000], [null, 1709856180000]],
 * ]
 *
 * the output should be
 * [[true, 1709856000000], [false, 1709856060000], [false, 1709856120000], [true, 1709856180000]]
 */
export const checkMissingDataList = (datapointsOfMetrics: number[][][]): [boolean, number][] => {
    // If the input array is empty, return an empty array
    if (!datapointsOfMetrics.length) return []
    // Map all the time points and return an array of tuples indicating whether a value is null for each time point
    return datapointsOfMetrics[0].map(([_value, time], index) => {
        // Map all the metrics at the current time point.
        for (const datapointsOfMetric of datapointsOfMetrics) {
            // If the value is not null, return true and the time point
            if (datapointsOfMetric[index][0] !== null) return [true, time]
        }
        // If the value is null, return false and the time point
        return [false, time]
    })
}

/**
 * Calculates the maximum time between successive missing values in the given datapoints of metrics.
 *
 * @param datapointsOfMetrics - The datapoints of metrics to analyze.
 * @returns The maximum time between successive missing values in minutes.
 */
export const getMaxTimeBetweenSuccessiveMissingValue = (datapointsOfMetrics: number[][][]): number => {
    // suppose that the max time between successive null value is 0
    let maxTimeBetweenSuccessiveNullValue = 0
    // check if the metrics have missing data int time points.
    const datapointsOfMetricsPresenceStatus = checkMissingDataList(datapointsOfMetrics)
    // calculate the time between successive null value
    const deltaTime = datapointsOfMetricsPresenceStatus[1][1] - datapointsOfMetricsPresenceStatus[0][1]
    let timeBetweenSuccessiveNullValue = 0
    // iterate over the data to find the max time between successive null value
    for (const [value] of datapointsOfMetricsPresenceStatus) {
        // if the value is false, increment the time between successive null value
        if (value === false) {
            timeBetweenSuccessiveNullValue += deltaTime
            if (timeBetweenSuccessiveNullValue > maxTimeBetweenSuccessiveNullValue) {
                maxTimeBetweenSuccessiveNullValue = timeBetweenSuccessiveNullValue
            }
            // if the value is true, reset the time between successive null value
        } else if (timeBetweenSuccessiveNullValue !== 0) {
            timeBetweenSuccessiveNullValue = 0
        }
    }
    // return the max time between successive null value in minutes
    return maxTimeBetweenSuccessiveNullValue / 1000 / 60
}

/**
 * Retrieves the message for successive missing data of the current day by gap interval.
 *
 * @param consumptionChartData - The consumption chart data.
 * @param range - The metric range.
 * @param minTimeBetweenSuccessiveMissingValues - The minimum time between successive missing values.
 * @returns The message for successive missing data of the current day.
 */
export const getMessageOfSuccessiveMissingDataOfCurrentDayByGapInterval = (
    consumptionChartData: IMetric[],
    range: metricRangeType,
    minTimeBetweenSuccessiveMissingValues: number,
) => {
    const currentTime = Date.now()

    // in current day view we need to check if the data is available for the last 5 minutes.
    if (isSameDay(new Date(range.from), new Date())) {
        const minTimeBetweenSuccessiveMissingValuesInTimestamp = minTimeBetweenSuccessiveMissingValues * 60 * 1000
        // get datapoints between [currentTime - minTimeBetweenSuccessiveMissingValuesInTimestamp, currentTime]
        const datapointsOfMetricsOfLastTime = consumptionChartData.map(({ datapoints }) =>
            datapoints.filter(
                ([_value, time]) =>
                    time >= currentTime - minTimeBetweenSuccessiveMissingValuesInTimestamp && time <= currentTime,
            ),
        )
        let time = 0
        // if data count is 1 that means there is one value > minTimeBetweenSuccessiveMissingValues
        if (datapointsOfMetricsOfLastTime[0].length === 1) {
            const datapointsOfMetricsPresenceStatus = checkMissingDataList(datapointsOfMetricsOfLastTime)
            if (!datapointsOfMetricsPresenceStatus[0][0]) {
                time = minTimeBetweenSuccessiveMissingValues
            }
            // if data count more than one must get the max time between successive missing value
        } else if (datapointsOfMetricsOfLastTime[0].length > 1) {
            time = getMaxTimeBetweenSuccessiveMissingValue(datapointsOfMetricsOfLastTime)
        }
        if (time >= minTimeBetweenSuccessiveMissingValues) {
            return (
                <FormattedMessage
                    id="Oups ! Une partie de vos données sur la journée n’est pas disponible.{break} La connexion avec votre nrLINK semble rompue, vérifiez sur son écran qu’il est bien connecté au wifi et à l’ERL, si besoin n’hésitez pas à le redémarrer, puis patientez quelques minutes."
                    defaultMessage="Oups ! Une partie de vos données sur la journée n’est pas disponible.{break} La connexion avec votre nrLINK semble rompue, vérifiez sur son écran qu’il est bien connecté au wifi et à l’ERL, si besoin n’hésitez pas à le redémarrer, puis patientez quelques minutes."
                    values={{ break: <br /> }}
                />
            )
        }
    }
    // else we need to check if the data is available for the whole day.
    const datapointsOfMetrics = consumptionChartData.map(({ datapoints }) =>
        datapoints.filter(([_value, time]) => time <= currentTime),
    )
    const time = getMaxTimeBetweenSuccessiveMissingValue(datapointsOfMetrics)

    if (time >= minTimeBetweenSuccessiveMissingValues)
        return (
            <FormattedMessage
                id="Oups ! Une partie de vos données sur la journée n’est pas disponible.{break} La connexion avec votre nrLINK semble avoir été rompue pendant quelques minutes."
                defaultMessage="Oups ! Une partie de vos données sur la journée n’est pas disponible.{break} La connexion avec votre nrLINK semble avoir été rompue pendant quelques minutes."
                values={{ break: <br /> }}
            />
        )
    return null
}

/**
 * Returns the message for successive missing data of the current day.
 *
 * @param consumptionChartData - The consumption chart data.
 * @param period - The period enum.
 * @param range - The metric range type.
 * @returns The message for successive missing data of the current day.
 */
export const getMessageOfSuccessiveMissingDataOfCurrentDay = (
    consumptionChartData: IMetric[],
    period: PeriodEnum,
    range: metricRangeType,
) => {
    // check if we have data and the view is daily and the data is more than 31 points because we need to avoid the using the data of other periods when the component fast rendering.
    const isDailyData =
        consumptionChartData.length && period === PeriodEnum.DAILY && consumptionChartData[0].datapoints.length > 31
    if (isDailyData) {
        // We check if we are on autoconsmption / production view like this to avoid the using the data of other view when the component fast rendering case.
        const isAutoconsmptionProductionView = consumptionChartData.find(
            (item) => item.target === metricTargetsEnum.autoconsumption,
        )
        if (isAutoconsmptionProductionView) {
            consumptionChartData = consumptionChartData.filter((item) => item.target === metricTargetsEnum.consumption)
        }

        // In My consumption we use 5min and in Autoconsumption / production view we use 30min
        const minTimeBetweenSuccessiveMissingValues = isAutoconsmptionProductionView ? 30 : 5

        return getMessageOfSuccessiveMissingDataOfCurrentDayByGapInterval(
            consumptionChartData,
            range,
            minTimeBetweenSuccessiveMissingValues,
        )
    }
    return null
}

/**
 * Function to check whether the resale price form should be shown or not.
 *
 * @param consumptionToggleButton The current consumption button value.
 * @param equipmentsList The list of equipments.
 * @param installationInfos The installation infos.
 * @returns Boolean indicating whether the resale price form should be shown or not.
 */
export const checkWhetherResalePriceFormShouldBeShown = (
    consumptionToggleButton: SwitchConsumptionButtonTypeEnum,
    equipmentsList: equipmentType[] | null,
    installationInfos: installationInfosType | null,
): boolean => {
    if (
        consumptionToggleButton !== SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction ||
        !equipmentsList ||
        !installationInfos
    )
        return false
    const solarPanelEquipment = equipmentsList.find((equipment) => equipment.name === 'solarpanel')
    // Check if the housing has a solar panel
    const hasSolarPanel = installationInfos.housingEquipments.some(
        (equipment) => equipment.equipmentId === solarPanelEquipment?.id && equipment.equipmentType === 'existant',
    )
    if (!hasSolarPanel) return false
    // Check if the housing has a resale contract
    const hasResaleContract = installationInfos.solarInstallation?.hasResaleContract
    if (!hasResaleContract) return false
    // Check if the resale tariff is not yet specified
    return (
        installationInfos.solarInstallation?.resaleTariff === null ||
        installationInfos.solarInstallation?.resaleTariff === undefined
    )
}
