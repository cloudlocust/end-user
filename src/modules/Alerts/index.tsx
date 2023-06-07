import { Icon, Typography } from 'src/common/ui-kit'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useIntl } from 'src/common/react-platform-translation'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { AlertsContent } from 'src/modules/Alerts/AlertsContent'

/**
 * Alerts component. Place in the top navbar. ToolbarWidget.
 *
 * @returns Relevant Alerts components.
 */
const Alerts = () => {
    const { formatMessage } = useIntl()
    const history = useHistory()

    return (
        <PageSimple
            header={
                <div className="w-full">
                    <Button onClick={history.goBack} className="text-12 md:text-16 ml-10 mt-8" color="inherit">
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 mr-2"
                        >
                            arrow_back
                        </Icon>
                        {formatMessage({ id: 'Retour', defaultMessage: 'Retour' })}
                    </Button>
                    <div className="pl-16 mt-10 md:mt-0">
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="sm:flex text-18 sm:text-20 md:text-24 md:justify-center font-semibold"
                        >
                            {formatMessage({
                                id: 'Alertes Seuil de Consommation',
                                defaultMessage: 'Alertes Seuil de Consommation',
                            })}
                        </Typography>
                    </div>
                </div>
            }
            content={<AlertsContent />}
        />
    )
}

export default Alerts
