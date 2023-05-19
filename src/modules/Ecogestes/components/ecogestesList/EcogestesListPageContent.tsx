import { IEcogestPageComponentProps } from 'src/modules/Ecogestes/components/ecogeste'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList/EcogestesList'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'

/**
 * EcogestList Content Component.
 *
 * @param root0 Props.
 * @param root0.currentCategory Current Ecogeste Category.
 * @returns JSX.Element.
 */
const EcogestesListPageContent = ({ currentCategory }: IEcogestPageComponentProps): JSX.Element => {
    if (!currentCategory) {
        return <EcogestesLoadingSpinner />
    }

    return (
        <div className="m-10 p-10">
            <EcogestesList />
        </div>
    )
}

export default EcogestesListPageContent
