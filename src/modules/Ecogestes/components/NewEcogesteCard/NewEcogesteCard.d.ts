import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'

/**
 * NewEcogesteCard props.
 */
export interface NewEcogesteCardProps {
    /**
     * The name of the ecogestes category.
     */
    ecogeste: IEcogeste
    /**
     * The function to call when the user click on details.
     */
    showMoreDetails: () => void
}
