import { createTheme, ThemeOptions } from '@mui/material/styles'

/**
 * Default Options to add when creating any theme.
 */
export const defaultThemeOptions = {
    typography: {
        fontFamily: ['Poppins', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                enableColorOnDark: true,
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '18px',
                },
                sizeSmall: {
                    borderRadius: '15px',
                },
                sizeLarge: {
                    borderRadius: '21px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover, &:focus': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiButtonGroup: {
            styleOverrides: {
                contained: {
                    borderRadius: 18,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 16,
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    '&:before, &:after': {
                        display: 'none',
                    },
                },
            },
        },
        MuiSlider: {
            defaultProps: {
                color: 'secondary',
            },
        },
        MuiCheckbox: {
            defaultProps: {
                color: 'secondary',
            },
        },
        MuiRadio: {
            defaultProps: {
                color: 'secondary',
            },
        },
        MuiSwitch: {
            defaultProps: {
                color: 'secondary',
            },
        },
    },
}

/**
 * Options that we must have when creating theme (from Fuse template).
 */
export const mustHaveThemeOptions = {
    typography: {
        htmlFontSize: 10,
        fontSize: 13,
        body1: {
            fontSize: '1.3rem',
        },
        body2: {
            fontSize: '1.3rem',
        },
    },
}

/**
 * Create border extension based on a theme object.
 *
 * @param obj Theme to be extended.
 * @returns A Theme extesion with border, borderLeft, borderRight, borderTop, border.
 */
export function extendThemeWithMixins(obj: ThemeOptions | undefined) {
    const theme = createTheme(obj)
    return {
        /**
         * Border object property.
         *
         * @param width Represent border width, its default is set to 1.
         * @returns Border object.
         */
        border: (width = 1) => ({
            borderWidth: width,
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        }),
        /**
         * BorderLeft object property.
         *
         * @param width Represent border width, its default is set to 1.
         * @returns BorderLeft object.
         */
        borderLeft: (width = 1) => ({
            borderLeftWidth: width,
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        }),
        /**
         * BorderRight object property.
         *
         * @param width Represent border width, its default is set to 1.
         * @returns BorderRight object.
         */
        borderRight: (width = 1) => ({
            borderRightWidth: width,
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        }),
        /**
         * BorderTop object property.
         *
         * @param width Represent border width, its default is set to 1.
         * @returns BorderTop object.
         */
        borderTop: (width = 1) => ({
            borderTopWidth: width,
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        }),
        /**
         * BorderBottom object property.
         *
         * @param width Represent border width, its default is set to 1.
         * @returns BorderBottom object.
         */
        borderBottom: (width = 1) => ({
            borderBottomWidth: width,
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
        }),
    }
}
