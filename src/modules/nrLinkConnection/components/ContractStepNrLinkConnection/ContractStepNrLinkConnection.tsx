import { ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection/NrLinkConnectionSteps'
import { ContractStepNrLinkConnectionProps } from 'src/modules/nrLinkConnection/components/ContractStepNrLinkConnection/ContractStepNrLinkConnection.d'

/**
 * ContractStepNrLinkConnection component that handle contracte setup after nrlink is connected.
 *
 * @param root0 N/A.
 * @param root0.handleNext Handle next function.
 * @returns ContractStepNrLinkConnection JSX.
 */
const ContractStepNrLinkConnection = ({ handleNext }: ContractStepNrLinkConnectionProps) => {
    return <ActionsNrLinkConnectionSteps activeStep={3} handleNext={handleNext} handleBack={() => {}} />
}

export default ContractStepNrLinkConnection
