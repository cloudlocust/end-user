/**
 * Represents the solar sizing information.
 */
export interface ISolarSizing {
    /**
     * Solar sizing id.
     */
    id: number
    /**
     * Surface measured in m2.
     */
    surface: number
    /**
     * Orientation measured in degrees.
     */
    orientation: number
    /**
     * Inclination measured in degrees.
     */
    inclination: number
    /**
     * Panel Powxer measured in Wc.
     */
    panelPower: number
    /**
     * Panel Efficiency measured in %.
     */
    panelEfficiency: number
    /**
     * Panel Area measured in m2.
     */
    panelArea: number
    /**
     * Panel Width measured in m.
     */
    panelWdth: number
    /***
     * Measured in Euro (€).
     */
    panelPrice: number
}

/**
 * Represents the solar sizing information without the panelPower, panelEfficiency, panelArea, panelWdth, and panelPrice.
 */
export type AddSolarSizing = Exclude<
    ISolarSizing,
    'panelPower' | 'panelEfficiency' | 'panelArea' | 'panelWdth' | 'panelPrice'
>

/**
 * Represents the housing solar sizing.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type HousingSolarSizing = {
    /**
     * Solar sizing ids.
     */
    solarSizing: ISolarSizing[]
    /**
     * Annual production measured in kWh.
     */
    annualProduction: number
    /**
     * Auto consumption percentage measured in %.
     */
    autoConsumptionPercentage: number
    /**
     * Auto production percentage measured in %.
     */
    autoProductionPercentage: number
    /**
     * Consumption start at.
     */
    consumptionStartAt: Date | string
    /**
     * Consumption end at.
     */
    consumptionEndAt: Date | string
    /**
     * Kilowatt crête.
     */
    nominalPower: number
}
