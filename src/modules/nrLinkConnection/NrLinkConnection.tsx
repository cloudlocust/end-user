import 'src/modules/User/Register/register.scss'
import { Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { URL_NRLINK_CONNECTION_STEPS, linkyNrLinkPath } from 'src/modules/nrLinkConnection'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'
import { useGetShowNrLinkPopupHook } from 'src/modules/nrLinkConnection/NrLinkConnectionHook'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'

/**
 * Get Show NrLink Popup Endpoint.
 */
export const GET_SHOW_NRLINK_POPUP_ENDPOINT = `${API_RESOURCES_URL}/customer/get_show_nrlink_popup`
/**
 * Set Show NrLink Popup Endpoint.
 */
export const SET_SHOW_NRLINK_POPUP_ENDPOINT = `${API_RESOURCES_URL}/customer/set_show_nrlink_popup`

/**
 * Form used for modify user NrLinkConnection.
 *
 * @returns Modify form component.
 */
const NrLinkConnection = () => {
    const { formatMessage } = useIntl()
    const history = useHistory()

    const { isGetShowNrLinkLoading, isNrLinkPopupShowing } = useGetShowNrLinkPopupHook()

    if (isGetShowNrLinkLoading) {
        return <FuseLoading />
    }

    if (isNrLinkPopupShowing === false) {
        history.push(URL_DASHBOARD)
    }

    return (
        <div className="p-24 h-full flex items-center justify-center relative" style={{ flexGrow: 1 }}>
            <div className="landscape:flex-row md:flex-row portrait:flex-col h-full flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center w-full"
                >
                    <img src={linkyNrLinkPath} alt="logo" />
                </motion.div>
                <div className="flex flex-col justify-center items-center w-full sm:max-w-360">
                    <Typography variant="body1" className="px-20 my-10 text-center text-14">
                        {formatMessage({
                            id: 'Connectez votre capteur à votre compteur et configurez votre afficheur nrLINK pour commencer à suivre votre consommation !',
                            defaultMessage:
                                'Connectez votre capteur à votre compteur et configurez votre afficheur nrLINK pour commencer à suivre votre consommation !',
                        })}
                    </Typography>
                    <Link to={URL_NRLINK_CONNECTION_STEPS}>
                        <Button variant="contained" color="primary" className="w-224">
                            {formatMessage({
                                id: 'Je connecte mon nrLINK',
                                defaultMessage: 'Je connecte mon nrLINK',
                            })}
                        </Button>
                    </Link>
                    <div className="portrait:absolute portrait:bottom-24 portrait:right-24 md:static md:mt-44 landscape:mt-44">
                        <MuiLink
                            component={Link}
                            onClick={() => {
                                // eslint-disable-next-line jsdoc/require-jsdoc
                                axios.patch<{ showNrlinkPopup: boolean }>(`${SET_SHOW_NRLINK_POPUP_ENDPOINT}`, {
                                    showNrlinkPopup: false,
                                })
                            }}
                            sx={{
                                color:
                                    // eslint-disable-next-line jsdoc/require-jsdoc
                                    (theme) => linksColor || theme.palette.primary.main,
                            }}
                            to={URL_DASHBOARD}
                            underline="none"
                        >
                            {formatMessage({ id: 'Passer cette étape', defaultMessage: 'Passer cette étape' })}
                        </MuiLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NrLinkConnection
