/**
 * Data status enum for findLastNonNullableDatapoint function.
 */
export enum LastDataStatus {
    /**
     * Data is updated.
     *
     * Data received within 6 minutes.
     */
    UPDATED = 'UpToDate',

    /**
     * Date is outdated.
     *
     * No data received for more than 6 minutes.
     */
    OUTDATED = 'Outdated',
}
