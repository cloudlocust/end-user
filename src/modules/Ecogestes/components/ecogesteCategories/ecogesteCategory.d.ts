import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'

/**
 * EcogesteCategoryCard Component Props.
 */
export type IEcogesteCategoryCardProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Type of the current Category.
         * Default: CONSUMPTION (poles de consommation).
         */
        categoryType: IEcogesteCategoryTypes

        /**
         * Current Category of Ecogeste we're displaying.
         */
        ecogestCategory: IEcogestCategory
    }
