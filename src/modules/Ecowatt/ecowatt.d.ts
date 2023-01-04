import { Range } from 'src/common/types/NumberRange'

// eslint-disable-next-line jsdoc/require-jsdoc
export type EcowattConsumptionLevelListType = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    text: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    bulletColor: 'success' | 'warning' | 'error'
}[]

/**
 * Enum representing 3 level of consumption. (1 green, 2 orange, 3 red).
 */
export enum EcowattConsumptionValue {
    /**
     * Consommation Normal.
     */
    OK = 1,
    /**
     * Système électrique tendu.
     */
    SEVERE = 2,
    /**
     * Système électrique très tendu.
     */
    CRITICAL = 3,
}

/**
 * Model for Ecowatt data.
 */
export interface IEcowatt {
    /**
     * Reading at date type.
     */
    readingAt: string
    /**
     * Value between 1 and 3. (1 green, 2 orange, 3 red).
     */
    reading: 1 | 2 | 3
    /**
     * Array of every hour of the day and its signal level.
     */
    hourlyValues: IHourlyValues[]
}

/**
 * Hourly value type.
 */
export interface IHourlyValues {
    /**
     * Time step. 24 hours.
     */
    readingAt: Range<0, 24>
    /**
     * Signal value of the hour. (1 green, 2 orange, 3 red).
     */
    reading: 1 | 2 | 3
}

// eslint-disable-next-line jsdoc/require-jsdoc
export type IEcowattData = IEcowatt[]
