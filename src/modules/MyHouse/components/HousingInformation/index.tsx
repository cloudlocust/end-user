import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import { ThemeProvider, useTheme } from '@mui/material'
import { Button, Icon } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { AccomodationForm } from 'src/modules/MyHouse/components/Accomodation/AccomodationForm'
import { EquipmentForm } from 'src/modules/MyHouse/components/Equipments/EquipmentForm'

/**
 * Page component for housing information.
 *
 * It regroups Accomodation tab & Equipments tab component.
 *
 * @returns HHousing information tabs page.
 */
export const HousingInformation = () => {
    const theme = useTheme()
    const history = useHistory()
    const tabsContent = [
        {
            tabTitle: 'Info Logement',
            tabSlug: 'accomodation',
            tabContent: <AccomodationForm />,
        },
        {
            tabTitle: 'Info Installation',
            tabSlug: 'equipments',
            tabContent: <EquipmentForm />,
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
            />
        </ThemeProvider>
    )
}
