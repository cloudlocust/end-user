/**
 * Ownership status enum.
 */
export enum ownershipStatusEnum {
    /**
     * Locataire.
     */
    TENANT = 'tenant',
    /**
     * Propriétaire.
     */
    OWNER = 'owner',
}

/**
 * Accomodation Data Type.
 */
export type AccomodationDataType =
    /**
     * Accomodation Data Type.
     */
    {
        /**
         * Accomodation Id.
         */
        id: number
        /**
         * House type.
         */
        houseType?: string
        /**
         * House Year.
         */
        houseYear?: string
        /**
         * Residence Type.
         */
        residenceType?: string
        /**
         * Energy Performance Index.
         */
        energyPerformanceIndex?: string
        /**
         * Isolation Level.
         */
        isolationLevel?: string
        /**
         * Number Of Inhabitants.
         */
        numberOfInhabitants?: string
        /**
         * House Area.
         */
        houseArea?: string
        /**
         * Ownership status.
         */
        ownershipStatus?: ownershipStatusEnum
    }
