import EcogestesList from '.'
import { IEcogestPageComponentProps } from '../ecogeste'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * EcogestList Content Component.
 *
 * @param root0 Props.
 * @param root0.currentCategory Current Ecogeste Category.
 * @param root0.elementList Current List of Ecogeste filtered by Ecogeste Category.
 * @returns JSX.Element.
 */
const EcogestesListPageContent = ({ currentCategory, elementList }: IEcogestPageComponentProps): JSX.Element => {
    return currentCategory?.id && elementList ? (
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
