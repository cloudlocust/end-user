import { IEcogestPageComponentProps } from 'src/modules/Ecogestes/components/ecogeste'
import Ecogestes from 'src/modules/Ecogestes/components/ecogestes/Ecogestes'
import { EcogestesLoadingSpinner } from 'src/modules/Ecogestes/components/shared/EcogestesLoadingSpinner'

/**
 * EcogestList Content Component.
 *
 * @param root0 Props.
 * @param root0.currentCategory Current Ecogeste Category.
 * @returns JSX.Element.
 */
const EcogestesPageContent = ({ currentCategory }: IEcogestPageComponentProps): JSX.Element => {
    if (!currentCategory) {
        return <EcogestesLoadingSpinner />
    }

    return (
        <div className="m-10 p-10">
            <Ecogestes />
        </div>
    )
}

export default EcogestesPageContent
