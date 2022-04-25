import { useTheme, ThemeProvider } from '@mui/material/styles'
import { selectMyemTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'

/**
 * Fuse page carded header.
 *
 * @param props Prop.
 * @param props.header Header passed as props.
 * @returns Header of page carded.
 */
function FusePageCardedHeader(props: /**
 *
 */
{
    /**
     *
     */
    header?: JSX.Element
}) {
    const contrastTheme = selectMyemTheme()

    return (
        <div className="FusePageCarded-header">
            {props.header && <ThemeProvider theme={contrastTheme}>{props.header}</ThemeProvider>}
        </div>
    )
}

export default FusePageCardedHeader
