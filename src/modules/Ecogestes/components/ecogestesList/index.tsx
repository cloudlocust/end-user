import { isEmpty, isNull } from 'lodash'
import useEcogestesByCategory from 'src/modules/Ecogestes/ecogestesHook'
import { useParams } from 'react-router'
import { ImageCardLoader } from 'src/common/ui-kit/components/MapElementList/components/ContentLoader/ContentLoader'
import { EcogesteCard } from 'src/modules/Ecogestes'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Given a category of ecogestes,
 * fetch and display a list of ecogestes.
 * Temporary display until we have category cards.
 * TODO: Filter them.
 *
 * @returns A Component which displays and filter a list of ecogestes.
 */
export const EcogestesList = () => {
    const { categoryId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes. Use 0 for all.
         */
        categoryId: string
    }>()

    const categoryIdInt = categoryId ? parseInt(categoryId) : 0

    const { elementList: ecogestesList, loadingInProgress: isEcogestesLoadingInProgress } =
        useEcogestesByCategory(categoryIdInt)
    const limits = Array(10).fill(0)

    return (
        <>
            <TypographyFormatMessage variant="h2" className="text-20 mb-20 font-bold">
                {categoryIdInt > 0 ? `Categorie: ${categoryIdInt}` : 'Liste de tous les écogestes:'}
            </TypographyFormatMessage>
            {(isEmpty(ecogestesList) || isNull(ecogestesList)) &&
                !isEcogestesLoadingInProgress &&
                "Aucun écogeste n'est disponible pour le moment."}
            <div className="flex flex-nowrap gap-5 flex-col sm:flex-row  w-full sm:flex-wrap h-full sm:h-auto">
                {isEcogestesLoadingInProgress
                    ? limits.map(() => <ImageCardLoader></ImageCardLoader>)
                    : !isNull(ecogestesList) &&
                      !isEmpty(EcogestesList) &&
                      ecogestesList.map((ecogeste) => <EcogesteCard ecogeste={ecogeste} />)}
            </div>
        </>
    )
}

export default EcogestesList
