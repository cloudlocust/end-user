import { EcogesteCategoryCard } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoryCard'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'
import { EcogesteCategoriesListProps } from 'src/modules/Ecogestes/components/ecogesteCategories/ecogesteCategory'

/**
 * Display the List of Ecogestes that belong to categoryType.
 *
 * @param _elementList Props.
 * @param _elementList.categories List containing all Ecogestes Category.
 * @param _elementList.categoryType The type of the Category like Rooms or ConsumptionPools.
 * @param _elementList.loadingInProgress Loading state.
 * @returns JSX.Element.
 */
export const EcogesteCategoriesList = ({
    categories,
    categoryType,
    loadingInProgress,
}: EcogesteCategoriesListProps) => {
    if (loadingInProgress) {
        return <EcogestesLoadingSpinner />
    }

    if (!categories?.length) {
        return (
            <TypographyFormatMessage>
                Aucune catégorie d'écogeste n'est disponible pour le moment
            </TypographyFormatMessage>
        )
    }

    return (
        <div className="flex gap-20 flex-wrap justify-center mt-10" aria-label="list, categories, cards">
            {categories?.map((category) => (
                <EcogesteCategoryCard key={category.id} ecogestCategory={category} categoryType={categoryType} />
            ))}
        </div>
    )
}
