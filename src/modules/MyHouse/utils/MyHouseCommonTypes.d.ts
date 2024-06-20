import { IconComponentType } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'

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

/**
 * Select field type.
 */
export type SelectForm =
    /**
     *
     */
    {
        /**
         * Label Of the Select must indexed by <FormattedMessage /> or by using formatMessage.
         */
        name: string
        /**
         * Initial value.
         */
        titleLabel: JSX.Element
        /**
         * List options of the select.
         */
        formOptions: SelectOption[]
    }
