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
     * The name of the ecogestes category.
     */
    showMoreDetails: () => void
}
