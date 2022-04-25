import { ThemeProvider, alpha, Theme } from '@mui/material/styles'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { useEffect, useLayoutEffect } from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'
const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Function that applies a CSS Global Style to the DOM with GlobalStyles component.
 *
 * @param theme Theme Mui Object, representing the current Theme applied.
 * @returns GlobalStyles.
 */
const inputGlobalStyles = (theme: Theme) => (
    <GlobalStyles
        styles={() => {
            return {
                html: {
                    backgroundColor: `${theme.palette.background.default}!important`,
                    color: `${theme.palette.text.primary}!important`,
                },
                body: {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                },
                'code:not([class*="language-"])': {
                    color: theme.palette.secondary.dark,
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, .9)' : 'rgba(0, 0, 0, .9)',
                    padding: '2px 3px',
                    borderRadius: 2,
                    lineHeight: 1.7,
                },
                'table.simple tbody tr td': {
                    borderColor: theme.palette.divider,
                },
                'table.simple thead tr th': {
                    borderColor: theme.palette.divider,
                },
                'a:not([role=button]):not(.MuiButtonBase-root)': {
                    '&:hover': {},
                },
                'a.link, a:not([role=button])[target=_blank]': {
                    background: alpha(theme.palette.secondary.main, 0.2),
                    color: 'inherit',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    textDecoration: 'none',
                    '&:hover': {
                        background: alpha(theme.palette.secondary.main, 0.3),
                        textDecoration: 'none',
                    },
                },
                '[class^="border-"]': {
                    borderColor: theme.palette.divider,
                },
                '[class*="border-"]': {
                    borderColor: theme.palette.divider,
                },
                hr: {
                    borderColor: theme.palette.divider,
                },

                '::-webkit-scrollbar-thumb': {
                    boxShadow: `inset 0 0 0 20px ${
                        theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
                    }`,
                },
                '::-webkit-scrollbar-thumb:active': {
                    boxShadow: `inset 0 0 0 20px ${
                        theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
                    }`,
                },
            }
        }}
    />
)

/**
 * Component responsible for applying the main UI for the rest of children (Which represents the main content).
 *
 * @param props Props.
 * @param props.children Children Components.
 * @returns Main Theme applied to main Content.
 */
function FuseTheme({
    children,
}: /**
 *
 */
{
    /**
     *
     */
    children: JSX.Element
}) {
    const mainTheme = selectTheme()
    useEnhancedEffect(() => {
        document.body.dir = 'ltr'
    }, [])

    return (
        <ThemeProvider theme={mainTheme}>
            {inputGlobalStyles(mainTheme)}
            {children}
        </ThemeProvider>
    )
}

export default FuseTheme
