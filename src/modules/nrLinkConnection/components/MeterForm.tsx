import { motion } from 'framer-motion'
import { useIntl } from 'react-intl'
import { screenNrLinkPath } from 'src/modules/nrLinkConnection'
import Typography from '@mui/material/Typography'
import { ActionsNrLinkConnectionSteps } from '../NrLinkConnectionSteps'
import { Form } from 'src/common/react-platform-components'

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
        <Form>
            <div className="flex justify-between items-center">
                <div className="flex justify-between items-center">
                    <TextField
                        name="firstName"
                        label="Prénom"
                        validateFunctions={[requiredBuilder()]}
                        variant="outlined"
                    />
                    <TextField name="lastName" label="Nom" validateFunctions={[requiredBuilder()]} />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-w-96 flex justify-center w-full mr-8"
                >
                    <img src={screenNrLinkPath} alt="screenNrLink" />
                </motion.div>
            </div>
            <ActionsNrLinkConnectionSteps activeStep={0} handleBack={handleBack} handleNext={handleNext} />
        </Form>
    )
}

export default FirstStepNrLinkConnection
