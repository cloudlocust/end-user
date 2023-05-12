import { IEcogestPageComponentProps } from 'src/modules/Ecogestes/components/ecogeste'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList/EcogestesList'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * EcogestList Content Component.
 *
 * @param root0 Props.
 * @param root0.currentCategory Current Ecogeste Category.
 * @returns JSX.Element.
 */
const EcogestesListPageContent = ({ currentCategory }: IEcogestPageComponentProps): JSX.Element => {
    return currentCategory?.id ? (
        <div className="m-10 p-10">
            <EcogestesList />
        </div>
    ) : (
        <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        </div>
    )
}

export default EcogestesListPageContent
