import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategoriesList } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoriesList'
import { EcogestesConsumptionPolesProps } from 'src/modules/Ecogestes/components/ecogesteCategoryTypes/ecogesteCategoryTypes'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'

/**
 * This component will handle the logic part for Ecogestes Consumption Poles.
 *
 * @param root0 N/A.
 * @param root0.showJustVisualisedEcogests Indicates whether to show just visualised ecogests.
 * @returns JSX.Element - all Ecogestes that belong to Consumption Poles.
 */
export const EcogestesConsumptionPoles = ({ showJustVisualisedEcogests }: EcogestesConsumptionPolesProps) => {
    const { elementList, loadingInProgress } = useEcogestesCategories(
        IEcogesteCategoryTypes.CONSUMPTION,
        showJustVisualisedEcogests,
    )

    return (
        <EcogesteCategoriesList
            aria-label="ecogestsConsumptions"
            categoryType={IEcogesteCategoryTypes.CONSUMPTION}
            loadingInProgress={loadingInProgress}
            categories={elementList}
            showJustVisualisedEcogests={showJustVisualisedEcogests}
        />
    )
}
