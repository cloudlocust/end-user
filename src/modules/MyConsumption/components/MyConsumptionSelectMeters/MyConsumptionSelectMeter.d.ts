/**
 * Interface IMyConsumptionSelectMeters.
 */
interface IMyConsumptionSelectMeters {
    /**
     * List of meters.
     */
    metersList: IMeter[]
    /**
     * SetFilters function.
     */
    setFilters: (value: metricFilters) => void
}
