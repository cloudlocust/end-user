import { useState } from 'react'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { ConsumptionPoleEcogestes, RoomEcogestes } from 'src/modules/Ecogestes/components/ecogesteCategoryTypes'
import { IPillSwitcherComponent } from 'src/modules/shared/PillSwitcher/pillSwitcher'
import { PillSwitcherMenuComponent } from 'src/modules/shared/PillSwitcher/pillSwitcherComponent'

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
        <div
            className="w-full relative flex flex-col items-center p-16"
            aria-label={ecogestesCategory.toString() + 'Ecogests'}
        >
            <PillSwitcherMenuComponent components={menuComponents} />
            {ecogestesCategory === IEcogesteCategoryTypes.CONSUMPTION ? (
                <ConsumptionPoleEcogestes />
            ) : (
                <RoomEcogestes />
            )}
        </div>
    )
}
