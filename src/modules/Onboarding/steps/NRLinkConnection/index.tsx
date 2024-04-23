import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, Typography } from '@mui/material'
import { ButtonLoader } from 'src/common/ui-kit'
import { useSnackbar } from 'notistack'
import { useIntl } from 'src/common/react-platform-translation'
import { Form, regex, requiredBuilder } from 'src/common/react-platform-components'
import { Step } from 'src/modules/Onboarding/components/Step'
import { TextField } from 'src/modules/Onboarding/components/TextField'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { LoadingNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { SET_SHOW_NRLINK_POPUP_ENDPOINT } from 'src/modules/nrLinkConnection/NrLinkConnection'
import {
    NRLinkConnectionProps,
    NRLinkFormSubmitParams,
} from 'src/modules/Onboarding/steps/NRLinkConnection/NRLinkConnection.types'
import nlinkGuid from 'src/assets/images/content/onboarding/nlinkGuid.png'

const GUID_FIXED_PART = '0CA2F40000'

/**
 * NRLinkConnection step used to set the nrlink guid.
 *
 * @param root0 Props.
 * @param root0.housingId Housing id.
 * @param root0.onNext Callback on next step.
 * @returns JSX Element.
 */
export const NRLinkConnection = ({ housingId, onNext }: NRLinkConnectionProps) => {
    const [isNrLinkAuthorizeInProgress, setIsNrLinkAuthorizeInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const containerRef = useRef<HTMLDivElement>(null)

    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param formData FormData.
     * @param formData.guidVariantPart The variant part of NrLink GUID.
     */
    const onSubmit = async (formData: NRLinkFormSubmitParams) => {
        try {
            setIsNrLinkAuthorizeInProgress(true)
            await axios.post(`${API_RESOURCES_URL}/nrlink/authorize`, {
                nrlinkGuid: `${GUID_FIXED_PART}${formData.guidVariantPart}`,
                networkIdentifier: housingId,
            })
            // Make the onboarding not showing again after the nrLINK is configured
            await axios.patch(SET_SHOW_NRLINK_POPUP_ENDPOINT, {
                showNrlinkPopup: false,
            })
            enqueueSnackbar(
                formatMessage({
                    id: 'Votre nrLINK a été configuré avec succès.',
                    defaultMessage: 'Votre nrLINK a été configuré avec succès.',
                }),
                { autoHideDuration: 10000, variant: 'success' },
            )
            setIsNrLinkAuthorizeInProgress(false)
            onNext()
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

    const clientWidth = containerRef.current?.clientWidth || 300

    return (
        <Step
            title={formatMessage(
                {
                    id: '{step}/{totalStep}: La rencontre !',
                    defaultMessage: '{step}/{totalStep}: La rencontre !',
                },
                { step: 2, totalStep: 4 },
            )}
            content={
                <Form
                    aria-label="NRLinkConnectionForm"
                    onSubmit={onSubmit}
                    defaultValues={{ guidVariantPart: '' }}
                    style={{ display: 'inherit', flexDirection: 'inherit', alignItems: 'inherit' }}
                >
                    <Typography variant="subtitle1" className="mt-44" sx={{ color: 'primary.main' }}>
                        {formatMessage({
                            id: 'Afin de suivre votre consommation électrique à la minute dans l’application, saisissez ici les derniers caractères du N° de votre nrLINK :',
                            defaultMessage:
                                'Afin de suivre votre consommation électrique à la minute dans l’application, saisissez ici les derniers caractères du N° de votre nrLINK :',
                        })}
                    </Typography>
                    <div className="flex items-baseline w-full justify-center mt-6" ref={containerRef}>
                        <Typography variant="subtitle1" className="text-center mt-12" sx={{ color: 'primary.main' }}>
                            {GUID_FIXED_PART}
                        </Typography>
                        <TextField
                            name="guidVariantPart"
                            placeholder="8A23C7"
                            validateFunctions={[
                                requiredBuilder(),
                                regex(
                                    '^[0-9a-fA-F]{6}$',
                                    'Veuillez entrer un N° GUID valide (16 caractères, chiffre de 0 à 9, lettre de A à F, pas d’espace ni de tiret)',
                                ),
                            ]}
                            inputProps={{ maxLength: 6, style: { height: 15 } }}
                            className="w-88 ml-8 mr-8"
                            label=""
                            fullWidth={true}
                            sx={{
                                // display the error message in the full width of device
                                '.MuiFormHelperText-root.Mui-error': {
                                    width: `${clientWidth}px`,
                                    marginLeft: `${-clientWidth / 2}px`,
                                    marginRight: `${clientWidth / 2}px`,
                                    textAlign: 'center',
                                },
                            }}
                        />
                    </div>
                    <Typography variant="subtitle1" className="text-center mt-4" sx={{ color: 'grey.500' }}>
                        {formatMessage({
                            id: 'Votre N° de nrLINK se trouve en dessous de l’écran.',
                            defaultMessage: 'Votre N° de nrLINK se trouve en dessous de l’écran.',
                        })}
                    </Typography>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex w-320 rounded-16 mt-10"
                    >
                        <img src={nlinkGuid} className="rounded-32" alt="nrlink guid" />
                    </motion.div>

                    <div className="mt-16 self-end mb-76">
                        <ButtonLoader
                            variant="contained"
                            className="w-128 rounded-8"
                            disableElevation={true}
                            disableRipple={true}
                            inProgress={isNrLinkAuthorizeInProgress}
                            type="submit"
                        >
                            {formatMessage({ id: 'Suivant', defaultMessage: 'Suivant' })}
                        </ButtonLoader>
                    </div>
                    <Dialog open={isNrLinkAuthorizeInProgress}>
                        <DialogContent>
                            <LoadingNrLinkConnectionSteps />
                        </DialogContent>
                    </Dialog>
                </Form>
            }
        />
    )
}
