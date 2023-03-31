import { lightBlue, red } from '@mui/material/colors'
import { colorThemesType } from './configs.d'

const primaryLightText = 'rgb(17, 24, 39)'

// Light text when it's a light mode theme Palette.
const lightText = {
    primary: primaryLightText,
    secondary: 'rgb(107, 114, 128)',
    disabled: 'rgb(149, 156, 169)',
}

// Dark text when it's a dark mode theme Palette.
const darkText = {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    primary: 'rgb(255,255,255)',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    secondary: 'rgb(229, 231, 235)',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    disabled: 'rgb(156, 163, 175)',
}

// Primary Color used in themes palettes such as (defaultDark, greyDark ...etc).
/**
 *
 */
export const fuseDark = {
    50: '#e5e6e8',
    100: '#bec1c5',
    200: '#92979f',
    300: '#666d78',
    400: '#464e5b',
    500: '#252f3e',
    600: '#212a38',
    700: '#1b2330',
    800: '#161d28',
    900: '#0d121b',
    A100: '#5d8eff',
    A200: '#2a6aff',
    A400: '#004af6',
    A700: '#0042dd',
    contrastDefaultColor: 'light',
}
// Secondary Color used in fuse themes palettes such as (defaultDark, greyDark ...etc).
const skyBlue = {
    50: '#e4fafd',
    100: '#bdf2fa',
    200: '#91e9f7',
    300: '#64e0f3',
    400: '#43daf1',
    500: '#22d3ee',
    600: '#1eceec',
    700: '#19c8e9',
    800: '#14c2e7',
    900: '#0cb7e2',
    A100: '#ffffff',
    A200: '#daf7ff',
    A400: '#a7ecff',
    A700: '#8de6ff',
    contrastDefaultColor: 'dark',
}

const colorThemes: colorThemesType = {
    ned: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#C5C2CC',
                    main: '#59575B',
                    dark: '#3E3D40',
                },
                secondary: {
                    light: '#E1EC2F',
                    main: '#C9D200',
                    dark: '#4E5207',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#FAFCFC',
                },
            },
        },
    },
    myem: {
        // TODO REMOVE ONCE THERE IS A NEW THEME NEED to OVERRIDE ALL LINKS.
        // extendedColors: {
        //     links: 'green',
        // },
        MUI: {
            palette: {
                mode: 'light',
                text: {
                    primary: '#000000',
                    secondary: lightText.secondary,
                    disabled: '#C4C7C7',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#f6f7f9',
                },
                primary: {
                    light: '#1EBDC7',
                    main: '#006970',
                    dark: '#004F55',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    light: '#ffe182',
                    main: '#FFC200',
                    dark: '#ffa200',
                },
            },
            // TODO REMOVE ONCE THERE IS A NEW THEME NEED to OVERRIDE ALL BUTTONS.
            // components: {
            //     MuiButton: {
            //         styleOverrides: {
            //             containedPrimary: {
            //                 backgroundColor: 'blue',
            //                 '&:hover': {
            //                     backgroundColor: 'purple',
            //                 },
            //             },
            //         },
            //     },
            // },
        },
    },
    consumer: {
        MUI: {
            palette: {
                mode: 'light',
                text: {
                    primary: '#000000',
                    secondary: lightText.secondary,
                    disabled: '#C4C7C7',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#f6f7f9',
                },
                primary: {
                    light: '#1EBDC7',
                    main: '#006970',
                    dark: '#004F55',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    light: '#ffe182',
                    main: '#FFC200',
                    dark: '#ffa200',
                },
            },
        },
    },
    voltfase: {
        MUI: {
            palette: {
                mode: 'light',
                text: {
                    primary: '#000000',
                    secondary: lightText.secondary,
                    disabled: '#C4C7C7',
                },
                primary: {
                    light: '#99D9D7',
                    main: '#00A19B',
                    dark: '#00817C',
                },
                secondary: {
                    light: '#C6F257',
                    main: '#9AC32B',
                    dark: '#273500',
                },
                common: {
                    white: '#ffffff',
                    black: '#000000',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#EFF1F1',
                },
            },
        },
    },
    ccsb: {
        MUI: {
            palette: {
                mode: 'light',
                text: {
                    primary: '#000000',
                    secondary: lightText.secondary,
                    disabled: '#C4C7C7',
                },
                primary: {
                    light: '#BDF9F4',
                    main: '#71AD98',
                    dark: '#4A7572',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    light: '#E5FFC4',
                    main: '#C2E498',
                    dark: '#556343',
                },
                common: {
                    white: '#ffffff',
                    black: '#000000',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#EFF1F1',
                },
            },
        },
    },
    mainThemeDark: {
        MUI: {
            palette: {
                mode: 'dark',
                background: {
                    paper: '#1E2125',
                    default: '#121212',
                },
                text: {
                    primary: 'rgb(255,255,255)',
                    secondary: 'rgb(229, 231, 235)',
                    disabled: 'rgb(156, 163, 175)',
                },
            },
        },
    },
    mainThemeLight: {
        MUI: {
            palette: {
                mode: 'light',
                background: {
                    paper: '#FFFFFF',
                    default: '#F7F7F7',
                },
                text: {
                    primary: primaryLightText,
                    secondary: 'rgb(107, 114, 128)',
                    disabled: 'rgb(149, 156, 169)',
                },
            },
        },
    },
    default: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                common: {
                    black: primaryLightText,
                    white: 'rgb(255, 255, 255)',
                },
                primary: fuseDark,
                secondary: {
                    light: skyBlue[100],
                    main: skyBlue[500],
                    dark: skyBlue[900],
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#f6f7f9',
                },
                error: red,
            },
        },
    },
    defaultDark: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: fuseDark,
                secondary: {
                    light: skyBlue[100],
                    main: skyBlue[500],
                    dark: skyBlue[900],
                },
                background: {
                    paper: '#1E2125',
                    default: '#121212',
                },
                error: red,
            },
        },
    },
    legacy: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: fuseDark,
                secondary: {
                    light: lightBlue[400],
                    main: lightBlue[600],
                    dark: lightBlue[700],
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#F7F7F7',
                },
                error: red,
            },
        },
    },
    light1: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#b3d1d1',
                    main: '#006565',
                    dark: '#003737',
                },
                secondary: {
                    light: '#ffecc0',
                    main: '#FFBE2C',
                    dark: '#ff9910',
                    contrastText: '#272727',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#F0F7F7',
                },
                error: red,
            },
        },
    },
    light2: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#fdf3da',
                    main: '#f8d683',
                    dark: '#f3bc53',
                    contrastText: '#252525',
                },
                secondary: {
                    light: '#FADCB3',
                    main: '#F3B25F',
                    dark: '#ec9339',
                    contrastText: '#252525',
                },
                background: {
                    paper: '#FAFBFD',
                    default: '#FFFFFF',
                },
                error: red,
            },
        },
    },
    light3: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#D9C8CE',
                    main: '#80485B',
                    dark: '#50212F',
                },
                secondary: {
                    light: '#FFE3BF',
                    main: '#FFB049',
                    dark: '#FF8619',
                    contrastText: '#252525',
                },
                background: {
                    paper: '#FFF0DF',
                    default: '#FAFAFE',
                },
                error: red,
            },
        },
    },
    light4: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#CDCCE8',
                    main: '#5854B1',
                    dark: '#2D2988',
                },
                secondary: {
                    light: '#F8EBF2',
                    main: '#E7BDD3',
                    dark: '#D798B7',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#F6F7FB',
                },
                error: red,
            },
        },
    },
    light5: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#C2C7F1',
                    main: '#3543D0',
                    dark: '#161EB3',
                },
                secondary: {
                    light: '#B3F1FE',
                    main: '#00CFFD',
                    dark: '#00B2FC',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#F7FAFF',
                },
                error: red,
            },
        },
    },
    light6: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#BBE2DA',
                    main: '#1B9E85',
                    dark: '#087055',
                },
                secondary: {
                    light: '#FFD0C1',
                    main: '#FF6231',
                    dark: '#FF3413',
                    contrastText: '#FFF',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#F2F8F1',
                },
                error: red,
            },
        },
    },
    light7: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#BFC4E6',
                    main: '#2A3BAB',
                    dark: '#0F1980',
                },
                secondary: {
                    light: '#C2ECF0',
                    main: '#33C1CD',
                    dark: '#149EAE',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#EDF0F6',
                },
                error: red,
            },
        },
    },
    light8: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#D2EFF2',
                    main: '#68C8D5',
                    dark: '#3AA7BA',
                },
                secondary: {
                    light: '#FFF2C6',
                    main: '#FED441',
                    dark: '#FDB91C',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#FAF6F3',
                    default: '#FFFFFF',
                },
                error: red,
            },
        },
    },
    light9: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#D3C0CD',
                    main: '#6B2C57',
                    dark: '#3C102C',
                },
                secondary: {
                    light: '#FDEAC9',
                    main: '#F9B84B',
                    dark: '#F59123',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#FAFAFE',
                },
                error: red,
            },
        },
    },
    light10: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#C6C9CD',
                    main: '#404B57',
                    dark: '#1C232C',
                },
                secondary: {
                    light: '#FEEDC7',
                    main: '#FCC344',
                    dark: '#FAA11F',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#F5F4F6',
                },
                error: red,
            },
        },
    },
    light11: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#C4C4C4',
                    main: '#3A3A3A',
                    dark: '#181818',
                },
                secondary: {
                    light: '#EFEFED',
                    main: '#CBCAC3',
                    dark: '#ACABA1',
                    contrastText: '#1E1F23',
                },
                background: {
                    paper: '#EFEEE7',
                    default: '#FAF8F2',
                },
                error: {
                    light: '#F7EAEA',
                    main: '#EBCECE',
                    dark: '#E3B9B9',
                },
            },
        },
    },
    light12: {
        MUI: {
            palette: {
                mode: 'light',
                text: lightText,
                primary: {
                    light: '#FFFAF6',
                    main: '#FFEDE2',
                    dark: '#FFE0CF',
                },
                secondary: {
                    light: '#DBD8F7',
                    main: '#887CE3',
                    dark: '#584CD0',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#FFFFFF',
                    default: '#FCF8F5',
                },
                error: red,
            },
        },
    },
    dark1: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#C2C2C3',
                    main: '#323338',
                    dark: '#131417',
                },
                secondary: {
                    light: '#B8E1D9',
                    main: '#129B7F',
                    dark: '#056D4F',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#262526',
                    default: '#1E1D1E',
                },
                error: red,
            },
        },
    },
    dark2: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#C9CACE',
                    main: '#4B4F5A',
                    dark: '#23262E',
                },
                secondary: {
                    light: '#F8F5F2',
                    main: '#E6DED5',
                    dark: '#D5C8BA',
                    contrastText: '#23262E',
                },
                background: {
                    paper: '#31343E',
                    default: '#2A2D35',
                },
                error: {
                    light: '#F7EAEA',
                    main: '#EBCECE',
                    dark: '#E3B9B9',
                },
            },
        },
    },
    dark3: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#C2C8D2',
                    main: '#354968',
                    dark: '#16213A',
                },
                secondary: {
                    light: '#F4CFCA',
                    main: '#D55847',
                    dark: '#C03325',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#23354E',
                    default: '#1B2A3F',
                },
                error: red,
            },
        },
    },
    dark4: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#CECADF',
                    main: '#5A4E93',
                    dark: '#2E2564',
                },
                secondary: {
                    light: '#B3EBD6',
                    main: '#00BC77',
                    dark: '#009747',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#22184B',
                    default: '#180F3D',
                },
                error: red,
            },
        },
    },
    dark5: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#CCD7E2',
                    main: '#56789D',
                    dark: '#2B486F',
                },
                secondary: {
                    light: '#D7D3ED',
                    main: '#796CC4',
                    dark: '#493DA2',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#465261',
                    default: '#232931',
                },
                error: red,
            },
        },
    },
    dark6: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#FFC7CE',
                    main: '#FF445D',
                    dark: '#FF1F30',
                },
                secondary: {
                    light: '#B4E3FB',
                    main: '#05A2F3',
                    dark: '#0175EA',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#2F3438',
                    default: '#25292E',
                },
                error: red,
            },
        },
    },
    dark7: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: 'FFECC5',
                    main: '#FEBE3E',
                    dark: '#FD991B',
                },
                secondary: {
                    light: '#FFC8C7',
                    main: '#FE4644',
                    dark: '#FD201F',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#2A2E32',
                    default: '#212529',
                },
                error: red,
            },
        },
    },
    dark8: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#BEBFC8',
                    main: '#252949',
                    dark: '#0D0F21',
                },
                secondary: {
                    light: '#CBD7FE',
                    main: '#5079FC',
                    dark: '#2749FA',
                    contrastText: '#1A1E22',
                },
                background: {
                    paper: '#2D3159',
                    default: '#202441',
                },
                error: red,
            },
        },
    },
    dark9: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#BCC8CD',
                    main: '#204657',
                    dark: '#0B202C',
                },
                secondary: {
                    light: '#B3EBC5',
                    main: '#00BD3E',
                    dark: '#00981B',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#1C1E27',
                    default: '#15171E',
                },
                error: red,
            },
        },
    },
    dark10: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#C3C2D2',
                    main: '#36336A',
                    dark: '#16143C',
                },
                secondary: {
                    light: '#D6CEFC',
                    main: '#765CF5',
                    dark: '#4630EE',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#2D2A5D',
                    default: '#26244E',
                },
                error: red,
            },
        },
    },
    dark11: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#BFB7BF',
                    main: '#2A0F29',
                    dark: '#0F040F',
                },
                secondary: {
                    light: '#D9B9C3',
                    main: '#801737',
                    dark: '#500716',
                    contrastText: '#FFFFFF',
                },
                background: {
                    paper: '#200D1F',
                    default: '#2D132C',
                },
                error: red,
            },
        },
    },
    dark12: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: '#CCC3C8',
                    main: '#543847',
                    dark: '#291720',
                },
                secondary: {
                    light: '#DFB8BD',
                    main: '#BE717A',
                    dark: '#99424A',
                    contrastText: '#1a161c',
                },
                background: {
                    paper: '#4D4351',
                    default: '#27141F',
                },
                error: red,
            },
        },
    },
    greyDark: {
        MUI: {
            palette: {
                mode: 'dark',
                text: darkText,
                primary: {
                    light: fuseDark[200],
                    main: fuseDark[700],
                    dark: fuseDark[800],
                },
                secondary: {
                    light: skyBlue[100],
                    main: skyBlue[500],
                    dark: skyBlue[900],
                },
                background: {
                    paper: fuseDark[400],
                    default: fuseDark[500],
                },
                error: red,
            },
        },
    },
}

export default colorThemes
