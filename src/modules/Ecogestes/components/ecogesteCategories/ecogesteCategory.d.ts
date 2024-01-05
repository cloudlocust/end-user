import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'

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
        /**
         * Indicates whether to show just visualised ecogests.
         */
        showJustVisualisedEcogests?: boolean
    }

/**
 * EcogesteCategoriesList props.
 */
export interface EcogesteCategoriesListProps {
    /**
     * Ecogest Categories.
     */
    categories: IEcogestCategory[] | null
    /**
     * The type of Ecogest Category we're using now.
     */
    categoryType: IEcogesteCategoryTypes
    /**
     * EcogesteCategoriesList loading state.
     */
    loadingInProgress: boolean
    /**
     * Indicates whether to show just visualised ecogests.
     */
    showJustVisualisedEcogests?: boolean
}
