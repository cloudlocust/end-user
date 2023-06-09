import { Button } from '@mui/material'
import Icon from '@mui/material/Icon'
import { ThemeProvider, styled, useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { useHistory, useParams } from 'react-router'
import { useIntl } from 'src/common/react-platform-translation'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'

const Root = styled(FusePageCarded)(() => ({
    '& .FusePageCarded-header': {
        minHeight: 90,
        height: 90,
        alignItems: 'center',
    },
    '& .FusePageCarded-content': {
        margin: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

/**
 * Connected Plugs Page.
 *
 * @returns JSX Element.
 */
const ConnectedPlugsPage = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    // eslint-disable-next-line jsdoc/require-jsdoc
    const { houseId } = useParams<{
        /**
         * Current house Id.
         */
        houseId: string
    }>()

    const housingId = parseInt(houseId)

    const history = useHistory()

    return (
        <Root
            header={
                <ThemeProvider theme={theme}>
                    <Button
                        sx={{ color: 'primary.contrastText' }}
                        onClick={() => history.push(`${URL_MY_HOUSE}/${housingId}`)}
                        className="text-16 ml-12"
                    >
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-24 mr-2 text"
                        >
                            arrow_back
                        </Icon>
                        {formatMessage({ id: 'Retour', defaultMessage: 'Retour' })}
                    </Button>
                </ThemeProvider>
            }
            content={<>Cette fonctionnalité arrive prochainement.</>}
        />
    )
}

export default ConnectedPlugsPage
