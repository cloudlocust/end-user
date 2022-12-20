import { SwipeableDrawer, IconButton, Icon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import ConsumptionAlert from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert'
import { RootState } from 'src/redux'
import { ConsumptionAlertData } from './ConsumptionAlert/consumptionAlert'
import { useConsumptionAlerts } from './ConsumptionAlert/consumptionAlertHooks'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
// import { EcowattAlerts } from 'src/modules/Layout/Toolbar/components/Alerts/EcowattAlerts'

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background.default,
        width: 320,
    },
}))

/**
 * Alerts Drawer component contains all the alerts.
 *
 * @param param0 N/A.
 * @param param0.closeAlertsDrawer CloseAlertDrawer callback function to close the drawer.
 * @returns Alerts Drawer JSX.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const AlertsDrawer = ({ closeAlertsDrawer }: { closeAlertsDrawer: () => void }) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const { consumptionAlerts, pricePerKwh, saveConsumptionAlert, isAlertsLoadingInProgress, isSavingInProgress } =
        useConsumptionAlerts(currentHousing?.id ?? null)

    //eslint-disable-next-line
    const [formData, setFormData] = useState<{ [key: string]: ConsumptionAlertData }>({})

    // formate data for easier usage
    useEffect(() => {
        const formatedData = _.chain(consumptionAlerts)
            .keyBy('interval')
            .mapValues((v) => _.omit(v, 'interval'))
            .value()

        setFormData(formatedData)
    }, [consumptionAlerts])

    // set new range for this mounth to see if user has contract
    const rangeOfCurrentMonth = {
        from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(new Date(), 1))),
        to: getDateWithoutTimezoneOffset(endOfMonth(subMonths(new Date(), 1))),
    }

    const { hasMissingHousingContracts } = useHasMissingHousingContracts(rangeOfCurrentMonth, currentHousing?.id)

    return (
        <StyledSwipeableDrawer
            open={true}
            anchor="right"
            // onOpen is a required prop to add in SwipeableDrawer even if it's empty.
            onOpen={(ev) => {}}
            onClose={closeAlertsDrawer}
            disableSwipeToOpen
        >
            <IconButton className="m-4 absolute top-0 right-0" onClick={closeAlertsDrawer} size="large">
                <Icon color="action">close</Icon>
            </IconButton>
            <div className="flex-col mt-40 mx-8">
                <TypographyFormatMessage className="text-17 mb-20 ml-8 font-medium">
                    Alertes Seuil de Consommation
                </TypographyFormatMessage>
                {hasMissingHousingContracts && (
                    <div className="flex justify-left items-center mb-20 ml-8">
                        <Icon className="mr-8">
                            <img
                                src="/assets/images/content/housing/consent-status/meter-error.svg "
                                alt="missing-contract"
                            />
                        </Icon>
                        <NavLink
                            to={currentHousing ? `${URL_MY_HOUSE}/${currentHousing?.id}/contracts` : `${URL_MY_HOUSE}`}
                        >
                            <TypographyFormatMessage className="text-13 text-orange-600 font-medium underline">
                                Prix basé sur le tarif bleu d'EDF. Renseignez votre contrat de fourniture pour une
                                estimation plus précise.
                            </TypographyFormatMessage>
                        </NavLink>
                    </div>
                )}
                <ConsumptionAlert
                    interval="day"
                    initialValues={formData['day']}
                    pricePerKwh={pricePerKwh}
                    saveConsumptionAlert={saveConsumptionAlert}
                    isConsumptionAlertsLoading={isAlertsLoadingInProgress}
                    isSavingAlertLoading={isSavingInProgress}
                />
                <ConsumptionAlert
                    interval="week"
                    initialValues={formData['week']}
                    pricePerKwh={pricePerKwh}
                    saveConsumptionAlert={saveConsumptionAlert}
                    isConsumptionAlertsLoading={isAlertsLoadingInProgress}
                    isSavingAlertLoading={isSavingInProgress}
                />
                <ConsumptionAlert
                    interval="month"
                    initialValues={formData['month']}
                    pricePerKwh={pricePerKwh}
                    saveConsumptionAlert={saveConsumptionAlert}
                    isConsumptionAlertsLoading={isAlertsLoadingInProgress}
                    isSavingAlertLoading={isSavingInProgress}
                />
                {/* <EcowattAlerts /> */}
            </div>
        </StyledSwipeableDrawer>
    )
}
