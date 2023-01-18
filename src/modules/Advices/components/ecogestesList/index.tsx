import { isEmpty, isNull } from 'lodash'
import React from 'react'
import { useParams } from 'react-router'
import { API_RESOURCES_URL } from 'src/configs'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { IEcogeste } from '../ecogeste'
import EcogesteCard from '../ecogesteCard'

/* eslint-disable jsdoc/require-jsdoc -- enough doc for now */

export const ECOGESTES_ENDPOINT = `${API_RESOURCES_URL}/ecogestes`

/**
 * Return a URL to query encogestes by category.
 *
 * @param categoryId The id of the category.
 * @returns A URL.
 */
export const ECOGESTES_BY_CATEGORY = (categoryId: number) => `${ECOGESTES_ENDPOINT}/byCategory/${categoryId}`

/**
 * Hook to get a list of ecogestes by category.
 *
 * @param categoryId IDs of the categories.
 * @returns A hook to get the ecogestes.
 */
export const useEcogestesByCategory = (categoryId: number) =>
    BuilderUseElementList<IEcogeste, IEcogeste, searchFilterType>({
        API_ENDPOINT: ECOGESTES_BY_CATEGORY(categoryId),
    })()

/**
 * Given a category of ecogestes,
 * fetch and display a list of ecogestes.
 * TODO: Filter them.
 *
 * @returns A Component which displays and filter a list of ecogestes.
 */
const EcogestesList = () => {
    const { categoryId } = useParams<{ categoryId: string }>()
    const categoryIdInt = parseInt(categoryId)

    const { elementList: ecogestesList } = useEcogestesByCategory(categoryIdInt)

    return (
        <>
            <div>Category: {categoryIdInt}</div>
            <div className="flex flex-wrap gap-5 flex-col md:flex-row  w-full h-full ">
                {isEmpty(ecogestesList) || isNull(ecogestesList) ? (
                    <div>Hewwwooo</div>
                ) : (
                    ecogestesList.map((ecogeste) => <EcogesteCard ecogeste={ecogeste} />)
                )}
            </div>
        </>
    )
}

export default EcogestesList
