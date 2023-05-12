import { FC, useEffect, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useParams } from 'react-router-dom'
import { IEcogestCategory, IEcogesteListPageProps } from 'src/modules/Ecogestes/components/ecogeste'
import { useEcogestePoles } from 'src/modules/Ecogestes/hooks/polesHooks'
import EcogestesListPageContent from 'src/modules/Ecogestes/components/ecogestesList/EcogestesListPageContent'
import EcogestesListPageHeader from 'src/modules/Ecogestes/components/ecogestesList/EcogestesListPageHeader'

/**
 * EcogestListPage.
 *
 * @returns EcogestPage.
 */
const EcogestesListPage: FC<IEcogesteListPageProps> = (): JSX.Element => {
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

export default EcogestesListPage
