import { metricHistoryTargetsEnum, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

/**
 * Object that map every target to its history target version.
 */
export const targetHistoryMapping: Partial<Record<metricTargetsEnum, metricHistoryTargetsEnum>> = {
    [metricTargetsEnum.consumption]: metricHistoryTargetsEnum.consumptionHistory,
    [metricTargetsEnum.eurosConsumption]: metricHistoryTargetsEnum.eurosConsumptionHistory,
    [metricTargetsEnum.idleConsumption]: metricHistoryTargetsEnum.idleConsumptionHistory,
    [metricTargetsEnum.consumptionByTariffComponent]: metricHistoryTargetsEnum.consumptionHistoryByTariffComponent,
    [metricTargetsEnum.euroConsumptionByTariffComponent]:
        metricHistoryTargetsEnum.euroConsumptionHistoryByTariffComponent,
}

/**
 * Object that map every history target to its original target.
 */
export const reverseTargetHistoryMapping: Record<metricHistoryTargetsEnum, metricTargetsEnum> = {
    [metricHistoryTargetsEnum.consumptionHistory]: metricTargetsEnum.consumption,
    [metricHistoryTargetsEnum.eurosConsumptionHistory]: metricTargetsEnum.eurosConsumption,
    [metricHistoryTargetsEnum.idleConsumptionHistory]: metricTargetsEnum.idleConsumption,
    [metricHistoryTargetsEnum.consumptionHistoryByTariffComponent]: metricTargetsEnum.consumptionByTariffComponent,
    [metricHistoryTargetsEnum.euroConsumptionHistoryByTariffComponent]:
        metricTargetsEnum.euroConsumptionByTariffComponent,
}
