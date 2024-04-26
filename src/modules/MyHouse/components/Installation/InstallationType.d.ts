/**
 * The value of the equipments.
 */
export type equipmentNameType =
    | 'heater'
    | 'sanitary'
    | 'hotplate'
    | 'tv'
    | 'vacuum'
    | 'oven'
    | 'microwave'
    | 'fridge'
    | 'dishwasher'
    | 'washingmachine'
    | 'dryer'
    | 'laptop'
    | 'desktopcomputer'
    | 'solarpanel'
    | 'freezer'
    | 'kettle'
    | 'coffee_machine'
    | 'swimmingpool'
    | 'heatpump'
    | 'reversible_heatpump'
    | 'swimmingpool_heatpump'
    | 'electric_car'
    | 'aquarium'
    | 'ceramic_hob'
    | 'iron_plate'
    | 'induction_plate'
    | 'radiator'
    | 'air_conditioner'
    | 'dry_towel'
    | 'water_heater'

// eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentAllowedTypeT =
    | 'induction'
    | 'electricity'
    | 'other'
    | 'vitroceramic'
    | 'existant'
    | 'nonexistant'
    | 'possibly'
    | 'collective'
    | 'individual'

// eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentMeterType = {
    /**
     * Id of Equipment.
     */
    equipmentId: number
    /**
     * The housing equipment id.
     */
    id?: number
    /**
     * Number value of the equipment.
     */
    equipmentNumber?: number
    /**
     * Type value of the Equipment.
     */
    equipmentType?: equipmentAllowedTypeT
}

// eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentType = {
    /**
     * Id of Equipment.
     */
    id: number
    /**
     * Name of the equipment.
     */
    name: equipmentNameType | string
    /**
     * Type of the Equipment.
     */
    allowedType: equipmentAllowedTypeT[]
    /**
     * Customer id related to the equipment.
     */
    customerId?: number | null
    /**
     * Measurement duration for the Equipment.
     */
    measurementDuration?: string | null
    /**
     * Measurement modes for the Equipment.
     */
    measurementModes?: string[] | null
}

/**
 * Equipment Meter model.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IEquipmentMeter = equipmentMeterType & {
    /**
     * Indicate information about the equipments.
     */
    equipment: equipmentType
}

/**
 * Information to be passed when .
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type postEquipmentInputType = equipmentMeterType[]

//eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentValuesType = { [key in equipmentNameType]: number | string }

/**
 * Add equipment type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type addEquipmentType = {
    /**
     * Equipment id.
     */
    id?: number
    /**
     * Equipment name.
     */
    name?: string
    /**
     * Allowed type for the equipment.
     */
    allowedType?: ['electricity']
}

/**
 * Solar installation informations type.
 */
export interface solarInstallationInfosType {
    /**
     * The title of the installation.
     */
    title?: string
    /**
     * The date of the installation.
     */
    installationDate?: string
    /**
     * The type of the solar panel.
     */
    solarPanelType?: string
    /**
     * The orientation value for the solar panel.
     */
    orientation?: number
    /**
     * The brand of the solar panel.
     */
    solarPanelBrand?: string
    /**
     * The brand of the inverter.
     */
    inverterBrand?: string
    /**
     * The inclination value for the solar panel.
     */
    inclination?: number
    /**
     * The power value for the solar panel.
     */
    power?: number
    /**
     * Boolean indicating if the customer has a resale contract.
     */
    hasResaleContract?: boolean
    /**
     * The resale tariff value.
     */
    resaleTariff?: number
    /**
     * The status of the consumer when wanting a solar panel.
     */
    statusWhenWantingSolarPanel?: string
}

/**
 * Installation informations type.
 */
export interface installationInfosType {
    /**
     * The list of housing equipments.
     */
    housingEquipments: equipmentMeterType[]
    /**
     * The solar installation informations.
     */
    solarInstallation?: solarInstallationInfosType
}

/**
 * Solar installation informations type.
 */
export interface installationFormFieldsType {
    /**
     * The heater status.
     */
    heater?: string
    /**
     * The hotplate status.
     */
    hotplate?: string
    /**
     * The sanitary status.
     */
    sanitary?: string
    /**
     * The solarpanel status.
     */
    solarpanel?: string
    /**
     * The title of the installation.
     */
    title?: string
    /**
     * The date of the installation.
     */
    installationDate?: string
    /**
     * The type of the solar panel.
     */
    solarPanelType?: string
    /**
     * The custom value for the solar panel type.
     */
    otherSolarPanelType?: string
    /**
     * The orientation value for the solar panel.
     */
    orientation?: number
    /**
     * The brand of the solar panel.
     */
    solarPanelBrand?: string
    /**
     * The brand of the inverter.
     */
    inverterBrand?: string
    /**
     * The inclination value for the solar panel.
     */
    inclination?: number
    /**
     * The power value for the solar panel.
     */
    power?: number
    /**
     * Boolean indicating if the customer has a resale contract.
     */
    hasResaleContract?: boolean
    /**
     * The resale tariff value.
     */
    resaleTariff?: number
    /**
     * The status of the consumer when wanting a solar panel.
     */
    statusWhenWantingSolarPanel?: string
}
