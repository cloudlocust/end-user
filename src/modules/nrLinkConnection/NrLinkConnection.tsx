import React, { useEffect } from 'react'
import 'src/modules/User/Register/register.scss'
import { Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { URL_NRLINK_CONNECTION_STEPS, linkyNrLinkPath } from 'src/modules/nrLinkConnection'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'

/**
 * Get Show NrLink Popup Endpoint.
 */
export const GET_SHOW_NRLINK_POPUP_ENDPOINT = `${API_RESOURCES_URL}/get_show_nrlink_popup`
/**
 * Form used for modify user NrLinkConnection.
 *
 * @returns Modify form component.
 */
const NrLinkConnection = () => {
    const { formatMessage } = useIntl()
    const history = useHistory()

    useEffect(() => {
        /**
         * Get ShowNrLink Popup request handler.
         */
        const getShowNrLinkPopup = async () => {
            try {
                const { data: responseData } = await axios.get<boolean>(`${GET_SHOW_NRLINK_POPUP_ENDPOINT}`)
                if (typeof responseData !== 'boolean' || responseData === false) {
                    history.push(URL_CONSUMPTION)
                }
            } catch (error) {
                history.push(URL_CONSUMPTION)
            }
        }
        getShowNrLinkPopup()
    }, [history])

    return (
        <div className="p-24 h-full flex items-center justify-center relative">
            <div className="portrait:flex-col landscape:flex-row h-full flex justify-center items-center landscape:md:flex-col">
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center w-full"
                >
                    <img src={linkyNrLinkPath} alt="logo" />
                </motion.div>
                <div className="flex flex-col justify-center items-center md:max-w-360">
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
                    <div className="portrait:absolute portrait:bottom-24 portrait:right-24 landscape:mt-44">
                        <MuiLink
                            component={Link}
                            sx={{
                                color:
                                    // eslint-disable-next-line jsdoc/require-jsdoc
                                    (theme) => theme.palette.primary.light,
                            }}
                            to={URL_CONSUMPTION}
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
