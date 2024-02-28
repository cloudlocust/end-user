import { useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Form, regex, requiredBuilder } from 'src/common/react-platform-components'
import { meteGuidNumberRegex, METER_GUID_REGEX_TEXT } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import { useIntl } from 'react-intl'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { useSnackbar } from 'notistack'
import { useAlpiqProvider } from 'src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Error message no housing.
 */
export const ERROR_NO_HOUSING_MSG = "Votre logement n'est pas renseigné correctement"

/**
 * Pdl Verification Form for alpiq provider.
 *
 * @param props Props.
 * @param props.handleNext Handle next callback.
 * @returns JSX Element.
 */
const PdlVerificationForm = ({
    /**
     * Handle next callback.
     */
    handleNext,
}: /**
 *
 */
{
    /**
     * Handle next callback.
     */
    handleNext: () => void
}) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { editMeter, addMeter, loadingInProgress: isAddOrEditInProgress } = useMeterForHousing()
    const { verifyMeterEligibility, loadingInProgress: isAlpiqVerificationInProgress } = useAlpiqProvider()
    const { enqueueSnackbar } = useSnackbar()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    const currentMeterGuid = currentHousing?.meter?.guid

    /**
     * Function to submit the form.
     *
     * @param data Data.
     * @param data.guid Meter Guid.
     */
    const onSubmit = async (data: /**
     * Data.
     */
    {
        /**
         * Meter Guid.
         */
        guid: string
    }) => {
        if (!currentHousing?.id) {
            enqueueSnackbar(
                formatMessage({
                    id: ERROR_NO_HOUSING_MSG,
                    defaultMessage: ERROR_NO_HOUSING_MSG,
                }),
                { variant: 'error' },
            )
            return
        }

        if (!currentMeterGuid) {
            // if their is no meter in the housing, then it's a creation
            await addMeter(currentHousing.id, data)
        } else if (currentMeterGuid !== data.guid) {
            // if their is a meter in the housing, then it's an update
            await editMeter(currentHousing?.id, data)
        }

        verifyMeterEligibility(currentHousing.id, handleNext)
    }

    return (
        <div className="flex flex-col justify-center">
            <Form
                onSubmit={onSubmit}
                defaultValues={{
                    guid: currentMeterGuid,
                }}
            >
                <div className="flex justify-center w-full mb-32">
                    <TypographyFormatMessage
                        color={theme.palette.primary.main}
                        textAlign="center"
                        variant={isMobile ? 'body1' : 'h6'}
                        fontWeight={600}
                    >
                        Connectons votre compteur Linky
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-col justify-start mb-32">
                    <TypographyFormatMessage
                        color={theme.palette.text.primary}
                        className="mb-32"
                        variant={isMobile ? 'caption' : 'body1'}
                        fontWeight={500}
                    >
                        Connectons votre compteur à votre espace personnel, ainsi, une fois que vous aurez votre nrLINK
                        vous pourrez visualiser votre consommation à la minute !
                    </TypographyFormatMessage>
                    <TextField
                        name="guid"
                        label="Votre N° de PDL"
                        style={{ marginBottom: '5px' }}
                        placeholder="Ex: 12345678912345"
                        validateFunctions={[requiredBuilder(), regex(meteGuidNumberRegex, METER_GUID_REGEX_TEXT)]}
                    />
                    <TypographyFormatMessage variant="caption" sx={{ color: textNrlinkColor }}>
                        * Votre N° de PDL (point de livraison) est présent sur votre facture.
                    </TypographyFormatMessage>
                </div>
                <div className="flex w-full justify-center mt-32">
                    <ButtonLoader inProgress={isAddOrEditInProgress || isAlpiqVerificationInProgress} type="submit">
                        {formatMessage({
                            id: 'Continuer',
                            defaultMessage: 'Continuer',
                        })}
                    </ButtonLoader>
                </div>
            </Form>
        </div>
    )
}

export default PdlVerificationForm
