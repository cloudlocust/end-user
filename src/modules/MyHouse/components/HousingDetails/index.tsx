import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import { HousingDetailsCard } from 'src/modules/MyHouse/components/HousingDetails/HousingDetailsCard'
import {
    HouseDetailsElementType,
    HousingCardTypeOfDetailsEnum,
} from 'src/modules/MyHouse/components/HousingDetails/housingDetails.d'
import { ReactComponent as SuperficieIcon } from 'src/assets/images/content/housing/Superficie.svg'
import { ReactComponent as OccupantIcon } from 'src/assets/images/content/housing/Occupant.svg'
import { ReactComponent as MainIcon } from 'src/assets/images/content/housing/Main.svg'
import { ReactComponent as VitroceramicIcon } from 'src/assets/images/content/housing/Vitroceramic.svg'
import { ReactComponent as InductionIcon } from 'src/assets/images/content/housing/Induction.svg'
import { ReactComponent as OtherIcon } from 'src/assets/images/content/housing/Other.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { useTheme, ThemeProvider } from '@mui/material/styles'
import { useAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import { ReactComponent as ElectricityIcon } from 'src/assets/images/content/housing/Electricity.svg'
// import { ReactComponent as GazIcon } from 'src/assets/images/content/housing/Gaz.svg'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { cloneDeep, isEmpty } from 'lodash'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/utils/MyHouseHooks'

const Root = styled(FusePageCarded)(() => ({
    '& .FusePageCarded-header': {
        minHeight: 90,
        height: 'fit-content',
        alignItems: 'center',
        margin: '24px 0',
    },
    '& .FusePageCarded-content': {
        overflowX: 'hidden',
        overflowY: 'auto',
        margin: 10,
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

/**
 *  Details of my house.
 *
 * @returns  Element Details Tabs.
 */
export const HousingDetails = () => {
    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const theme = useTheme()

    const {
        connectedPlugList,
        loadingInProgress: isConnectedPlugListLoading,
        loadConnectedPlugList,
    } = useConnectedPlugList(currentHousing?.id)

    const {
        accomodation,
        isAccomodationMeterListEmpty,
        isLoadingInProgress: loadingAccomodationInProgress,
    } = useAccomodation(currentHousing?.id)
    const { equipmentList, isEquipmentMeterListEmpty, loadingEquipmentInProgress } = useEquipmentList(
        currentHousing?.id,
    )

    const [installationElements, setInstallationElements] = useState<HouseDetailsElementType[]>([
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Chauffage',
        },
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Eau',
        },
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Plaques',
        },
    ])

    const [equipementElements, setEquipmentElments] = useState<HouseDetailsElementType[]>([
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Chauffage',
        },
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Eau',
        },
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Plaques',
        },
    ])

    // By default having default connected plug elements when loading.
    const [connectedPlugsElements, setConnectedPlugsElements] = useState<HouseDetailsElementType[]>([
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Prise 1',
        },
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Prise 2',
        },
        {
            icon: <MoreHorizIcon color="primary" fontSize="large" />,
            label: 'Prise 3',
        },
    ])

    // Then once elements are loaded handle each icon based on it's equipementType.
    useEffect(() => {
        // eslint-disable-next-line
        const handleEquipmentsIcons = (equipementName: equipmentNameType) => {
            const equipement = equipmentList?.find((equipement) => equipement.equipment.name === equipementName)
            switch (equipement?.equipmentType) {
                case 'electricity':
                    return (
                        <SvgIcon color="primary">
                            <ElectricityIcon />
                        </SvgIcon>
                    )
                case 'vitroceramic':
                    return (
                        <SvgIcon color="primary">
                            <VitroceramicIcon />
                        </SvgIcon>
                    )
                case 'induction':
                    return (
                        <SvgIcon color="primary">
                            <InductionIcon />
                        </SvgIcon>
                    )
                case 'other':
                    return (
                        <SvgIcon color="primary">
                            <OtherIcon />
                        </SvgIcon>
                    )
                default:
                    return <MoreHorizIcon color="primary" />
            }
        }

        setInstallationElements([
            {
                icon: handleEquipmentsIcons('heater'),
                label: 'Chauffage',
            },
            {
                icon: handleEquipmentsIcons('sanitary'),
                label: 'Eau',
            },
            {
                icon: handleEquipmentsIcons('hotplate'),
                label: 'Plaques',
            },
        ])

        setEquipmentElments([
            {
                icon: handleEquipmentsIcons('microwave'),
                label: 'Micro-onde',
            },
            {
                icon: handleEquipmentsIcons('oven'),
                label: 'Four',
            },
            {
                icon: handleEquipmentsIcons('dishwasher'),
                label: 'Lave-vaiselle',
            },
        ])
    }, [equipmentList])

    // For the house accomodation we don't need to handle the icons based on a certain type.
    const housingElements: HouseDetailsElementType[] = [
        {
            icon: <MainIcon style={{ fill: theme.palette.primary.main }} height={35} />,
            label: accomodation?.houseType ?? 'Type de logement',
        },
        {
            icon: <OccupantIcon style={{ fill: theme.palette.primary.main }} height={35} />,
            label: accomodation?.numberOfInhabitants ?? "Nombre d'occupants",
        },
        {
            icon: <SuperficieIcon style={{ fill: theme.palette.primary.main }} height={35} />,
            label: accomodation?.houseArea ? `${accomodation?.houseArea} m²` : 'Superficie',
        },
    ]

    // Once connectedPlugList are loaded handle the top three label and icon.
    useEffect(() => {
        // PreviousConnectedPlugsElements will always have three elements.
        // We update the previous connected plugs elements by the latest fetched connectedPlugList top three if exist.
        setConnectedPlugsElements((prevConnectedPlugsElements) => {
            const copyPrevConnectedPlugsElements = cloneDeep(prevConnectedPlugsElements)
            // Reset Icons & labels.
            copyPrevConnectedPlugsElements.forEach((connectedPlugElement, index) => {
                connectedPlugElement.label = `Prise ${index + 1}`
                connectedPlugElement.icon = <MoreHorizIcon color="primary" fontSize="large" />
            })

            connectedPlugList.slice(0, 3).forEach((connectedPlug, index) => {
                copyPrevConnectedPlugsElements[index].label = connectedPlug.deviceName
                copyPrevConnectedPlugsElements[index].icon = <ElectricalServicesIcon color="primary" fontSize="large" />
            })
            return copyPrevConnectedPlugsElements
        })
    }, [connectedPlugList])

    useEffect(() => {
        loadConnectedPlugList()
    }, [loadConnectedPlugList])

    return (
        <Root
            header={
                <ThemeProvider theme={theme}>
                    <div className="w-full relative flex flex-col justify-center items-center p-16 h-full">
                        <TypographyFormatMessage
                            className="text-18 md:text-24"
                            style={{ color: theme.palette.primary.contrastText }}
                        >
                            Logement
                        </TypographyFormatMessage>
                    </div>
                </ThemeProvider>
            }
            content={
                <>
                    <MeterStatus />
                    <div className="flex flex-col items-center md:flex-row justify-around mt-40">
                        <HousingDetailsCard
                            title="Information domicile"
                            elements={[...housingElements, ...installationElements]}
                            typeOfDetails={HousingCardTypeOfDetailsEnum.HOUSSING_INFORMATION}
                            isConfigured={!isEquipmentMeterListEmpty || !isAccomodationMeterListEmpty}
                            loadingInProgress={loadingEquipmentInProgress || loadingAccomodationInProgress}
                        />
                        <HousingDetailsCard
                            title="Mes équipements"
                            elements={equipementElements}
                            typeOfDetails={HousingCardTypeOfDetailsEnum.HOUSSING_EQUIPMENTS}
                            isConfigured={!isEquipmentMeterListEmpty}
                            loadingInProgress={loadingEquipmentInProgress}
                        />

                        {/**
                         * TODO: Configure, isLoading? Elements like Equipments (load default at mount then replace by real data).
                         */}
                        {arePlugsUsedBasedOnProductionStatus(currentHousingScopes) && (
                            <HousingDetailsCard
                                title="Mes prises connectées"
                                elements={connectedPlugsElements}
                                typeOfDetails={HousingCardTypeOfDetailsEnum.CONNECTED_PLUGS}
                                isConfigured={!isEmpty(connectedPlugList)}
                                loadingInProgress={isConnectedPlugListLoading}
                            />
                        )}
                    </div>
                </>
            }
            innerScroll
        />
    )
}
