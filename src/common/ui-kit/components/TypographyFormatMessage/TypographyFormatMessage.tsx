import { useIntl } from 'src/common/react-platform-translation'
import Typography, { TypographyProps } from '@mui/material/Typography'

/**
 * Props for TypographyFormatMessage component.
 */
type TypographyFormatMessageProps = TypographyProps & /**
 * Other Custom Props.
 */ {
    /**
     * Dynamic values to put as {value} in (text / children) string.
     */
    values?: Record<string, string>
    /**
     * The text to be displayed.
     */
    text?: string
    /**
     * Children values.
     */
    children?: string
}

/**
 * Typography component with FormatMessage function.
 *
 * @param props N/A.
 * @param props.values Dynamic values to put as {value} in children string.
 * @param props.TypoProps Rest of the props of MUI Typography component.
 * @param props.text Children values.
 * @param props.children Children values.
 * @returns Typography with Format Message Wrapper.
 */
const TypographyFormatMessage = ({
    values,
    text,
    children,
    ...TypoProps
}: TypographyFormatMessageProps): JSX.Element => {
    const { formatMessage } = useIntl()

    const messageContent = text ?? children

    return (
        <Typography {...TypoProps}>
            {formatMessage(
                {
                    id: messageContent,
                    defaultMessage: messageContent,
                },
                values,
            )}
        </Typography>
    )
}

export default TypographyFormatMessage
