import { useHistory } from 'react-router'
import { styled } from '@mui/material/styles'
import { AccomodationForm } from 'src/modules/MyHouse/components/Accomodation/AccomodationForm'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { motion } from 'framer-motion'
import Icon from '@mui/material/Icon'
import { useIntl } from 'src/common/react-platform-translation'
import { Button } from '@mui/material'
import { useTheme, ThemeProvider } from '@mui/material/styles'

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
 * Accomodation Page.
 *
 * @returns JSX Element.
 */
const Accomodation = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const history = useHistory()

    return (
        <Root
            header={
                <ThemeProvider theme={theme}>
                    <Button sx={{ color: 'primary.contrastText' }} onClick={history.goBack} className="text-16 ml-12">
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
            content={<AccomodationForm />}
        />
    )
}

export default Accomodation
