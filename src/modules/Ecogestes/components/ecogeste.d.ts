/**
 * Model for an Ecogeste.
 * Still a bit subject to change.
 */
export type IEcogeste =
    // eslint-disable-next-line jsdoc/require-jsdoc -- JSDoc is confused, false-positive
    {
        /**
         * Database-like id of the ecogest.
         * Used to poke REST endpoints, like when we want to update
         * the view status.
         */
        id: number

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
         * The savings of the Ecogeste.
         * Abstract percentile number that should give the user
         * an idea about how much money they are going to save by
         * doing the geste.
         */
        percentageSaved: number
        /**
         * Url of an icon that might be display on an ecogest card.
         */
        urlIcon?: string
        /**
         * Wheter or not the currently active customer has seen this Ecogeste.
         */
        seenByCustomer: boolean
    }
