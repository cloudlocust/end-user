import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useTheme, ThemeProvider } from '@mui/material/styles'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import CircularProgress from '@mui/material/CircularProgress'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { formatMetricFilter, getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { metricFiltersType, metricIntervalType, metricRangeType } from 'src/modules/Metrics/Metrics'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/MyHouseConfig'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import SimplifiedConsumptionChartContainer from 'src/modules/MyConsumption/components/LabelizationContainer/simplifiedConsumptionChart'
import Box from '@mui/material/Box'

const Root = styled(PageSimple)(({ theme }) => ({
    '& .PageSimple-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .PageSimple-contentCard': {
        overflow: 'hidden',
    },
    [theme.breakpoints.down('md')]: {
        '& .PageSimple-toolbar': {
            height: 'auto',
        },
    },
}))

/**
 * Container for the page of labelization of consumption graph.
 *
 * @returns Jsx Element.
 */
const LablizationContainer = () => {
    const theme = useTheme()
    const { getConsents, nrlinkConsent, enedisSgeConsent, enphaseConsent, consentsLoading } = useConsents()

    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)

    // will be used for date picker
    const [range, setRange] = useState<metricRangeType>(getRangeV2(PeriodEnum.DAILY))
    const [filters, setFilters] = useState<metricFiltersType>([])

    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>('1m')

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    // Load connected plug only when housing is defined
    const { getProductionConnectedPlug, loadConnectedPlugList } = useConnectedPlugList(currentHousing?.id)
    // Check if there's connected plug in production mode.
    const isProductionConnectedPlug = getProductionConnectedPlug()

    // TODO put enphaseConsent.enphaseConsentState in an enum.
    let isSolarProductionConsentOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'
    if (arePlugsUsedBasedOnProductionStatus(currentHousingScopes))
        isSolarProductionConsentOff = isSolarProductionConsentOff && !isProductionConnectedPlug

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (!currentHousing?.id) return
        setFilters(formatMetricFilter(currentHousing?.id))
        getConsents(currentHousing?.id)
    }, [setFilters, getConsents, currentHousing?.id])

    useEffect(() => {
        setMetricsInterval((prevState) => {
            if (prevState === '1m' || prevState === '30m') return !isSolarProductionConsentOff ? '30m' : '1m'
            else return prevState
        })
    }, [isSolarProductionConsentOff])

    useEffect(() => {
        loadConnectedPlugList()
    }, [loadConnectedPlugList])

    if (consentsLoading)
        return (
            <Box
                sx={{ height: { xs: '424px', md: '584px' } }}
                className="p-24 CircularProgress flex flex-col justify-center items-center "
            >
                <CircularProgress style={{ color: theme.palette.primary.main }} />
            </Box>
        )
    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (!currentHousing?.meter?.guid) return <MissingHousingMeterErrorMessage />

    // When getConsent fail.
    if (!nrlinkConsent && !enedisSgeConsent)
        return (
            <ChartErrorMessage
                nrLinkEnedisOff={true}
                nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                linkTo={`/my-houses/${currentHousing?.id}`}
            />
        )

    return (
        <Root
            header={
                <ThemeProvider theme={theme}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center"
                    >
                        <TypographyFormatMessage
                            className="text-18 md:text-24"
                            style={{ color: theme.palette.primary.contrastText }}
                        >
                            Labélisation des appareils
                        </TypographyFormatMessage>
                    </motion.div>
                </ThemeProvider>
            }
            content={
                nrlinkOff && enedisOff ? (
                    <ChartErrorMessage
                        nrLinkEnedisOff={nrlinkOff && enedisOff}
                        nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                        linkTo={`/my-houses/${currentHousing?.id}`}
                    />
                ) : (
                    <SimplifiedConsumptionChartContainer
                        range={range}
                        setRange={setRange}
                        filters={filters}
                        isSolarProductionConsentOff={isSolarProductionConsentOff}
                        metricsInterval={metricsInterval}
                        enedisSgeConsent={enedisSgeConsent}
                    />
                )
            }
            innerScroll
        />
    )
}

export default LablizationContainer
