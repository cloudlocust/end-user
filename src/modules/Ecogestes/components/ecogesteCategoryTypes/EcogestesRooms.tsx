import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategoriesList } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoriesList'
import { EcogestesRoomsProps } from 'src/modules/Ecogestes/components/ecogesteCategoryTypes/ecogesteCategoryTypes'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'

/**.
 * This component will handle the logic part for Ecogeste Rooms.
 *
 * @param root0 N/A.
 * @param root0.showJustVisualisedEcogests Indicates whether to show just visualised ecogests.
 * @returns JSX.Element.
 */
export const EcogestesRooms = ({ showJustVisualisedEcogests }: EcogestesRoomsProps) => {
    const { elementList: ecogestCategoriesList, loadingInProgress } = useEcogestesCategories(
        IEcogesteCategoryTypes.ROOMS,
        showJustVisualisedEcogests,
    )

    return (
        <EcogesteCategoriesList
            aria-label="ecogestsRooms"
            loadingInProgress={loadingInProgress}
            categoryType={IEcogesteCategoryTypes.ROOMS}
            categories={ecogestCategoriesList}
            showJustVisualisedEcogests={showJustVisualisedEcogests}
        />
    )
}
