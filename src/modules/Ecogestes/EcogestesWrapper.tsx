import CircularProgress from '@mui/material/CircularProgress'

import PillSwitcherMenuComponent from './components/PillSwitcher/pillSwitcherComponent'
import { EcogestePillSwitcherProps, IEcogesteCategoryTypes } from './EcogestesConfig'
import useEcogestePoles from './hooks/polesHooks'
import { EcogesteCategoryList } from './components/shared/EcogesteCategory/EcogesteCategoryList'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

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

    /**
     * TODO: Make a better handler for this state.
     * IMO, is Admin ?
     * True -> show "CTA -> backbone to add Poles"
     * false -> show "No Ecogest found" or show every ecogests.
     */
    if (elementList === null || elementList.length === 0) {
        return (
            <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                <TypographyFormatMessage>Aucune catégorie d'ecogeste n'as été trouver...</TypographyFormatMessage>
            </div>
        )
    }

    return <EcogesteCategoryList categoryType={IEcogesteCategoryTypes.CONSUMPTION} categories={elementList} />
}
/**.
 * Pieces Component.
 * !! This component is only to say Its disabled.
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
    const ecogestesCategory = IEcogesteCategoryTypes.CONSUMPTION
    // const [ecogestesCategory, setEcogestesCategory] = useState<IEcogesteCategoryTypes>(
    //     IEcogesteCategoryTypes.CONSUMPTION,
    // )

    return (
        <div className="w-full relative flex flex-col items-center p-16">
            <PillSwitcherMenuComponent {...EcogestePillSwitcherProps} />
            {ecogestesCategory === IEcogesteCategoryTypes.CONSUMPTION ? (
                <ConsumptionPolesComponent />
            ) : (
                <RoomsComponent />
            )}
        </div>
    )
}
