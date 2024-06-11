import { useLocation } from 'react-router-dom'
import { AccomodationTab } from 'src/modules/MyHouse/components/Accomodation/AccomodationTab'
import { InstallationTab } from 'src/modules/MyHouse/components/Installation/InstallationForm'
import { HousingInformationPageLocationState } from 'src/modules/MyHouse/components/HousingInformation/HousingInformation.type'
import { EquipmentsTab } from 'src/modules/MyHouse/components/Equipments'
import { ReactElement, useState } from 'react'
import { ButtonSwitcherParamsType } from 'src/modules/shared/ButtonsSwitcher/ButtonsSwitcher'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'
import { IHouseOverviewSectionsEnum } from 'src/modules/MyHouse/components/MyHouseOverview/HouseOverview.types'

// Mapping of section identifiers to their respective components
const SectionContents: Record<IHouseOverviewSectionsEnum, ReactElement> = {
    [IHouseOverviewSectionsEnum.EQUIPMENTS]: <EquipmentsTab />,
    [IHouseOverviewSectionsEnum.ACCOMODATION]: <AccomodationTab />,
    [IHouseOverviewSectionsEnum.INSTALLATION]: <InstallationTab />,
}

/**
 * HouseSummary component renders a summary of a house, including its equipment, accommodation details, and energy installations.
 * It includes a tab switcher to navigate between the different aspects of the house.
 *
 * @returns The House Summary component.
 */
export function HouseOverview() {
    const location = useLocation<HousingInformationPageLocationState>()
    const focusOnInstallationForm: boolean = location?.state?.focusOnInstallationForm ?? false

    const [selectedSection, setSelectedSection] = useState<IHouseOverviewSectionsEnum>(
        focusOnInstallationForm ? IHouseOverviewSectionsEnum.INSTALLATION : IHouseOverviewSectionsEnum.EQUIPMENTS,
    )

    const buttonsSwitcherParams: ButtonSwitcherParamsType[] = [
        {
            buttonText: 'Mes équipements',
            /**
             * Switch to Equipments when a User fire a Click.
             */
            clickHandler: () => {
                setSelectedSection(IHouseOverviewSectionsEnum.EQUIPMENTS)
            },
            isSelected: selectedSection === IHouseOverviewSectionsEnum.EQUIPMENTS,
        },
        {
            buttonText: 'Ma maison',
            /**
             * Switch to Accomodation when a User fire a Click.
             */
            clickHandler: () => {
                setSelectedSection(IHouseOverviewSectionsEnum.ACCOMODATION)
            },
            isSelected: selectedSection === IHouseOverviewSectionsEnum.ACCOMODATION,
        },
        {
            buttonText: 'Mes énergies',
            /**
             * Switch to Installation when a User fire a Click.
             */
            clickHandler: () => {
                setSelectedSection(IHouseOverviewSectionsEnum.INSTALLATION)
            },
            isSelected: selectedSection === IHouseOverviewSectionsEnum.INSTALLATION,
        },
    ]

    return (
        <div className="w-full flex flex-col gap-20 p-16">
            <ButtonsSwitcher buttonsSwitcherParams={buttonsSwitcherParams} />
            <div>{SectionContents[selectedSection]}</div>
        </div>
    )
}
