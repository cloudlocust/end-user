import { motion } from 'framer-motion'
import { useIntl } from 'react-intl'
import { screenNrLinkPath } from 'src/modules/nrLinkConnection'
import Typography from '@mui/material/Typography'
import { ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'

/**
 * Component showing the first step in the nrLinkConnection Stepper.
 *
 * @param props N/A.
 * @param props.handleBack HandleBack.
 * @param props.handleNext HandleNext.
 * @returns FirstStepNrLinkConnection.
 */
const FirstStepNrLinkConnection = ({
    handleBack,
    handleNext,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleNext: () => void
}) => {
    const { formatMessage } = useIntl()

    return (
        <>
            <div className="flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-w-96 flex justify-center w-full mr-8"
                >
                    <img src={screenNrLinkPath} alt="screenNrLink" />
                </motion.div>
                <Typography variant="body2" className="w-full md:text-14">
                    {formatMessage({
                        id: 'Allumez votre afficheur déporté et suivez les instructions pour connecter votre capteur à votre compteur Linky et suivre votre consommation.',
                        defaultMessage:
                            'Allumez votre afficheur déporté et suivez les instructions pour connecter votre capteur à votre compteur Linky et suivre votre consommation.',
                    })}
                </Typography>
            </div>
            <ActionsNrLinkConnectionSteps activeStep={0} handleBack={handleBack} handleNext={handleNext} />
        </>
    )
}

export default FirstStepNrLinkConnection
