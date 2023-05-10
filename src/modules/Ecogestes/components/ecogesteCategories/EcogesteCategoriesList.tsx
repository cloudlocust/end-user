import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { styled } from '@mui/material/styles'
import { EcogesteCategoryCard } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoryCard'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Display the List of Ecogestes that belong to categoryType.
 *
 * @param _elementList Props.
 * @param _elementList.categories List containing all Ecogestes Category.
 * @param _elementList.categoryType The type of the Category like Rooms or ConsumptionPools.
 * @returns JSX.Element.
 */
export const EcogesteCategoriesList = ({
    categories,
    categoryType,
}: /**
 * Params.
 */
{
    /**
     * Ecogest Categories.
     */
    categories: IEcogestCategory[]

    /**
     * The type of Ecogest Category we're using now.
     */
    categoryType: IEcogesteCategoryTypes
}) => {
    const CategoriesStyledDiv = styled('div')(() => ({
        marginTop: `15px`,
    }))

    return (
        <CategoriesStyledDiv className="flex gap-9 flex-wrap justify-center" aria-label="list, categories, cards">
            {categories?.length > 0 ? (
                categories?.map((category) => (
                    <EcogesteCategoryCard key={category.id} ecogestCategory={category} categoryType={categoryType} />
                ))
            ) : (
                <TypographyFormatMessage>
                    Aucune categorie d'écogeste n'est disponible pour le moment
                </TypographyFormatMessage>
            )}
        </CategoriesStyledDiv>
    )
}
