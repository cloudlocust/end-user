import React from 'react'
import { Icon, Typography } from 'src/common/ui-kit'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useIntl } from 'src/common/react-platform-translation'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'

/**
 * FAQ component with the possibility to display frequently asked questions.
 *
 * @returns FAQ component.
 */
const FAQContainer = () => {
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
                        {formatMessage({ id: 'retour', defaultMessage: 'Retour' })}
                    </Button>
                    <div className="flex pl-16 mt-10 md:mt-0">
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-24 md:text-32"
                        >
                            help_center
                        </Icon>
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="sm:flex text-18 sm:text-20 md:text-24 mx-12 font-semibold"
                        >
                            {formatMessage({
                                id: 'Questions Fréquentes',
                                defaultMessage: 'Questions Fréquentes',
                            })}
                        </Typography>
                    </div>
                </div>
            }
            // TODO: Change in MYEM-3020
            content={<div>faq</div>}
        />
    )
}

export default FAQContainer
