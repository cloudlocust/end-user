import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router'

import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import HousingDetailsCard from 'src/modules/MyHouse/components/HousingDetails/HousingDetailsCard'
import { HouseDetailsElementType } from 'src/modules/MyHouse/components/HousingDetails/housingDetails'
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
import CircularProgress from '@mui/material/CircularProgress'
import { RootState } from 'src/redux'
import { isEmpty } from 'lodash'
import { connectedPlugsFeatureState } from 'src/modules/MyHouse/MyHouseConfig'

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
    const { housingList } = useSelector(({ housingModel }: RootState) => housingModel)

    const theme = useTheme()

    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    const housingId = parseInt(houseId)

    const {
        accomodation,
        isAccomodationMeterListEmpty,
        isLoadingInProgress: loadingAccomodationInProgress,
    } = useAccomodation(housingId)
    const { equipmentList, isEquipmentMeterListEmpty, loadingEquipmentInProgress } = useEquipmentList(housingId)

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const connectedPlugsElements: HouseDetailsElementType[] = [
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
    ]

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

    if (!housingList || isEmpty(housingList))
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress size={32} />
            </div>
        )
    const currentHousing = housingList.find((housing) => housing.id === Number(houseId))
    return (
        <Root
            header={
                <ThemeProvider theme={theme}>
                    <HousingCard element={currentHousing!} />
                </ThemeProvider>
            }
            content={
                <>
                    <MeterStatus />
                    <div className="flex flex-col items-center md:flex-row justify-around mt-40">
                        <HousingDetailsCard
                            title="Informations logement"
                            elements={housingElements}
                            typeOfDetails="accomodation"
                            isConfigured={!isAccomodationMeterListEmpty}
                            loadingInProgress={loadingAccomodationInProgress}
                        />
                        <HousingDetailsCard
                            title="Informations équipements"
                            elements={equipementElements}
                            typeOfDetails="equipments"
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
                                typeOfDetails="connectedPlugs"
                                isConfigured={false}
                                loadingInProgress={false}
                            />
                        ) : null}
                    </div>
                </>
            }
        />
    )
}
