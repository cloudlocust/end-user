import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import { ThemeProvider, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import { AccomodationTab } from 'src/modules/MyHouse/components/Accomodation/AccomodationTab'
import { InstallationTab } from 'src/modules/MyHouse/components/Installation/InstallationForm'
import { HousingInformationPageLocationState } from 'src/modules/MyHouse/components/HousingInformation/HousingInformation.type'

const Root = styled('div')(() => ({
    '& .FusePageCarded-topBg': {
        display: 'none',
    },
    '& > div .FusePageCarded-contentWrapper ': {
        '& .FusePageCarded-header': {
            display: 'none',
        },
        '& .FusePageCarded-contentCard': {
            margin: '20px 0px 0px 0px',
        },
    },
}))

/**
 * HouseOverview component renders a multi-tab interface for managing different aspects of a house.
 * It includes tabs for viewing and managing house equipment, accommodation details, and energy installations.
 *
 * @returns The House Overview component.
 */
export const HouseOverview = () => {
    const theme = useTheme()
    const location = useLocation<HousingInformationPageLocationState>()
    const focusOnInstallationForm: boolean = location?.state?.focusOnInstallationForm ?? false

    const tabsContent = [
        {
            tabTitle: 'Mes équipements',
            tabSlug: 'équipements',
            tabContent: <div className="w-full h-512 flex justify-center items-center">Equipement list here</div>,
        },
        {
            tabTitle: 'Ma maison',
            tabSlug: 'accomodation',
            tabContent: <AccomodationTab />,
        },
        {
            tabTitle: 'Mes énergies',
            tabSlug: 'installation',
            tabContent: <InstallationTab />,
        },
    ]

    return (
        <ThemeProvider theme={theme}>
            <Root>
                <MultiTab
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
            </Root>
        </ThemeProvider>
    )
}
