import { Typography } from '@mui/material'
import { isEmpty, isNull } from 'lodash'
import useEcogestesByCategory from 'src/modules/Ecogestes/ecogestesHook'
import { useParams } from 'react-router'
import { ImageCardLoader } from 'src/common/ui-kit/components/MapElementList/components/ContentLoader/ContentLoader'
import { EcogesteCard } from 'src/modules/Ecogestes'

/* eslint-disable jsdoc/require-jsdoc -- enough doc for now */

/**
 * Given a category of ecogestes,
 * fetch and display a list of ecogestes.
 * TODO: Filter them.
 *
 * @returns A Component which displays and filter a list of ecogestes.
 */
export const EcogestesList = () => {
    const { categoryId } = useParams<{ categoryId: string }>()
    const categoryIdInt = categoryId ? parseInt(categoryId) : 0

    const { elementList: ecogestesList, loadingInProgress: isEcogestesLoadingInProgress } =
        useEcogestesByCategory(categoryIdInt)
    const limits = Array(10).fill(0)

    return (
        <>
            <Typography variant="h2" className="text-20 mb-20 font-bold">
                {categoryIdInt > 0 ? <div>Categorie: {categoryIdInt}</div> : <div>Liste de tout les écogestes: </div>}
            </Typography>
            {(isEmpty(ecogestesList) || isNull(ecogestesList)) && !isEcogestesLoadingInProgress ? (
                "Pas d'ecogestes a charger"
            ) : (
                <></>
            )}
            <div className="flex flex-wrap gap-5 flex-col sm:flex-row  w-full h-fit ">
                {isEcogestesLoadingInProgress || isNull(ecogestesList)
                    ? limits.map(() => <ImageCardLoader></ImageCardLoader>)
                    : ecogestesList.map((ecogeste) => <EcogesteCard ecogeste={ecogeste} />)}
            </div>
        </>
    )
}

export default EcogestesList
