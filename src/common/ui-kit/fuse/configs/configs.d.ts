import { ThemeOptions } from '@mui/material'

/**
 * Theme Extended colors type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type themeExtendedColorsType = {
    /**
     * Color of links.
     */
    links?: string
}

/**
 * Type of custom color Theme.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type colorThemesType = {
    /**
     * Theme Name.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    [themeName: string]: {
        /**
         * Storing extended Colors to override the given color palette to certain components.
         */
        extendedColors?: themeExtendedColorsType
        /**
         * Mui Theme Options as default theming.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        MUI: ThemeOptions
    }
}
