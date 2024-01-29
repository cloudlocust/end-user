import { isEmpty, isNull } from 'lodash'
import useEcogestes from 'src/modules/Ecogestes/hooks/ecogestesHook'
import { useParams } from 'react-router-dom'
import { EcogesteCard } from 'src/modules/Ecogestes'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useEffect } from 'react'
import { EcogestViewedEnum, EcogestesProps, IEcogeste } from 'src/modules/Ecogestes/components/ecogeste.d'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'

/**
 * Given a category of ecogestes,
 * fetch and display a list of ecogestes.
 * Temporary display until we have category cards.
 *
 * @param root0 N/A.
 * @param root0.isEcogestsViewed Indicates whether to show just viewed ecogests.
 * @returns A Component which displays and filter the ecogestes.
 */
export const Ecogestes = ({ isEcogestsViewed }: EcogestesProps) => {
    /**
     * Mandatory...
     * If we don't do that we got a Re-render and some bugs like all ecogeste instead of Ecogeste linked to a Category...
     */
    const { categoryId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes. Use 0 for all.
         */
        categoryId: string
    }>()

    const categoryIdInt = categoryId ? parseInt(categoryId) : undefined

    const {
        elementList: ecogestes,
        loadingInProgress: isEcogestesLoadingInProgress,
        filterEcogestes,
    } = useEcogestes(isEcogestsViewed ? { viewed: EcogestViewedEnum.READ } : { viewed: EcogestViewedEnum.UNREAD })

    useEffect(() => {
        filterEcogestes({
            viewed: isEcogestsViewed ? EcogestViewedEnum.READ : EcogestViewedEnum.UNREAD,
            tag_id: categoryIdInt,
        })
    }, [categoryIdInt, filterEcogestes, isEcogestsViewed])

    return (isEmpty(ecogestes) || isNull(ecogestes)) && !isEcogestesLoadingInProgress ? (
        <div className="flex justify-center items-center w-full h-full">
            <TypographyFormatMessage className="text-18 md:text-24 font-400 text-grey-400">
                Aucun écogeste n'est disponible
            </TypographyFormatMessage>
        </div>
    ) : (
        <div
            className="flex flex-nowrap gap-5 flex-col sm:flex-row  w-full sm:flex-wrap h-full sm:h-auto"
            aria-label="list, ecogests, cards"
        >
            {isEcogestesLoadingInProgress ? (
                <EcogestesLoadingSpinner />
            ) : (
                ecogestes?.map((ecogeste: IEcogeste) => <EcogesteCard key={ecogeste.id} ecogeste={ecogeste} />)
            )}
        </div>
    )
}

export default Ecogestes
