import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Section Title To avoir repetition.
 *
 * @param props Props.
 * @param props.title Title.
 * @param props.textColor Text color.
 * @returns JSX Element.
 */
export const SectionTitle = ({
    title,
    textColor,
}: /**
 */ {
    /**
     * Title.
     */
    title: string
    /**
     * Text Color.
     */
    textColor?: string
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    return (
        <TypographyFormatMessage
            color={textColor ?? theme.palette.primary.main}
            textAlign="center"
            variant={isMobile ? 'h6' : 'h5'}
            fontWeight={600}
        >
            {title}
        </TypographyFormatMessage>
    )
}

/**
 * Section Text to avoid repetition.
 *
 * @param props Props.
 * @param props.text Text.
 * @param props.className Class Name.
 * @param props.textColor Text color.
 * @returns JSX Element.
 */
export const SectionText = ({
    text,
    className,
    textColor,
}: /**
 */ {
    /**
     * Text.
     */
    text: string
    /**
     * ClassName.
     */
    className?: string
    /**
     * Text Color.
     */
    textColor?: string
}) => {
    const theme = useTheme()
    return (
        <TypographyFormatMessage
            className={className ?? ''}
            color={textColor ?? theme.palette.text.primary}
            variant="body1"
            fontWeight={400}
        >
            {text}
        </TypographyFormatMessage>
    )
}
