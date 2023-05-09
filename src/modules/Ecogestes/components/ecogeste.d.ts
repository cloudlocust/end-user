/**
 * Model for an Ecogeste.
 * Still a bit subject to change.
 */
export type IEcogeste =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * Database-like id of the ecogest.
         * Used to poke REST endpoints, like when we want to update
         * the view status.
         */
        id: number

        /**
         * The title of the Ecogeste.
         */
        title: string
        /**
         * The description of the Ecogeste.
         * This is a long description that explains the ins and out of
         * the ecogeste.
         */
        description: string
        /**
         * The Extended description of the ecogest that is shown
         * upon clicking on the info button.
         */
        infos: string
        /**
         * The savings of the Ecogeste.
         * Abstract string that describes the savings of the Ecogeste.
         * Usually formatted as '20%' but can be anything.
         */
        percentageSaved: string
        /**
         * Url of an icon that might be display on an ecogest card.
         */
        urlIcon?: string
        /**
         * Wheter or not the currently active customer has seen this Ecogeste.
         */
        seenByCustomer: boolean
    }

/**
 * Enum for all the viewed states handled by Ecogestes get API.
 */
export enum EcogestViewedEnum {
    /**
     * Get all Ecogests, regardless of whether they have been seen or not.
     */
    ALL = undefined,
    /**
     *
     * Get only the Ecogests the the current customer has already read/seen.
     */
    READ = true,
    /**
     * Get only the Ecogests the the current customer has not already read/seen.
     */
    UNREAD = false,
}

/**
 * Filter object representing all the possible filtering states
 * for the Ecogest GET API.
 */
export type IEcogestGetAllFilter =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * Wheter the Ecogest should be filter based on if the
         * customer has seen the Ecogest.
         */
        viewed?: EcogestViewedEnum
        /**
         * If present, will return all ecogest that have this tagId.
         */
        tag_id?: number
    }

/**
 * Model representing a Category of Ecogest
 * Example: Rooms is a Category, Consumptions Pool is another Category.
 */
export type IEcogestCategory =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * Unique ID for this category. Used to poke REST endpoints or in filtering requests.
         */
        id: number
        /**
         * The title of the Ecogest Category.
         */
        name: string
        /**
         * The icon of the Ecogest Category.
         */
        icon: string
        /**
         * The amount of ecogest that belong to this Category.
         */
        nbEcogeste: number
    }

/**
 * EcogestPage Props for Components (Header / Content).
 */
export type IEcogestPageComponentProps =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * Current EcogesteCategory used.
         */
        currentCategory: IEcogestCategory | null | undefined
        /**
         * Current List of Ecogeste Category.
         */
        elementList?: IEcogestCategory[] | null | undefined
    }

/**
 * Props @interface extends EcogestPageProps.
 */
export interface IEcogestHeaderProps extends IEcogestPageComponentProps {
    /**
     * Loading state of @useEcogestPoles Hooks.
     */
    isLoading: boolean
}

/**
 * Props to pass to EcogestList.
 * This is not a mandatory cause, as default these props will use IEcogesteCategoryTypes.CONSUMPTION.
 * This will be usefull when we will start Rooms tickets.
 */
export type IEcogesteListPageProps =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * Type of the current Category.
         * Default: CONSUMPTION (poles de consommation).
         */
        categoryType?: IEcogesteCategoryTypes
    }
