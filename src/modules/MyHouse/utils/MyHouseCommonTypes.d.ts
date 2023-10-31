/**
 * Scope types Enum.
 */
export enum ScopesTypesEnum {
    /**
     * Production.
     */
    PRODUCTION = 'production',
}

/**
 * Scopes Types.
 */
export interface ScopesAccessRightsType {
    /**
     * Scopes access rights.
     */
    scopes: ScopesTypesEnum[]
}

/**
 * Equipment options type.
 */
export interface EquipmentOptionsType {
    /**
     * Name.
     */
    name: string
    /**
     * Label Title.
     */
    labelTitle: string
    /**
     * IconComponent.
     */
    iconComponent: IconComponentType
    /**
     * Disable Decrement.
     */
    disableDecrement: boolean
}
