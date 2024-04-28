import { useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Form, regex, requiredBuilder } from 'src/common/react-platform-components'
import { meteGuidNumberRegex, METER_GUID_REGEX_TEXT } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import { useIntl } from 'react-intl'
import { Dispatch, RootState } from 'src/redux'
import { useSelector, useDispatch } from 'react-redux'
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
    const { housingModel } = useDispatch<Dispatch>()

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
        let response = null
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
            response = await addMeter(currentHousing.id, data)
            // TODO - add a set housing state to avoid fetching back data.
            housingModel.loadHousingsList()
        } else if (currentMeterGuid !== data.guid) {
            // if their is a meter in the housing, then it's an update
            response = await editMeter(currentHousing?.id, data)
            housingModel.loadHousingsList()
        } else {
            verifyMeterEligibility(currentHousing.id, handleNext)
            return
        }

        if (response) verifyMeterEligibility(currentHousing.id, handleNext)
    }

    return (
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
                    Connectons votre compteur électrique
                </TypographyFormatMessage>
            </div>
            <div className="flex flex-col justify-start mb-32">
                <TypographyFormatMessage
                    color={theme.palette.text.primary}
                    className="mb-32"
                    variant={isMobile ? 'caption' : 'body1'}
                    fontWeight={500}
                >
                    Merci de renseigner votre PDL pour connecter votre compteur électrique à votre espace personnel afin
                    de vous faire la meilleure estimation possible.
                </TypographyFormatMessage>
                <div className="w-5/6 mx-auto">
                    <TextField
                        name="guid"
                        label="Votre N° de PDL"
                        style={{ marginBottom: '5px' }}
                        placeholder="Ex: 12345678912345"
                        validateFunctions={[requiredBuilder(), regex(meteGuidNumberRegex, METER_GUID_REGEX_TEXT)]}
                    />
                </div>
                <TypographyFormatMessage variant="caption" className="mt-12" sx={{ color: textNrlinkColor }}>
                    * Il est composé de 14 chiffres, il s'agit de l'identifiant de votre compteur utilisé par Enedis,
                    vous pouvez aussi retrouver votre PDL sur votre compteur Linky en appuyant 6 fois sur la touche « +
                    » sous le nom «NUMERO PRM»
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
    )
}

export default PdlVerificationForm
