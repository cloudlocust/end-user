import { useTheme, ThemeProvider, useMediaQuery } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcogestesWrapper } from 'src/modules/Ecogestes/EcogestesWrapper'
import { motion } from 'framer-motion'
import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import { ReactComponent as AdvicesIcon } from 'src/assets/images/navbarItems/advice.svg'
import { ReactComponent as CircleCheckIcon } from 'src/assets/images/circleCheck.svg'
import { EcogestesList } from 'src/modules/Ecogestes'

/**
 * Form used for modify user Advices.
 *
 * @returns Modify form component.
 */
export const Advices = () => {
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))

    const tabsContent = [
        {
            tabTitle: 'Nos conseils',
            tabSlug: 'nos-conseils',
            tabContent: <EcogestesWrapper />,
            icon: <AdvicesIcon height={30} width={30} />,
        },
        {
            tabTitle: 'Réalisés',
            tabSlug: 'realises',
            tabContent: <EcogestesList showJustVisualisedEcogests />,
            icon: <CircleCheckIcon height={30} width={30} />,
        },
    ]

    return (
        <MultiTab
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
            content={tabsContent}
            innerScroll
            TabsProps={{ variant: 'fullWidth' }}
            TabProps={{ iconPosition: 'start', sx: { fontSize: 17 } }}
            rootCss={{
                height: 'auto',
                minHeight: 'auto',
                margin: `${!mdDown ? '0' : '0.5rem'}`,
            }}
            isUseRouting={false}
        />
    )
}
