/**
 * Label card data.
 */
export interface LabelCardDataType {
    /**
     * The label id.
     */
    labelId: number
    /**
     * The label equipment name.
     */
    equipmentName: string
    /**
     * The day of the label.
     */
    day: string
    /**
     * The start time of the label time range.
     */
    startTime: string
    /**
     * The end time of the label time range.
     */
    endTime: string
    /**
     * Total consumption in the label time range (in Wh).
     */
    consumption: number
    /**
     * Price of the total consumption.
     */
    consumptionPrice: number
    /**
     * The type of use for the equipment.
     */
    useType?: string | null
}

/**
 * Props of the ConsumptionLabelCard component.
 */
export interface ConsumptionLabelCardProps {
    /**
     * Label card data.
     */
    labelData: LabelCardDataType
    /**
     * Function to delete the label.
     */
    deleteLabel: (activityId: number) => Promise<void>
}
