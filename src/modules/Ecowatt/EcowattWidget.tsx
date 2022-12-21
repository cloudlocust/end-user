import { Card, CircularProgress, useMediaQuery, useTheme, Collapse, Button } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { OfflineBolt } from '@mui/icons-material/'
import 'dayjs/locale/fr'
import { useState, useContext } from 'react'
import { EcowattConsumptionValue, IEcowatt } from 'src/modules/Ecowatt/ecowatt.d'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import { capitalize, isEmpty } from 'lodash'
import { useToggle } from 'react-use'
import { EcowattTimeline } from 'src/modules/Ecowatt/components/EcowattTimeline'
import { EcowattTooltip } from 'src/modules/Ecowatt/components/EcowattTooltip'
import { Report } from '@mui/icons-material/'
import { AlertsDrawerContext } from 'src/modules/shared/AlertsDrawerContext'

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
        case EcowattConsumptionValue.OK:
            return <OfflineBolt color="success" fontSize="large" />
        case EcowattConsumptionValue.SEVERE:
            return <OfflineBolt color="warning" fontSize="large" />
        case EcowattConsumptionValue.CRITICAL:
            return <OfflineBolt color="error" fontSize="large" />
        default:
            throw Error('Wrong signal value')
    }
}

/**
 * Component for Ecowatt Widget.
 *
 * @param root0 N/A.
 * @param root0.ecowattData Ecowatt data coming from useEcowatt hook.
 * @param root0.isEcowattDataInProgress Progress state.
 * @returns EcowattWidget JSX.
 */
export const EcowattWidget = ({
    ecowattData,
    isEcowattDataInProgress,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    ecowattData: IEcowatt[] | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    isEcowattDataInProgress: boolean
}) => {
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const [openTooltip, setOpenTooltip] = useState<boolean>(false)
    const [expendDetails, setExpendDetails] = useToggle(false)
    const [dayDetails, setDayDetails] = useState<IEcowatt | null>(null)
    const { handleOpenAlertsDrawer } = useContext(AlertsDrawerContext)

    const StyledDiv = styled('div')(({ theme }) => ({
        padding: `${mdDown ? '5px' : '1rem'} ${mdDown ? '3px' : '1.5rem'}`,
        margin: `0 ${mdDown ? '0.5rem' : '1.5rem'}`,
        backgroundColor: theme.palette.background.default,
        borderRadius: '2rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: mdDown ? '0.75rem' : 0,
        flexGrow: '1',
        filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
        alignSelf: expendDetails ? 'flex-start' : 'center',
    }))

    /**
     * Function that handles collapse comopnent.
     *
     * @param ecowatt Ecowatt day data.
     */
    const handleExpendDetails = (ecowatt: IEcowatt) => {
        // If it's already open, we close it.
        if (expendDetails && ecowatt === dayDetails) {
            setExpendDetails(false)
        } else {
            setDayDetails(ecowatt)
            setExpendDetails(true)
        }
    }

    return (
        <div className="w-full">
            <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                <div className="p-16 flex flex-row justify-center h-full">
                    <TypographyFormatMessage className="text-13 font-medium md:text-17 flex items-center">
                        {ECOWATT_TITLE}
                    </TypographyFormatMessage>
                    <EcowattTooltip
                        openState={openTooltip}
                        onOpen={() => setOpenTooltip(true)}
                        onClose={() => setOpenTooltip(false)}
                    />
                </div>
                <div className="py-16 px-8 w-full flex flex-col justify-between items-center">
                    {isEcowattDataInProgress ? (
                        <div className="flex flex-col justify-center items-center w-full mb-8">
                            <CircularProgress data-testid="circular-progress" size={25} />
                        </div>
                    ) : isEmpty(ecowattData) ? (
                        <div className="w-full flex justify-center items-center">
                            <TypographyFormatMessage>Aucune donnée disponible</TypographyFormatMessage>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <div className="w-full flex justify-evenly flex-grow md:flex-grow-0">
                                {ecowattData?.map((day, index) => (
                                    <>
                                        <StyledDiv
                                            onClick={() => handleExpendDetails(day)}
                                            key={index}
                                            sx={{
                                                border:
                                                    dayDetails?.readingAt === day.readingAt && expendDetails
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : 0,
                                            }}
                                            data-testid={`day-widget-${index}`}
                                        >
                                            <div className="flex flex-row items-center">
                                                <div className="mr-8">{getSignalIcon(day.reading)}</div>
                                                <TypographyFormatMessage
                                                    fontWeight={500}
                                                    className="text-12 md:text-15"
                                                >
                                                    {mdDown
                                                        ? capitalize(dayjs(day.readingAt).format('ddd'))
                                                        : capitalize(dayjs(day.readingAt).format('dddd'))}
                                                </TypographyFormatMessage>
                                            </div>

                                            {dayDetails?.readingAt === day.readingAt && expendDetails && (
                                                <Collapse
                                                    in={dayDetails?.readingAt === day.readingAt}
                                                    className="mt-12 mb-6"
                                                >
                                                    <TypographyFormatMessage
                                                        fontWeight={500}
                                                        className="text-12 md:text-15"
                                                    >
                                                        {`${capitalize(dayjs(day.readingAt).format('D'))} ${capitalize(
                                                            dayjs(day.readingAt).format('MMM'),
                                                        )}`}
                                                    </TypographyFormatMessage>
                                                </Collapse>
                                            )}
                                        </StyledDiv>
                                    </>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Signal Timeline */}
                    <Collapse className="mt-8 mb-6 w-full" in={expendDetails}>
                        <EcowattTimeline hourlyValues={dayDetails?.hourlyValues} showHourReadingAt />
                        <div className="flex flex-row justify-center items-center mt-6">
                            <Button variant="contained" startIcon={<Report />} onClick={handleOpenAlertsDrawer}>
                                Configurer des alertes
                            </Button>
                        </div>
                    </Collapse>
                </div>
            </Card>
        </div>
    )
}
