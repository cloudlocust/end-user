import { styled, useTheme, ThemeProvider } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { EcogestesWrapper } from 'src/modules/Ecogestes/EcogestesWrapper'
import { motion } from 'framer-motion'

const Root = styled(PageSimple)(({ theme }) => ({
    '& .PageSimple-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .PageSimple-content': {
        display: 'flex',
        position: 'relative',
    },
    '& .PageSimple-contentCard': {
        overflow: 'hidden',
    },
    [theme.breakpoints.down('md')]: {
        '& .PageSimple-toolbar': {
            height: 'auto',
        },
    },
}))

/**
 * Form used for modify user Advices.
 *
 * @returns Modify form component.
 */
export const Advices = () => {
    const theme = useTheme()

    return (
        <Root
            header={
                <ThemeProvider theme={theme}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center"
                    >
                        <TypographyFormatMessage
                            className="text-18 md:text-24"
                            style={{ color: theme.palette.primary.contrastText }}
                        >
                            Ecogestes
                        </TypographyFormatMessage>
                    </motion.div>
                </ThemeProvider>
            }
            content={<EcogestesWrapper />}
        />
    )
}
