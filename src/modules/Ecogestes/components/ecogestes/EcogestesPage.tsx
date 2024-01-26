import { FC, useEffect, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useParams } from 'react-router-dom'
import { IEcogestCategory, IEcogesteListPageProps } from 'src/modules/Ecogestes/components/ecogeste'
import EcogestesPageContent from 'src/modules/Ecogestes/components/ecogestes/EcogestesPageContent'
import EcogestesPageHeader from 'src/modules/Ecogestes/components/ecogestes/EcogestesPageHeader'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'

/**
 * EcogestListPage.
 *
 * @param root0 N/A.
 * @param root0.categoryType The type of the Category of Ecogestes that we want to load.
 * @returns EcogestPage.
 */
const EcogestesPage: FC<IEcogesteListPageProps> = ({
    categoryType = IEcogesteCategoryTypes.CONSUMPTION,
}): JSX.Element => {
    const { categoryId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes.
         */
        categoryId: string
    }>()

    const categoryIdInt = categoryId ? parseInt(categoryId) : undefined
    const { loadingInProgress, elementList } = useEcogestesCategories(categoryType)

    const [currentCategory, setCurrentCategory] = useState<IEcogestCategory | undefined | null>()

    useEffect(() => {
        let _category = elementList?.find((element) => element.id === categoryIdInt)
        setCurrentCategory(_category ? _category : null)
    }, [elementList, categoryIdInt])

    return (
        <PageSimple
            header={<EcogestesPageHeader isLoading={loadingInProgress} currentCategory={currentCategory} />}
            content={<EcogestesPageContent currentCategory={currentCategory} />}
        />
    )
}

export default EcogestesPage
