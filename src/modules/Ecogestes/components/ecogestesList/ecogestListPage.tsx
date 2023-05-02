import { FC, useEffect, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useParams } from 'react-router-dom'
import { IEcogestCategory, IEcogesteListPageProps } from 'src/modules/Ecogestes/components/ecogeste'
import useEcogestePoles from '../../hooks/polesHooks'
import { IEcogesteCategoryTypes } from '../../EcogestesConfig'

import EcogestesListPageContent from './EcogestesListPageContent'
import EcogestesListPageHeader from './EcogestesListPageHeader'

/**
 * EcogestListPage.
 *
 * @param root0 Props.
 * @param root0.categoryType Category of the Ecogeste.
 * @returns EcogestPage.
 */
const EcogestListPage: FC<IEcogesteListPageProps> = ({
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
    const { loadingInProgress, elementList } = useEcogestePoles()

    const [currentCategory, setCurrentCategory] = useState<IEcogestCategory | undefined | null>()

    useEffect(() => {
        let _category = elementList?.find((element) => element.id === categoryIdInt)
        setCurrentCategory(_category ? _category : null)
    }, [elementList, categoryIdInt])

    return (
        <PageSimple
            header={<EcogestesListPageHeader isLoading={loadingInProgress} currentCategory={currentCategory} />}
            content={<EcogestesListPageContent currentCategory={currentCategory} elementList={elementList} />}
        />
    )
}

export default EcogestListPage
