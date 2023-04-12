import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import { IPillSwitcherParams, PillSwitcherMenuComponent } from './components/PillSwitcher/pillSwitcherComponent'
import { EcogestePillSwitcherProps, IEcogesteCategoryTypes } from './EcogestesConfig'

/**.
 * Pieces Component.
 * !! This component is only to say Its disabled.
 *
 * @returns JSX.Element.
 */
const RoomsComponent = () => {
    return (
        <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
            Cette fonctionnalité arrive prochainement.
        </div>
    )
}
/**
 *  Ecogestes Wrapper.
 *
 *  @returns JSX.Element.
 */
export const EcogestesWrapper = () => {
    const { selectedItem } = useParams<IPillSwitcherParams>()
    const [ecogestesCategory, setEcogestesCategory] = useState<IEcogesteCategoryTypes>(
        IEcogesteCategoryTypes.CONSUMPTION,
    )

    useEffect(() => {
        if (selectedItem && selectedItem === IEcogesteCategoryTypes.ROOMS) {
            setEcogestesCategory(IEcogesteCategoryTypes.ROOMS)
        }
    }, [selectedItem])

    return (
        <div className="w-full relative flex flex-col items-center p-16">
            <PillSwitcherMenuComponent {...EcogestePillSwitcherProps} />
            {ecogestesCategory === IEcogesteCategoryTypes.CONSUMPTION ? 'conso' : <RoomsComponent />}
        </div>
    )
}
