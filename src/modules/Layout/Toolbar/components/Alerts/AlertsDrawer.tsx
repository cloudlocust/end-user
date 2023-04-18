import { SwipeableDrawer, IconButton, Icon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import ConsumptionAlert from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert'
import { RootState } from 'src/redux'
import { IConsumptionAlert } from './ConsumptionAlert/consumptionAlert'
import { useConsumptionAlerts } from './ConsumptionAlert/consumptionAlertHooks'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'

import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { getChannelPreferencesByInterval, rangeOfCurrentMonth } from './AlertsDrawerVariables'
import { EcowattAlerts } from 'src/modules/Layout/Toolbar/components/Alerts/EcowattAlerts'
import { useNovuAlertPreferences } from './NovuAlertPreferencesHook'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { ReactComponent as MeterErrorIcon } from 'src/assets/images/content/housing/meter-error.svg'
import { TempoAlerts } from 'src/modules/Layout/Toolbar/components/Alerts/TempoAlerts'
import { useContractList } from 'src/modules/Contracts/contractsHook'

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
    const { elementList: contractList } = useContractList(currentHousing!.id)

    const currentContract = contractList?.find((contract) => !contract.endSubscription)

    const { consumptionAlerts, pricePerKwh, saveConsumptionAlert, isAlertsLoadingInProgress, isSavingInProgress } =
        useConsumptionAlerts(currentHousing?.id ?? null)

    const {
        novuAlertPreferences,
        isLoadingInProgress: isNovuAlertPreferencesLoading,
        updateNovuAlertPreferences,
    } = useNovuAlertPreferences(currentHousing?.id ?? null)

    /**
     * Formate consumption alerts format to wanted format.
     *
     * @param consumptionAlerts Consumption alert.
     * @returns Formated consumption alerts to wanted format.
     */
    const formatAlertConsumptionsDataByinterval = (consumptionAlerts: IConsumptionAlert[]) =>
        _.chain(consumptionAlerts)
            .keyBy('interval')
            .mapValues((v) => _.omit(v, 'interval'))
            .value()

    const formatedData = useMemo(() => formatAlertConsumptionsDataByinterval(consumptionAlerts), [consumptionAlerts])

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
                        <MeterErrorIcon
                            className="mr-8"
                            style={{
                                width: '24px',
                                height: '24px',
                                color: linksColor || warningMainHashColor,
                            }}
                        />
                        <div>
                            <TypographyFormatMessage
                                className="text-13 font-medium"
                                style={{
                                    color: linksColor || warningMainHashColor,
                                }}
                            >
                                Prix basé sur le tarif bleu d'EDF.
                            </TypographyFormatMessage>
                            <NavLink
                                onClick={closeAlertsDrawer}
                                to={
                                    currentHousing
                                        ? `${URL_MY_HOUSE}/${currentHousing?.id}/contracts`
                                        : `${URL_MY_HOUSE}`
                                }
                            >
                                <TypographyFormatMessage
                                    className="text-13 font-medium underline"
                                    style={{
                                        color: linksColor || warningMainHashColor,
                                    }}
                                >
                                    Renseignez votre contrat de fourniture
                                </TypographyFormatMessage>
                            </NavLink>
                            <TypographyFormatMessage
                                className="text-13 font-medium"
                                style={{
                                    color: linksColor || warningMainHashColor,
                                }}
                            >
                                pour une estimation plus précise.
                            </TypographyFormatMessage>
                        </div>
                    </div>
                )}
                <ConsumptionAlert
                    interval="day"
                    initialConsumptionDataValues={formatedData['day']}
                    pricePerKwh={pricePerKwh}
                    saveConsumptionAlert={saveConsumptionAlert}
                    isConsumptionAlertsLoading={isAlertsLoadingInProgress}
                    isSavingAlertLoading={isSavingInProgress}
                    initialAlertPreferencesValues={getChannelPreferencesByInterval('day', novuAlertPreferences!)}
                    updateNovuAlertPreferences={updateNovuAlertPreferences}
                    isNovuAlertPreferencesLoading={isNovuAlertPreferencesLoading}
                />
                <ConsumptionAlert
                    interval="week"
                    initialConsumptionDataValues={formatedData['week']}
                    pricePerKwh={pricePerKwh}
                    saveConsumptionAlert={saveConsumptionAlert}
                    isConsumptionAlertsLoading={isAlertsLoadingInProgress}
                    isSavingAlertLoading={isSavingInProgress}
                    initialAlertPreferencesValues={getChannelPreferencesByInterval('week', novuAlertPreferences!)}
                    updateNovuAlertPreferences={updateNovuAlertPreferences}
                    isNovuAlertPreferencesLoading={isNovuAlertPreferencesLoading}
                />
                <ConsumptionAlert
                    interval="month"
                    initialConsumptionDataValues={formatedData['month']}
                    pricePerKwh={pricePerKwh}
                    saveConsumptionAlert={saveConsumptionAlert}
                    isConsumptionAlertsLoading={isAlertsLoadingInProgress}
                    isSavingAlertLoading={isSavingInProgress}
                    initialAlertPreferencesValues={getChannelPreferencesByInterval('month', novuAlertPreferences!)}
                    updateNovuAlertPreferences={updateNovuAlertPreferences}
                    isNovuAlertPreferencesLoading={isNovuAlertPreferencesLoading}
                />
                <EcowattAlerts />
                {currentContract?.tariffType.name === 'Jour Tempo' && <TempoAlerts />}
            </div>
        </StyledSwipeableDrawer>
    )
}
