/**
 * Return Type of computation Functions (mean, min, max).
 */
export type computationFunctionType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Computed value.
         */
        value: number
        /**
         * Unit of computed value.
         */
        unit: totalConsumptionUnits
        /**
         * Timestamp of computed value.
         */
        timestamp?: number
    }

/**
 * Title of the analysisInformation.
 */
export type titleAnalysisInformationType =
    | 'Conso moyenne par jour'
    | 'Jour de Conso maximale'
    | 'Jour de Conso minimale'
/**
 * Type of element of analysisInformationList.
 */
export type analysisInformationType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Title of the analysisInformation.
         */
        title: titleAnalysisInformationType
        /**
         * Return Computation Function (min, max, mean) of the analysisInformation which represents (unit, value, timestamp).
         */
        computationFunction: (consumptionAxisValues: ApexChartsAxisValuesType) => computationFunctionType
        /**
         * Path of Icon of the analysis information.
         */
        iconPath?: string
        /**
         * Color of the Icon analysis information.
         */
        color: string
    }
