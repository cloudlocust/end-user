import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { Container, Button, Icon } from '@mui/material'
import { Typography } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import SolarSizingForm from 'src/modules/SolarSizing/solarSizingForm'

/**
 * Solar sizing page.
 *
 * @returns Solar sizing page.
 */
export default function SolarSizing() {
    const history = useHistory()

    return (
        <PageSimple
            header={
                <div className="w-full flex justify-between items-center">
                    <Button onClick={history.goBack} className="text-12 md:text-16 ml-10 mt-8" color="inherit">
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 mr-2"
                        >
                            arrow_back
                        </Icon>
                        <TypographyFormatMessage>Retour</TypographyFormatMessage>
                    </Button>
                </div>
            }
            content={
                <Container maxWidth="lg">
                    <div className="p-10">
                        <div className="mb-20">
                            <Typography className="mb-10 text-20">
                                Vous êtes vous déjà demandé combien pourrait vous rapporter une installation solaire ?
                            </Typography>
                            <Typography className="mb-10 text-20">
                                Simuler une installation solaire pour ma maison
                            </Typography>
                            <Typography className="text-16 font-medium">
                                Ensemble calculons votre potentiel solaire à partir de votre consommation, de votre
                                maison et du taux d'ensoleillement de votre ville.
                            </Typography>
                        </div>
                        <SolarSizingForm />
                    </div>
                </Container>
            }
        />
    )
}
