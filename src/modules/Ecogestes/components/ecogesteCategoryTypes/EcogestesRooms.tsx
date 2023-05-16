import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategoriesList } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoriesList'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'

/**.
 * This component will handle the logic part for Ecogeste Rooms.
 *
 * @returns JSX.Element.
 */
export const EcogestesRooms = () => {
    const { elementList, loadingInProgress } = useEcogestesCategories(IEcogesteCategoryTypes.ROOMS)

    return (
        <EcogesteCategoriesList
            aria-label="ecogestsRooms"
            loadingInProgress={loadingInProgress}
            categoryType={IEcogesteCategoryTypes.ROOMS}
            categories={elementList}
        />
    )
}
