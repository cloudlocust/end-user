import { useTheme, ThemeProvider } from '@mui/material/styles'
import { selectContrastMainTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import clsx from 'clsx'

/**
 * Page Simple Header.
 *
 * @param props Props.
 * @param props.header Header Element.
 * @returns PageSimple Header.
 */
function PageSimpleHeader(props: /**
 *
 */
{
    /**
     *
     */
    header: JSX.Element
}) {
    const theme = useTheme()
    const contrastTheme = selectContrastMainTheme(theme.palette.primary.main)

    return (
        <div className={clsx('PageSimple-header')}>
            {props.header && <ThemeProvider theme={contrastTheme}>{props.header}</ThemeProvider>}
        </div>
    )
}

export default PageSimpleHeader
