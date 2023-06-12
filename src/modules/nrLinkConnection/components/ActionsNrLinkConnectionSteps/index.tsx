import { useIntl } from 'react-intl'
import { ButtonLoader } from 'src/common/ui-kit'
import { Box, Button } from '@mui/material'
import { stepsLabels } from 'src/modules/nrLinkConnection/NrLinkConnectionSteps'
import { ActionsNrLinkConnectionStepsProps } from 'src/modules/nrLinkConnection/components/ActionsNrLinkConnectionSteps/ActionsNrLinkConnectionSteps'

/**
 * Component representing the action buttons in the Stepper (Previous, Next), Next Button will be of type Submit.
 *
 * @param props N/A.
 * @param props.activeStep Represent the current step in the stepper.
 * @param props.handleBack Callback when clicking on Previous button.
 * @param props.handleNext Callback when clicking on Next button.
 * @param props.inProgress Boolean indicating the loading of the ButtonLoading when submitting forms before next.
 * @returns ActionsNrLinkConnectionSTEPS.
 */
export default function ActionsNrLinkConnectionSteps({
    activeStep,
    handleBack,
    handleNext,
    inProgress,
}: ActionsNrLinkConnectionStepsProps) {
    const { formatMessage } = useIntl()

    return (
        <Box className="landscape:flex landscape:justify-between">
            <div className="my-16 w-full flex justify-center align-center">
                {activeStep > 0 && (
                    <Button variant="contained" onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        {formatMessage({
                            id: 'Précédent',
                            defaultMessage: 'Précédent',
                        })}
                    </Button>
                )}
                <ButtonLoader
                    variant="contained"
                    type="submit"
                    onClick={activeStep === stepsLabels.length - 1 ? () => {} : handleNext}
                    inProgress={Boolean(inProgress)}
                    sx={{ mt: 1, mr: 1 }}
                >
                    {activeStep === stepsLabels.length - 1
                        ? formatMessage({
                              id: 'Terminer',
                              defaultMessage: 'Terminer',
                          })
                        : formatMessage({
                              id: 'Suivant',
                              defaultMessage: 'Suivant',
                          })}
                </ButtonLoader>
            </div>
            <div className="w-full"></div>
        </Box>
    )
}
