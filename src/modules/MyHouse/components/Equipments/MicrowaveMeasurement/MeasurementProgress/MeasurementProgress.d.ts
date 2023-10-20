/**
 * Props of the MeasurementProgress component.
 */
export interface MeasurementProgressProps {
    /**
     * Current status of the measurement process.
     */
    status: measurementStatusEnum | null
    /**
     * Estimated value for the maximum duration of the measurement process (in seconds).
     */
    maxDuration: number
    /**
     * Function to get the passed time (in seconds) from the last update of status.
     */
    getTimeFromLastUpdate: () => number
}

/**
 * Enum object for values of the status of the measurement.
 */
export enum measurementStatusEnum {
    /**
     * Value for PENDING status.
     */
    PENDING = 'PENDING',
    /**
     * Value for IN_PROGRESS status.
     */
    IN_PROGRESS = 'IN_PROGRESS',
    /**
     * Value for SUCCESS status.
     */
    SUCCESS = 'SUCCESS',
    /**
     * Value for FAILED status.
     */
    FAILED = 'FAILED',
}
