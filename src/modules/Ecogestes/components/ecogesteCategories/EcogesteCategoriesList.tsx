import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { EcogesteCategoryCard } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoryCard'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'

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
}: /**
 * Params.
 */
{
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
}) => {
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
        <div className="flex gap-9 flex-wrap justify-center mt-10" aria-label="list, categories, cards">
            {categories?.map((category) => (
                <EcogesteCategoryCard key={category.id} ecogestCategory={category} categoryType={categoryType} />
            ))}
        </div>
    )
}
