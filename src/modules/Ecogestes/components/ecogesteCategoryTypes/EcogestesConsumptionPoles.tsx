import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategories } from 'src/modules/Ecogestes/components/ecogesteCategories'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'

/**
 * This component will handle the logic part for Ecogestes Consumption Poles.
 *
 * @returns JSX.Element - all Ecogestes that belong to Consumption Poles.
 */
export const EcogestesConsumptionPoles = () => {
    const { elementList, loadingInProgress } = useEcogestesCategories(IEcogesteCategoryTypes.CONSUMPTION)

    return (
        <EcogesteCategories
            aria-label="ecogestsConsumptions"
            categoryType={IEcogesteCategoryTypes.CONSUMPTION}
            loadingInProgress={loadingInProgress}
            categories={elementList}
        />
    )
}
