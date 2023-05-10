import { isNull } from 'lodash'

import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ECOGESTES_TEXT_NOT_FOUND, IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategoriesList } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoriesList'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'

/**
 * This component will handle the logic part for Ecogestes Consumption Poles.
 *
 * @returns JSX.Element - all Ecogestes that belong to Consumption Poles.
 */
export const EcogestesConsumptionPoles = () => {
    const { elementList, loadingInProgress } = useEcogestesCategories(IEcogesteCategoryTypes.CONSUMPTION)

    if (loadingInProgress) {
        return <EcogestesLoadingSpinner />
    }

    if (isNull(elementList)) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <TypographyFormatMessage>{ECOGESTES_TEXT_NOT_FOUND}</TypographyFormatMessage>
            </div>
        )
    }

    return (
        <EcogesteCategoriesList
            aria-label="ecogests, consumptionPoles"
            categoryType={IEcogesteCategoryTypes.CONSUMPTION}
            categories={elementList}
        />
    )
}
