import CircularProgress from '@mui/material/CircularProgress'
import { isNull } from 'lodash'

import { useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategoriesList } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoriesList'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'
import { IPillSwitcherComponent } from 'src/modules/shared/PillSwitcher/pillSwitcher'
import { PillSwitcherMenuComponent } from 'src/modules/shared/PillSwitcher/pillSwitcherComponent'

/**
 * This component will handle the logic part for Ecogeste Consumption Poles.
 *
 * @returns JSX.Element - Consumption Poles Module.
 */
const ConsumptionPolesComponent = () => {
    const { elementList, loadingInProgress } = useEcogestesCategories(IEcogesteCategoryTypes.CONSUMPTION)

    if (loadingInProgress) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                    <CircularProgress size={32} />
                </div>
            </div>
        )
    }

    /**
     * TODO: Make a better handler for this state.
     * IMO, is Admin ?
     * True -> show "CTA -> backbone to add Poles"
     * false -> show "No Ecogest found" or show every ecogests.
     */
    if (isNull(elementList)) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <TypographyFormatMessage>Aucun écogestes n'as été trouver...</TypographyFormatMessage>
            </div>
        )
    }

    return <EcogesteCategoriesList categoryType={IEcogesteCategoryTypes.CONSUMPTION} categories={elementList} />
}
/**.
 * This component will handle the logic part for Ecogeste Rooms.
 *
 * @returns JSX.Element.
 */
const RoomsComponent = () => {
    const { elementList, loadingInProgress } = useEcogestesCategories(IEcogesteCategoryTypes.ROOMS)

    if (loadingInProgress) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                    <CircularProgress size={32} />
                </div>
            </div>
        )
    }

    if (isNull(elementList)) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <TypographyFormatMessage>Aucun écogestes n'as été trouver...</TypographyFormatMessage>
            </div>
        )
    }

    return <EcogesteCategoriesList categoryType={IEcogesteCategoryTypes.ROOMS} categories={elementList} />
}
/**
 *  Ecogestes Wrapper.
 *
 *  @returns JSX.Element.
 */
export const EcogestesWrapper = () => {
    const [ecogestesCategory, changeEcogestesCategory] = useState<IEcogesteCategoryTypes>(
        IEcogesteCategoryTypes.CONSUMPTION,
    )

    const menuComponents: IPillSwitcherComponent[] = [
        {
            btnText: 'Postes de conso',
            /**
             * Switch to Consumption Poles when a User fire a Click.
             */
            clickHandler: () => {
                changeEcogestesCategory(IEcogesteCategoryTypes.CONSUMPTION)
            },
        },
        {
            btnText: 'Pièces',
            /**
             * Switch to Rooms when a User fire a Click.
             */
            clickHandler: () => {
                changeEcogestesCategory(IEcogesteCategoryTypes.ROOMS)
            },
        },
    ]

    return (
        <div className="w-full relative flex flex-col items-center p-16">
            <PillSwitcherMenuComponent components={menuComponents} />
            {ecogestesCategory === IEcogesteCategoryTypes.CONSUMPTION ? (
                <ConsumptionPolesComponent />
            ) : (
                <RoomsComponent />
            )}
        </div>
    )
}
