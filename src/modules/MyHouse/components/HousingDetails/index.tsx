import React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router'
import { motion } from 'framer-motion'
import Icon from '@mui/material/Icon'
import { styled } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { useIntl } from 'src/common/react-platform-translation'
import { Button } from '@mui/material'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
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
import { useTheme } from '@mui/material'
import { useAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'
import { useEquipmentList } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
import { equipmentNameType } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import { ReactComponent as ElectricityIcon } from 'src/assets/images/content/housing/Electricity.svg'
import { ReactComponent as GazIcon } from 'src/assets/images/content/housing/Gaz.svg'

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {
        minHeight: 90,
        height: 90,
        alignItems: 'center',
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
    const history = useHistory()
    const { formatMessage } = useIntl()
    /**
     *
     * Receiving meterGuid from the housing list page.
     *
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const location: { state: { meterGuid: string } } = useLocation()

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

    return (
        <Root
            header={
                <Button color="primary" onClick={() => history.push(URL_MY_HOUSE)} className="text-16 ml-12">
                    <Icon
                        component={motion.span}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { delay: 0.2 } }}
                        className="text-24 mr-2 text"
                    >
                        arrow_back
                    </Icon>
                    {formatMessage({ id: 'Retour', defaultMessage: 'Retour' })}
                </Button>
            }
            content={
                <>
                    <MeterStatus houseId={houseId} meterGuid={location.state.meterGuid} />
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
                    </div>
                </>
            }
        />
    )
}
