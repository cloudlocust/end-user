import { isEmpty, isNull } from 'lodash'
import useEcogestes from 'src/modules/Ecogestes/hooks/ecogestesHook'
import { useParams } from 'react-router-dom'
import { EcogesteCard } from 'src/modules/Ecogestes'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useEffect } from 'react'
import { Icon } from '@mui/material'
import { EcogestViewedEnum, EcogestesProps, IEcogeste } from 'src/modules/Ecogestes/components/ecogeste.d'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'

/**
 * Given a category of ecogestes,
 * fetch and display a list of ecogestes.
 * Temporary display until we have category cards.
 *
 * @param root0 N/A.
 * @param root0.ecogestCategoryName The name of the ecogestes category.
 * @param root0.ecogestCategoryIcon The icon url of the ecogestes category.
 * @param root0.isEcogestsViewed Indicates whether to show just viewed ecogests.
 * @returns A Component which displays and filter the ecogestes.
 */
export const Ecogestes = ({ ecogestCategoryName, ecogestCategoryIcon, isEcogestsViewed }: EcogestesProps) => {
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

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex gap-10 items-center mb-20">
                {ecogestCategoryIcon && (
                    <Icon
                        aria-hidden="true"
                        color="primary"
                        className="w-36 h-36 sm:w-40 sm:h-40"
                        aria-label="ecogestCategoryIcon"
                    >
                        <img src={ecogestCategoryIcon} alt={ecogestCategoryName} className="w-full" />
                    </Icon>
                )}
                <TypographyFormatMessage variant="h2" className="text-17 sm:text-20 font-600">
                    {ecogestCategoryName ?? ' '}
                </TypographyFormatMessage>
            </div>
            {(isEmpty(ecogestes) || isNull(ecogestes)) && !isEcogestesLoadingInProgress ? (
                <div className="flex-1 flex justify-center items-center">
                    <TypographyFormatMessage className="text-18 sm:text-20 font-400 text-grey-400">
                        Aucun écogeste n'est disponible
                    </TypographyFormatMessage>
                </div>
            ) : isEcogestesLoadingInProgress ? (
                <div className="flex-1 flex justify-center items-center">
                    <EcogestesLoadingSpinner />
                </div>
            ) : (
                <div className="grid gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {ecogestes?.map((ecogeste: IEcogeste) => (
                        <EcogesteCard key={ecogeste.id} ecogeste={ecogeste} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Ecogestes
