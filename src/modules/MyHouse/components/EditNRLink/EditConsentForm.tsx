import React from 'react'
import { Card, Checkbox } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import CardActions from '@mui/material/CardActions'
import { Form, requiredBuilder, regex, axios } from 'src/common/react-platform-components'

import { useSnackbar } from 'notistack'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import Button from '@mui/material/Button'
import { NRLINK_CONSENT_API } from 'src/modules/Consents/consentsHook'

// eslint-disable-next-line jsdoc/require-jsdoc
type IFormDatas = {
    /**
     * UUID of the new nrLINK.
     */
    nrlinkGuid: string
}

/**
 * Form to replace current nrLINK with another nrLINK.
 *
 * @param root0 N/A.
 * @param root0.houseId ID of the house, where we need to replace the nrLINK.
 * @param root0.onSuccess Callback when action is done with success.
 * @param root0.closeModal Callback to close Modal when we click on "Cancel".
 * @returns JSX.Element - Form.
 */
export const EditConsentForm = ({
    houseId,
    onSuccess,
    closeModal,
}: /**
 * Props Typing.
 */
{
    /**
     * Callback when action is done with success.
     */
    onSuccess: () => void

    /**
     * Callback to close Modal when we click on "Cancel".
     */
    closeModal: () => void

    /**
     * ID of the house, where we need to replace the nrLINK.
     */
    houseId: string
}) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState<boolean>(false)
    const [clearOldData, setClearDataStatus] = React.useState<boolean>(false)
    const [loadingInProgress, setLoadingStatus] = React.useState<boolean>(false)

    /**
     * Texts Components.
     */
    const TXT_EDIT_NR_LINK_CONSENT = formatMessage({
        id: 'Numéro de nrLINK',
        defaultMessage: 'Numéro de nrLINK',
    })

    const TXT_CONSENT_CHECKBOX = formatMessage({
        id: 'Annuler mon ancien consentement nrLINK et effacer ses données',
        defaultMessage: 'Annuler mon ancien consentement nrLINK et effacer ses données',
    })

    /**
     * Handle click on the Checkbox (toggle).
     */
    function handleCheckboxChange() {
        setClearDataStatus((clearOldData) => !clearOldData)
    }

    /**
     * Replace old nrLINK with new nrLINK.
     *
     * @param newNRLinkId The ID of the new nrLINK that will replace the old.
     */
    async function updateNRLinkId(newNRLinkId: string) {
        setLoadingStatus(true)
        try {
            let body: any = { id: newNRLinkId }
            if (clearOldData) body.clear_data = true

            await axios.patch(`${NRLINK_CONSENT_API}/${houseId}`, body)

            enqueueSnackbar(
                formatMessage({
                    id: 'nrLINK modifié avec succès',
                    defaultMessage: 'nrLINK modifié avec succès',
                }),
                { variant: 'success' },
            )

            onSuccess()
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la modification de votre nrLINK',
                    defaultMessage: 'Erreur lors de la modification de votre nrLINK',
                }),
                { variant: 'error' },
            )
        }
        setLoadingStatus(false)
    }

    return (
        <Form
            aria-label="EditConsentForm"
            onSubmit={async (data: IFormDatas) => {
                await updateNRLinkId(data.nrlinkGuid)
            }}
        >
            <Card
                className="relative cursor-pointer flex-wrap rounded-16"
                onMouseOver={() => setRaisedState(true)}
                onMouseOut={() => setRaisedState(false)}
                raised={raisedState}
            >
                <CardContent>
                    <div className="flex justify-between">
                        <div className="flex items-center jutsify-center">
                            <Typography className="font-bold text-16 whitespace-normal">
                                {TXT_EDIT_NR_LINK_CONSENT}
                            </Typography>
                        </div>
                    </div>

                    <Divider className="my-16" />

                    <TextField
                        name="nrlinkGuid"
                        label="Nouveau № d'identification nrLINK"
                        validateFunctions={[
                            requiredBuilder(),
                            regex(
                                '^[0-9a-fA-F]{16}$',
                                'Veuillez entrer un N° GUID valide (16 caractères, chiffre de 0 à 9, lettre de A à F, pas d’espace ni de tiret)',
                            ),
                        ]}
                        placeholder="Ex: 0CA2F400008A4F86"
                    />

                    <div className="flex flex-row">
                        <FormControlLabel
                            control={
                                <Checkbox defaultChecked={false} onChange={handleCheckboxChange} color="primary" />
                            }
                            label={<span className="flex text-13 font-bold">{TXT_CONSENT_CHECKBOX}</span>}
                            labelPlacement="end"
                        />
                    </div>
                </CardContent>
                <CardActions className="flex items-center content-center justify-center">
                    <Button variant="outlined" className="mb-4 sm:mr-8 sm:mb-0" onClick={closeModal}>
                        {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                    </Button>
                    <ButtonLoader inProgress={loadingInProgress} type="submit" size="large" variant="contained">
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </ButtonLoader>
                </CardActions>
            </Card>
        </Form>
    )
}
