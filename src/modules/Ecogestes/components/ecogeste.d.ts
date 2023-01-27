/**
 * Model for an Ecogeste.
 * Still a bit subject to change.
 */
export type IEcogeste =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * The title of the Ecogeste.
         */
        title: string
        /**
         * The description of the Ecogeste.
         * This is a long description that explains the ins and out of
         * the ecogeste.
         */
        description: string
        /**
         * The short description of the Ecogeste.
         * This is a sort of abridged version that is shown on the card.
         */
        shortdescription: string
        /**
         * The savings of the Ecogeste.
         * Abstract percentile number that should give the user
         * an idea about how much money they are going to save by
         * doing the geste.
         */
        savings: number | undefined
    }
