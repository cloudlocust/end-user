import {
    Card,
    Tooltip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar as MuiToolbar,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { InfoOutlined, Circle, Close, OfflineBolt } from '@mui/icons-material/'
import 'dayjs/locale/fr'
import { useState } from 'react'
import { EcowattConsumptionLevelListType, EcowattConsumptionValue, IEcowatt } from 'src/modules/Ecowatt/ecowatt.d'
import { useEcowatt } from 'src/modules/Ecowatt/EcowattHook'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import { capitalize } from 'lodash'

const consumptionLevelList: EcowattConsumptionLevelListType = [
    {
        text: 'Consommation Normal',
        bulletColor: 'success',
    },
    {
        text: 'Système électrique tendu. Les écogestes sont les bienvenus.',
        bulletColor: 'warning',
    },
    {
        text: 'Système électrique très tendu. Coupure inévitable si nous ne baissons pas notre consommation.',
        bulletColor: 'error',
    },
]

/**
 * Ecowatt widget title.
 */
export const ECOWATT_TITLE = "Ecowatt : La météo de l'électricité"

/**
 * Function that renders the icon according to the consumption level.
 *
 * @param signalValue Signal value representing the level of consumption.
 * @returns Mui icon OfflineBolt.
 */
function getSignalIcon(signalValue: IEcowatt['reading']) {
    switch (signalValue) {
        case EcowattConsumptionValue.GREEN:
            return <OfflineBolt color="success" fontSize="large" />
        case EcowattConsumptionValue.ORANGE:
            return <OfflineBolt color="warning" fontSize="large" />
        case EcowattConsumptionValue.RED:
            return <OfflineBolt color="error" fontSize="large" />
        default:
            throw Error('Wrong signal value')
    }
}

/**
 * Component for Ecowatt Widget.
 *
 * @returns EcowattWidget JSX.
 */
export const EcowattWidget = () => {
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const [openTooltip, setOpenTooltip] = useState(false)
    const { ecowattData, isLoadingInProgress } = useEcowatt()

    const StyledDiv = styled('div')(() => ({
        padding: `${mdDown ? '5px' : '1rem'} ${mdDown ? '3px' : '1.5rem'}`,
        margin: `0 ${mdDown ? '0.5rem' : '1.5rem'}`,
        backgroundColor: theme.palette.background.default,
        borderRadius: '2rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: mdDown ? '0.75rem' : 0,
        flexGrow: '1 wrap',
        filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
    }))

    return (
        <div className="w-full">
            <Card className="w-full rounded-20 shadow sm:m-4" variant="outlined">
                <div className="p-16 flex flex-row justify-center h-full">
                    <TypographyFormatMessage className="text-13 font-medium md:text-17 flex items-center">
                        {ECOWATT_TITLE}
                    </TypographyFormatMessage>
                    <Tooltip
                        open={openTooltip}
                        disableHoverListener
                        title={
                            <div className="p-6">
                                <div className="flex-grow mb-64">
                                    <AppBar elevation={0} color="secondary">
                                        <MuiToolbar className="flex justify-between">
                                            <TypographyFormatMessage>{ECOWATT_TITLE}</TypographyFormatMessage>
                                            <Close className="cursor-pointer" onClick={() => setOpenTooltip(false)} />
                                        </MuiToolbar>
                                    </AppBar>
                                </div>
                                <TypographyFormatMessage>
                                    Mis en place par RTE (entreprise public qui gère le réseau de transport
                                    d'électricité), EcoWatt indique le niveau de consommation électrique en France
                                </TypographyFormatMessage>
                                <List>
                                    {consumptionLevelList.map((element) => (
                                        <ListItem className="p-0">
                                            <ListItemIcon>
                                                <Circle fontSize="small" className="p-0" color={element.bulletColor} />
                                            </ListItemIcon>
                                            <ListItemText primary={element.text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        }
                        placement="top-start"
                        arrow
                    >
                        <InfoOutlined
                            sx={(theme) => ({
                                color: theme.palette.primary.main,
                                marginLeft: 'auto',
                                cursor: 'pointer',
                            })}
                            fontSize="large"
                            onClick={() => setOpenTooltip(true)}
                        />
                    </Tooltip>
                </div>
                <div className="py-16 px-8 w-full flex justify-between items-center">
                    {isLoadingInProgress ? (
                        <div className="flex flex-col justify-center items-center w-full mb-8">
                            <CircularProgress data-testid="circular-progress" size={25} />
                        </div>
                    ) : (
                        <div className="w-full flex justify-evenly items-center flex-grow md:flex-grow-0">
                            {ecowattData?.map((day) => (
                                <StyledDiv>
                                    <div className="mr-8">{getSignalIcon(day.reading)}</div>
                                    <TypographyFormatMessage fontWeight={500} className="text-12 md:text-15">
                                        {mdDown
                                            ? capitalize(dayjs(day.readingAt).format('ddd'))
                                            : capitalize(dayjs(day.readingAt).format('dddd'))}
                                    </TypographyFormatMessage>
                                </StyledDiv>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
