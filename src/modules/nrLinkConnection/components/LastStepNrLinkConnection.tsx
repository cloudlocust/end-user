import { useIntl } from 'react-intl'
import Typography from '@mui/material/Typography'
import { ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { useSnackbar } from 'notistack'
import { TextField } from 'src/common/ui-kit'
import { IMeter } from 'src/modules/Meters/Meters'
import { API_RESOURCES_URL } from 'src/configs'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'
import { axios } from 'src/common/react-platform-components'
import { useHistory } from 'react-router-dom'

/**
 * Component showing the first step in the nrLinkConnection Stepper.
 *
 * @param props N/A.
 * @param props.handleBack HandleBack.
 * @param props.meter The selectedMeter.
 * @param props.setIsNrLinkAuthorizeInProgress Handler to set the nrLinkAutorhizeInProgress.
 * @returns LastStepNrLinkConnection.
 */
const LastStepNrLinkConnection = ({
    handleBack,
    meter,
    setIsNrLinkAuthorizeInProgress,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    meter: IMeter | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    setIsNrLinkAuthorizeInProgress: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { formatMessage } = useIntl()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param formData FormData.
     * @param formData.meterGuid Meter GUID.
     * @param formData.meterName Meter Name.
     * @param formData.nrlinkGuid NrLink GUID.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmit = async (formData: { meterGuid: string; meterName: string; nrlinkGuid: string }) => {
        try {
            const { meterName, ...data } = formData
            setIsNrLinkAuthorizeInProgress(true)
            await axios.post(`${API_RESOURCES_URL}/nrlink/authorize`, data)
            enqueueSnackbar(
                formatMessage(
                    {
                        id: 'Votre nrLINK a bien été connecté au compteur {meterName}, vous pouvez maintenant visualiser votre consommation en direct',
                        defaultMessage:
                            'Votre nrLINK a bien été connecté au compteur {meterName}, vous pouvez maintenant visualiser votre consommation en direct',
                    },
                    { meterName: meter?.name },
                ),
                { autoHideDuration: 5000, variant: 'success' },
            )
            setIsNrLinkAuthorizeInProgress(false)
            history.push(URL_CONSUMPTION)
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.detail)
                enqueueSnackbar(
                    formatMessage({
                        id: error.response.data.detail,
                        defaultMessage: error.response.data.detail,
                    }),
                    { autoHideDuration: 5000, variant: 'error' },
                )
            else
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la connection de votre compteur',
                        defaultMessage: 'Erreur lors de la connection de votre compteur',
                    }),
                    { autoHideDuration: 5000, variant: 'error' },
                )
            setIsNrLinkAuthorizeInProgress(false)
        }
    }
    return (
        <Form
            onSubmit={onSubmit}
            defaultValues={meter ? { meterGuid: meter!.guid, meterName: meter!.name, nrlinkGuid: '' } : {}}
        >
            <div className="flex justify-between items-center landscape:mt-10">
                <div className="portrait:flex-col landscape:flex-row h-full flex justify-center items-center w-full">
                    <div className="w-full mr-10  max-w-640">
                        <div className="hidden">
                            <TextField name="meterGuid" disabled label="Numéro de mon compteur" />
                        </div>
                        <TextField name="meterName" disabled label="Nom de mon compteur" />
                        <TextField
                            name="nrlinkGuid"
                            label="Numéro de mon nrLink"
                            validateFunctions={[requiredBuilder()]}
                        />
                        <Typography
                            variant="caption"
                            className="w-full text-center mb-7"
                            sx={{ transform: 'translateY(-10px)' }}
                        >
                            {formatMessage({
                                id: 'N° GUID de votre capteur, consultable dans les paramètres de votre afficheur',
                                defaultMessage:
                                    'N° GUID de votre capteur, consultable dans les paramètres de votre afficheur',
                            })}
                        </Typography>
                    </div>
                    <div className="w-full max-w-640"></div>
                </div>
            </div>
            <ActionsNrLinkConnectionSteps activeStep={2} handleBack={handleBack} handleNext={() => {}} />
        </Form>
    )
}

export default LastStepNrLinkConnection
