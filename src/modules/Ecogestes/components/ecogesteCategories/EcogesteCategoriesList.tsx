import { IEcogesteCategoriesListProps } from 'src/modules/Ecogestes/components/ecogeste'
import { styled } from '@mui/material/styles'
import { EcogesteCategoryCard } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoryCard'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'

/**
 * Display the List of Ecogestes that belong to categoryType.
 *
 * @param _elementList Props.
 * @param _elementList.categories List containing all Ecogestes Category.
 * @param _elementList.categoryType The type of the Category like Rooms or ConsumptionPools.
 * @param _elementList.loadingInProgress The component is loading?
 * @returns JSX.Element.
 */
export const EcogesteCategoriesList = ({
    categories,
    categoryType,
    loadingInProgress,
}: IEcogesteCategoriesListProps) => {
    const CategoriesStyledDiv = styled('div')(() => ({
        marginTop: `15px`,
    }))

    if (loadingInProgress) {
        return <EcogestesLoadingSpinner />
    }

    return (
        <CategoriesStyledDiv className="flex gap-9 flex-wrap justify-center" aria-label="list, categories, cards">
            {categories && categories?.length > 0 ? (
                categories?.map((category) => (
                    <EcogesteCategoryCard key={category.id} ecogestCategory={category} categoryType={categoryType} />
                ))
            ) : (
                <TypographyFormatMessage>
                    Aucune catégorie d'écogeste n'est disponible pour le moment
                </TypographyFormatMessage>
            )}
        </CategoriesStyledDiv>
    )
}
