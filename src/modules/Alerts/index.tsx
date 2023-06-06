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
                <div>
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
                    <div className="flex pl-16 mt-10 md:mt-0">
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-24 md:text-32"
                        >
                            report
                        </Icon>
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="sm:flex text-18 sm:text-20 md:text-24 mx-12 font-semibold"
                        >
                            {formatMessage({
                                id: 'Alertes',
                                defaultMessage: 'Alertes',
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
