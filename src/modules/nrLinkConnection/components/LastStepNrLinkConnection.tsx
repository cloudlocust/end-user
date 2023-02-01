import { useIntl } from 'react-intl'
import { ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { Form, regex, requiredBuilder } from 'src/common/react-platform-components'
import { useSnackbar } from 'notistack'
import { TextField } from 'src/common/ui-kit'
import { IMeter } from 'src/modules/Meters/Meters'
import { API_RESOURCES_URL } from 'src/configs'
import { axios } from 'src/common/react-platform-components'
import { useHistory } from 'react-router-dom'
import { SET_SHOW_NRLINK_POPUP_ENDPOINT } from 'src/modules/nrLinkConnection/NrLinkConnection'
import { motion } from 'framer-motion'
import { nrLinkGUID, nrLinkInfo, nrLinkMain } from 'src/modules/nrLinkConnection'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'

const textNrlinkColor = 'text.secondary'

/**
 * Snackbar message when nrlink is setup.
 */
export const NRLINK_SUCCESS_SETUP_MESSAGE =
    'Votre nrLINK a été configuré avec succès. Merci de renseigner votre contrat de fourniture pour visualiser la consommation en euros sur votre nrLINK'

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
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param formData FormData.
     * @param formData.meterGuid Meter GUID.
     * @param formData.nrlinkGuid NrLink GUID.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmit = async (formData: { meterGuid: string; nrlinkGuid: string }) => {
        try {
            setIsNrLinkAuthorizeInProgress(true)
            await axios.post(`${API_RESOURCES_URL}/nrlink/authorize`, formData)
            // Set Show NrLinkPopup when last step is done
            // eslint-disable-next-line jsdoc/require-jsdoc
            await axios.patch<{ showNrlinkPopup: boolean }>(`${SET_SHOW_NRLINK_POPUP_ENDPOINT}`, {
                showNrlinkPopup: false,
            })
            enqueueSnackbar(
                formatMessage({
                    id: NRLINK_SUCCESS_SETUP_MESSAGE,
                    defaultMessage: NRLINK_SUCCESS_SETUP_MESSAGE,
                }),
                { autoHideDuration: 10000, variant: 'success' },
            )
            setIsNrLinkAuthorizeInProgress(false)
            history.push(`/my-houses/${currentHousing?.id}/contracts`)
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
        <Form onSubmit={onSubmit} defaultValues={meter ? { meterGuid: meter!.guid, nrlinkGuid: '' } : {}}>
            <div className="w-full flex justify-between items-center landscape:mt-10">
                <div className="portrait:flex-col landscape:flex-row h-full flex justify-center items-center w-full">
                    <div className="w-full mx-32">
                        <div className="hidden">
                            <TextField name="meterGuid" disabled label="Numéro de mon compteur" />
                        </div>
                        <TextField
                            name="nrlinkGuid"
                            label="№ d'identification nrLINK"
                            validateFunctions={[
                                requiredBuilder(),
                                regex(
                                    '^[0-9a-fA-F]{16}$',
                                    'Veuillez entrer un N° GUID valide (16 caractères, chiffre de 0 à 9, lettre de A à F, pas d’espace ni de tiret)',
                                ),
                            ]}
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <TypographyFormatMessage
                            variant="caption"
                            className="w-full text-center"
                            sx={{ color: textNrlinkColor }}
                        >
                            Vous pouvez trouver le № GUID de votre nrLINK sur:
                        </TypographyFormatMessage>
                        <div className="flex justify-between items-start mt-7 mb-5">
                            <div className="flex justify-between w-full items-center flex-col mb-5 mr-10 sm:mr-0">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mr-8 mb-5"
                                >
                                    <img src={nrLinkMain} alt="nrlink-img" />
                                </motion.div>
                                <TypographyFormatMessage
                                    variant="caption"
                                    className="text-center md:text-12"
                                    sx={{ color: textNrlinkColor }}
                                >
                                    Sous le socle de votre afficheur
                                </TypographyFormatMessage>
                            </div>
                            <div className="flex justify-between w-full items-center flex-col mb-5 mr-10 sm:mr-0">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mb-5 mr-8"
                                >
                                    <img src={nrLinkGUID} alt="nrlink-img" />
                                </motion.div>
                                <TypographyFormatMessage
                                    variant="caption"
                                    className="text-center md:text-12"
                                    sx={{ color: textNrlinkColor }}
                                >
                                    A l'allumage de votre afficheur
                                </TypographyFormatMessage>
                            </div>
                            <div className="flex justify-between w-full items-center flex-col mb-5 ">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mb-5 mr-8"
                                >
                                    <img src={nrLinkInfo} alt="nrlink-img" />
                                </motion.div>
                                <TypographyFormatMessage
                                    variant="caption"
                                    className="w-full text-center md:text-12"
                                    sx={{ color: textNrlinkColor }}
                                >
                                    Dans Menu/nrLINK
                                </TypographyFormatMessage>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ActionsNrLinkConnectionSteps activeStep={2} handleBack={handleBack} handleNext={() => {}} />
        </Form>
    )
}

export default LastStepNrLinkConnection
