import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import { ThemeProvider, useTheme } from '@mui/material'
import { Button, Icon } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { AccomodationTab } from 'src/modules/MyHouse/components/Accomodation/AccomodationTab'
import { InstallationTab } from 'src/modules/MyHouse/components/Installation/InstallationForm'
import { HousingInformationPageLocationState } from 'src/modules/MyHouse/components/HousingInformation/HousingInformation.type'

/**
 * Page component for housing information.
 *
 * It regroups Accomodation tab & Equipments tab component.
 *
 * @returns Housing information tabs page.
 */
export const HousingInformation = () => {
    const theme = useTheme()
    const history = useHistory()
    const location = useLocation<HousingInformationPageLocationState>()
    const focusOnInstallationForm: boolean = location?.state?.focusOnInstallationForm ?? false

    const tabsContent = [
        {
            tabTitle: 'Ma maison',
            tabSlug: 'accomodation',
            tabContent: <AccomodationTab />,
        },
        {
            tabTitle: 'Info Installation',
            tabSlug: 'installation',
            tabContent: <InstallationTab />,
        },
    ]

    return (
        <ThemeProvider theme={theme}>
            <MultiTab
                header={
                    <ThemeProvider theme={theme}>
                        <Button
                            sx={{ color: 'primary.contrastText' }}
                            onClick={history.goBack}
                            className="text-12 md:text-16 mt-10"
                            color="inherit"
                        >
                            <Icon
                                component={motion.span}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { delay: 0.2 } }}
                                className="text-16 md:text-24 mr-2"
                            >
                                arrow_back
                            </Icon>
                            <TypographyFormatMessage>Retour</TypographyFormatMessage>
                        </Button>
                    </ThemeProvider>
                }
                content={tabsContent}
                innerScroll
                TabsProps={{ variant: 'fullWidth' }}
                rootCss={{
                    height: 'none',
                    minHeight: '0',
                }}
                isUseRouting={false}
                initialTabSlug={focusOnInstallationForm ? 'installation' : undefined}
            />
        </ThemeProvider>
    )
}
