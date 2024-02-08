import { useState } from 'react'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { ConsumptionPoleEcogestes, RoomEcogestes } from 'src/modules/Ecogestes/components/ecogesteCategoryTypes'
import { ButtonSwitcherParamsType } from 'src/modules/shared/ButtonsSwitcher/ButtonsSwitcher'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'

/**
 *  Ecogestes Wrapper.
 *
 *  @returns JSX.Element.
 */
export const EcogestesWrapper = () => {
    const [selectedEcogestesCategory, setSelectedEcogestesCategory] = useState<IEcogesteCategoryTypes>(
        IEcogesteCategoryTypes.CONSUMPTION,
    )

    const buttonsSwitcherParams: ButtonSwitcherParamsType[] = [
        {
            buttonText: 'Postes de conso',
            /**
             * Switch to Consumption Poles when a User fire a Click.
             */
            clickHandler: () => {
                setSelectedEcogestesCategory(IEcogesteCategoryTypes.CONSUMPTION)
            },
        },
        {
            buttonText: 'Pièces',
            /**
             * Switch to Rooms when a User fire a Click.
             */
            clickHandler: () => {
                setSelectedEcogestesCategory(IEcogesteCategoryTypes.ROOMS)
            },
        },
    ]

    return (
        <div
            className="w-full relative flex flex-col items-center gap-20 p-16"
            aria-label={selectedEcogestesCategory.toString() + 'Ecogests'}
        >
            <ButtonsSwitcher buttonsSwitcherParams={buttonsSwitcherParams} />
            {selectedEcogestesCategory === IEcogesteCategoryTypes.CONSUMPTION ? (
                <ConsumptionPoleEcogestes />
            ) : (
                <RoomEcogestes />
            )}
        </div>
    )
}
