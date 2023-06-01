import CircularProgress from '@mui/material/CircularProgress'

import { useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { EcogesteCategoriesList } from 'src/modules/Ecogestes/components/ecogesteCategories/EcogesteCategoriesList'
import useEcogestePoles from 'src/modules/Ecogestes/hooks/polesHooks'
import { IPillSwitcherComponent } from 'src/modules/shared/PillSwitcher/pillSwitcher'
import { PillSwitcherMenuComponent } from 'src/modules/shared/PillSwitcher/pillSwitcherComponent'

/**
 * This component will handle the logic part for Ecogeste Consumption Poles.
 *
 * @returns JSX.Element - Consumption Poles Module.
 */
const ConsumptionPolesComponent = () => {
    const { elementList, loadingInProgress } = useEcogestePoles()

    if (loadingInProgress) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                    <CircularProgress size={32} />
                </div>
            </div>
        )
    }

    if (!elementList) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <TypographyFormatMessage>Aucun écogestes n'as été trouver...</TypographyFormatMessage>
            </div>
        )
    }

    return <EcogesteCategoriesList categoryType={IEcogesteCategoryTypes.CONSUMPTION} categories={elementList} />
}
/**.
 * Pieces Component.
 * !! This component is only to say the functionality is disabled.
 *
 * @returns JSX.Element.
 */
const RoomsComponent = () => {
    return (
        <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
            <TypographyFormatMessage>Cette fonctionnalité arrive prochainement.</TypographyFormatMessage>
        </div>
    )
}
/**
 *  Ecogestes Wrapper.
 *  I've maked it dynamic, so when we will implement Rooms we don't need to struggle on it.
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
