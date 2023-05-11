import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import CardActions from '@mui/material/CardActions'
import { Form, requiredBuilder, regex } from 'src/common/react-platform-components'

import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { Checkbox } from '@mui/material'

import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'
import Button from '@mui/material/Button'

/**
 * This is a card for adding Housing.
 *
 * @param props Props.
 * @param props.onSuccess Close Form.
 * @param props.closeModal Close Modal.
 * @returns Form To Add Housing.
 */
export const EditConsentForm = ({
    onSuccess,
    closeModal,
}: /**
 * Props Typing.
 */
{
    /**
     * Function on success.
     */
    onSuccess: () => void

    /**
     *
     */
    closeModal: () => void
}) => {
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState<boolean>(false)
    const [revokeConsent, setRevokeConsent] = React.useState<boolean>(false)

    const TXT_EDIT_NR_LINK_CONSENT = formatMessage({
        id: 'Numéro de nrLINK',
        defaultMessage: 'Numéro de nrLINK',
    })

    const TXT_CONSENT_CHECKBOX = formatMessage({
        id: 'Annuler mon ancien consentement nrLINK et effacer ses données',
        defaultMessage: 'Annuler mon ancien consentement nrLINK et effacer ses données',
    })

    /**
     * Handle Checkbox.
     *
     * @param event DOM Event.
     */
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRevokeConsent(event.target.checked)
    }

    const { addElement: addHousing, loadingInProgress } = useHousingList()
    return (
        <Form
            onSubmit={async (data: defaultValueType) => {
                await addHousing(data)
                onSuccess()
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
                        <Checkbox
                            onChange={handleCheckboxChange}
                            name="revokeConsent"
                            checked={revokeConsent}
                            data-testid={`checkbox-revokeConsent`}
                        />
                        <Typography className="whitespace-normal">{TXT_CONSENT_CHECKBOX}</Typography>
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
