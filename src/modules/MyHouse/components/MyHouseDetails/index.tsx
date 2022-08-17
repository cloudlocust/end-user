import React from 'react'
import { useHistory } from 'react-router'
import { motion } from 'framer-motion'
import Icon from '@mui/material/Icon'
import { styled } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { useIntl } from 'src/common/react-platform-translation'
import { Button } from '@mui/material'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import BoltIcon from '@mui/icons-material/Bolt'
import HouseDetailsCard from 'src/modules/MyHouse/components/MyHouseDetails/HouseDetailsCard'
import { HouseDetailsElementType } from 'src/modules/MyHouse/components/MyHouseDetails/houseDetails'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { NavLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { useTheme } from '@mui/material'

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
export const MyHouseDetails = () => {
    const history = useHistory()
    const { formatMessage } = useIntl()

    const houseId = 123
    const theme = useTheme()

    // for UI testing purpose
    const housingElements: HouseDetailsElementType[] = [
        {
            icon: (
                <Icon>
                    <img src="/assets/images/content/housing/Main.svg" alt="type logement" />
                </Icon>
            ),
            label: 'Type de logement',
        },
        {
            icon: (
                <Icon>
                    <img src="/assets/images/content/housing/Occupant.svg" alt="occupants" />
                </Icon>
            ),
            label: "Nombre d'occupants",
        },
        {
            icon: (
                <Icon>
                    <img src="/assets/images/content/housing/Superficie.svg" alt="superficie" />
                </Icon>
            ),
            label: 'superficie',
        },
    ]

    // for UI testing purpose
    const equipmentElements: HouseDetailsElementType[] = [
        {
            icon: <BoltIcon color="primary" />,
            label: 'Chauffage',
        },
        {
            icon: <LocalFireDepartmentIcon color="primary" />,
            label: 'Eau',
        },
        {
            icon: <MoreHorizIcon color="primary" font-fontSize="large" />,
            label: 'Plaques',
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
                <div>
                    <NavLink to={`${URL_MY_HOUSE}/${houseId}/contracts`} className="flex">
                        <Card className="flex flex-col items-center rounded p-8">
                            <ContractIcon
                                style={{ fill: theme.palette.primary.main, marginBottom: '4px' }}
                                height={35}
                            />
                            <TypographyFormatMessage
                                variant="subtitle1"
                                color="CaptionText"
                                className="text-10 font-semibold"
                            >
                                Contrat
                            </TypographyFormatMessage>
                        </Card>
                    </NavLink>
                    <div className="flex flex-col items-center md:flex-row justify-around mt-40">
                        <HouseDetailsCard title="Informations logement" elements={housingElements} />
                        <HouseDetailsCard title="Informations équipements" elements={equipmentElements} />
                    </div>
                </div>
            }
        />
    )
}
