import { useState } from 'react'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { ConsumptionPoleEcogestes, RoomEcogestes } from 'src/modules/Ecogestes/components/ecogesteCategoryTypes'
import { EcogestesWrapperProps } from './EcogestesWrapper.d'
import { ButtonSwitcherParamsType } from 'src/modules/shared/ButtonsSwitcher/ButtonsSwitcher'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'

/**
 *  Ecogestes Wrapper.
 *
 * @param root0 N/A.
 * @param root0.showJustVisualisedEcogests Indicates whether to show just visualised ecogests.
 *  @returns JSX.Element.
 */
export const EcogestesWrapper = ({ showJustVisualisedEcogests }: EcogestesWrapperProps) => {
    const [selectedEcogestesCategory, setSelectedEcogestesCategory] = useState<IEcogesteCategoryTypes>(
        IEcogesteCategoryTypes.CONSUMPTION,
    )

    const buttonsSwitcherParams: ButtonSwitcherParamsType[] = [
        {
            btnText: 'Postes de conso',
            /**
             * Switch to Consumption Poles when a User fire a Click.
             */
            clickHandler: () => {
                setSelectedEcogestesCategory(IEcogesteCategoryTypes.CONSUMPTION)
            },
        },
        {
            btnText: 'Pièces',
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
            className="w-full relative flex flex-col items-center p-16"
            aria-label={selectedEcogestesCategory.toString() + 'Ecogests'}
        >
            <ButtonsSwitcher buttonsSwitcherParams={buttonsSwitcherParams} />
            {selectedEcogestesCategory === IEcogesteCategoryTypes.CONSUMPTION ? (
                <ConsumptionPoleEcogestes showJustVisualisedEcogests={showJustVisualisedEcogests} />
            ) : (
                <RoomEcogestes showJustVisualisedEcogests={showJustVisualisedEcogests} />
            )}
        </div>
    )
}
