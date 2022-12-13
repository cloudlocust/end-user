import { SwipeableDrawer, IconButton, Icon } from '@mui/material/'
import { styled } from '@mui/material/styles'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import ConsumptionAlert from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert'
import { RootState } from 'src/redux'
import { useConsumptionAlerts } from './ConsumptionAlert/consumptionAlertHooks'

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

    const { consumptionAlerts } = useConsumptionAlerts(currentHousing?.id ?? null)

    // formate data for easier usage
    const formatedData = _.chain(consumptionAlerts)
        .keyBy('interval')
        .mapValues((v) => _.omit(v, 'interval'))
        .value()

    return (
        <StyledSwipeableDrawer
            open={true}
            anchor="right"
            // onOpen is a required prop to add in SwipeableDrawer even if it's empty.
            onOpen={(ev) => {}}
            onClose={closeAlertsDrawer}
            disableSwipeToOpen
        >
            <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={closeAlertsDrawer} size="large">
                <Icon color="action">close</Icon>
            </IconButton>
            <div className="flex-col mt-40 mx-8">
                <TypographyFormatMessage className="text-17 mb-20 ml-8 font-medium flex items-center">
                    Alerts Seuil de Consommation
                </TypographyFormatMessage>
                <ConsumptionAlert interval="day" initialValues={formatedData['data']} />
                <ConsumptionAlert interval="week" initialValues={formatedData['week']} />
                <ConsumptionAlert interval="month" initialValues={formatedData['month']} />
            </div>
        </StyledSwipeableDrawer>
    )
}
