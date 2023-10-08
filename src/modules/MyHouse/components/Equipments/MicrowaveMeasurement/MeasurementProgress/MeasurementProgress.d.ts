/**
 * Type of the measurement status.
 */
export type measurementStatusType = 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED'

/**
 * Props of the MeasurementProgress component.
 */
export interface MeasurementProgressProps {
    /**
     * Current status of the measurement process.
     */
    status: measurementStatusType
    /**
     * Estimated value for the maximum duration of the measurement process (in seconds).
     */
    maxDuration: number
}

/**
 * Enum object for values of the status of the measurement.
 */
export enum measurementStatusEnum {
    /**
     * Value for PENDING status.
     */
    pending = 'PENDING',
    /**
     * Value for IN_PROGRESS status.
     */
    inProgress = 'IN_PROGRESS',
    /**
     * Value for SUCCESS status.
     */
    success = 'SUCCESS',
    /**
     * Value for FAILED status.
     */
    failed = 'FAILED',
}
