import { Button, Icon, Typography, List, ListItem, ListItemText, Card } from '@mui/material'
import { generalTermsOfUse, privacyPolicy } from 'src/modules/Mentions/MentionsConfig'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Mentions page.
 *
 * @returns Mentions JSX.
 */
export const Mentions = (): JSX.Element => {
    const { formatMessage } = useIntl()
    const history = useHistory()

    /**
     * Mentions list.
     */
    const listUrl = [
        {
            title: 'Conditions Générales d’Utilisations',
            link: `${generalTermsOfUse}`,
        },
        {
            title: 'Politique de Confidentialité',
            link: `${privacyPolicy}`,
        },
        {
            title: 'Consentement à la récolte des données de consommation',
            link: 'https://drive.google.com/uc?export=download&id=15QHX14AWoKepWuEJBxscijK5IIHPnCbl',
        },
    ]

    return (
        <PageSimple
            header={
                <div className="flex w-full justify-between px-10">
                    <div>
                        <Button onClick={history.goBack} className="text-12 md:text-16 mt-10" color="inherit">
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
                        <div className="flex pl-16 mt-6 md:mt-0">
                            <Icon
                                component={motion.span}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { delay: 0.2 } }}
                                className="text-24 md:text-32"
                            >
                                gavel
                            </Icon>
                            <Typography
                                component={motion.span}
                                initial={{ x: -20 }}
                                animate={{ x: 0, transition: { delay: 0.2 } }}
                                className="sm:flex text-18 sm:text-20 md:text-24 mx-12 font-semibold"
                            >
                                {formatMessage({
                                    id: 'Mentions',
                                    defaultMessage: 'Mentions',
                                })}
                            </Typography>
                        </div>
                    </div>
                </div>
            }
            content={
                <div className="p-24">
                    <Card>
                        <List
                            sx={{
                                listStyleType: 'disc',
                                pl: 4,
                            }}
                        >
                            {listUrl.map((list, index) => (
                                <a href={list.link} target="_blank" rel="noopener noreferrer" key={index}>
                                    <ListItem
                                        sx={{
                                            display: 'list-item',
                                        }}
                                    >
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <TypographyFormatMessage color="primary" fontWeight={500}>
                                                    {list.title}
                                                </TypographyFormatMessage>
                                            }
                                            className="underline"
                                        />
                                    </ListItem>
                                </a>
                            ))}
                        </List>
                    </Card>
                </div>
            }
        />
    )
}
