import { useIntl } from 'src/common/react-platform-translation'
import Typography, { TypographyProps } from '@mui/material/Typography'

//eslint-disable-next-line jsdoc/require-jsdoc
interface TypographyFormatMessageProps extends TypographyProps {
    //eslint-disable-next-line jsdoc/require-jsdoc
    TypoProps?: TypographyProps
    //eslint-disable-next-line jsdoc/require-jsdoc
    values?: Record<string, string>
    //eslint-disable-next-line jsdoc/require-jsdoc
    children: string
}

/**
 * Typography component with FormatMessage function.
 *
 * @param props N/A.
 * @param props.values Dynamic values to put as {value} in children string.
 * @param props.TypoProps Rest of the props of MUI Typography component.
 * @param props.children Children values.
 * @returns Typography with Format Message Wrapper.
 */
const TypographyFormatMessage = ({ values, children, ...TypoProps }: TypographyFormatMessageProps): JSX.Element => {
    const { formatMessage } = useIntl()

    return (
        <Typography {...TypoProps}>
            {formatMessage(
                {
                    id: children,
                    defaultMessage: children,
                },
                values,
            )}
        </Typography>
    )
}

export default TypographyFormatMessage
