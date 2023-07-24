import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import HousingDetailsCard from 'src/modules/MyHouse/components/HousingDetails/HousingDetailsCard'
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
import { useEquipmentList } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
import { equipmentNameType } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import { ReactComponent as ElectricityIcon } from 'src/assets/images/content/housing/Electricity.svg'
import { ReactComponent as GazIcon } from 'src/assets/images/content/housing/Gaz.svg'
import HousingCard from 'src/modules/MyHouse/components/HousingCard'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { cloneDeep, isEmpty } from 'lodash'
import { connectedPlugsFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'

const Root = styled(FusePageCarded)(() => ({
    '& .FusePageCarded-header': {
        minHeight: 90,
        height: 'fit-content',
        alignItems: 'center',
        margin: '24px 0',
    },
    '& .FusePageCarded-content': {
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
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const theme = useTheme()

    const {
        connectedPlugList,
        loadingInProgress: isConnectedPlugListLoading,
        loadConnectedPlugList,
    } = useConnectedPlugList(currentHousing!.meter?.guid!, currentHousing!.id)

    const {
        accomodation,
        isAccomodationMeterListEmpty,
        isLoadingInProgress: loadingAccomodationInProgress,
    } = useAccomodation(currentHousing!.id)
    const { equipmentList, isEquipmentMeterListEmpty, loadingEquipmentInProgress } = useEquipmentList(
        currentHousing!.id,
    )

    // get a default elements with default icons for when it's loading.
    const [equipementElements, setEquipementElements] = useState<HouseDetailsElementType[]>([
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
                case 'gaz':
                    return (
                        <SvgIcon color="primary">
                            <GazIcon />
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

        if (equipmentList) {
            setEquipementElements([
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
        }
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
            label: accomodation?.houseArea ? `${accomodation?.houseArea} m²` : 'superficie',
        },
    ]

    // Once connectedPlugList are loaded handle the top three label and icon.
    useEffect(() => {
        // PreviousConnectedPlugsElements will always have three elements.
        // We update the previous connected plugs elements by the latest fetched connectedPlugList top three if exist.
        setConnectedPlugsElements((prevConnectedPlugsElements) => {
            const copyPrevConnectedPlugsElements = cloneDeep(prevConnectedPlugsElements)
            // Reset Icons.
            copyPrevConnectedPlugsElements.forEach((connectedPlugElement) => {
                connectedPlugElement.icon = <MoreHorizIcon color="primary" fontSize="large" />
            })

            connectedPlugList.slice(0, 3).forEach((connectedPlug, index) => {
                copyPrevConnectedPlugsElements[index].label = 'Prise ' + connectedPlug.deviceId
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
                    <HousingCard />
                </ThemeProvider>
            }
            content={
                <>
                    <MeterStatus />
                    <div className="flex flex-col items-center md:flex-row justify-around mt-40">
                        <HousingDetailsCard
                            title="Informations logement"
                            elements={housingElements}
                            typeOfDetails={HousingCardTypeOfDetailsEnum.ACCOMODATION}
                            isConfigured={!isAccomodationMeterListEmpty}
                            loadingInProgress={loadingAccomodationInProgress}
                        />
                        <HousingDetailsCard
                            title="Informations équipements"
                            elements={equipementElements}
                            typeOfDetails={HousingCardTypeOfDetailsEnum.EQUIPMENTS}
                            isConfigured={!isEquipmentMeterListEmpty}
                            loadingInProgress={loadingEquipmentInProgress}
                        />
                        {/**
                         * TODO: Configure, isLoading? Elements like Equipments (load default at mount then replace by real data).
                         */}
                        {connectedPlugsFeatureState ? (
                            <HousingDetailsCard
                                title="Mes prises connectées"
                                elements={connectedPlugsElements}
                                typeOfDetails={HousingCardTypeOfDetailsEnum.CONNECTED_PLUGS}
                                isConfigured={!isEmpty(connectedPlugList)}
                                loadingInProgress={isConnectedPlugListLoading}
                            />
                        ) : null}
                    </div>
                </>
            }
        />
    )
}
