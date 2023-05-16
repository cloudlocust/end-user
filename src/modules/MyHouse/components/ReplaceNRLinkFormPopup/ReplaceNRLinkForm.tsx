import React from 'react'
import { Card, Checkbox } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { useIntl } from 'react-intl'
import CardActions from '@mui/material/CardActions'
import { Form, requiredBuilder, regex } from 'src/common/react-platform-components'

import FormControlLabel from '@mui/material/FormControlLabel'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import Button from '@mui/material/Button'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import {
    MSG_REPLACE_NRLINK_MODAL_TITLE,
    MSG_REPLACE_NRLINK_CLEAR_OLD_DATA,
} from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkFormPopupConfig'
import { useReplaceNRLinkHook } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/hooks/replaceNrLinkHook'
import {
    IReplaceNRLinkFormProps,
    IReplaceNRLinkPayload,
} from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkFormPopup'

/**
 * Form to replace current nrLINK with another nrLINK.
 *
 * @param root0 N/A.
 * @param root0.houseId ID of the house, where we need to replace the nrLINK.
 * @param root0.meterGuid Id of the Meter used to make a new consent on a nrLINK.
 * @param root0.oldNRLinkGuid Id of the current nrLINK inside the house.
 * @param root0.onSuccess Callback when action is done with success.
 * @param root0.closeModal Callback to close Modal when we click on "Cancel".
 * @returns JSX.Element - Form.
 */
export const ReplaceNRLinkForm = ({
    houseId,
    meterGuid,
    oldNRLinkGuid,
    onSuccess,
    closeModal,
}: IReplaceNRLinkFormProps) => {
    const { formatMessage } = useIntl()
    const { loadingInProgress, replaceNRLink } = useReplaceNRLinkHook(houseId)
    const [clearOldData, setClearDataStatus] = React.useState<boolean>(false)

    /**
     * Handle click on the Checkbox (toggle).
     */
    function handleCheckboxChange() {
        setClearDataStatus((clearOldData) => !clearOldData)
    }

    /**
     * Replace old nrLINK with new nrLINK.
     *
     * @param newNRLinkGuid The ID of the new nrLINK that will replace the old.
     */
    async function updateNRLinkId(newNRLinkGuid: string) {
        let body: IReplaceNRLinkPayload = {
            old_nrlink_guid: oldNRLinkGuid,
            new_nrlink_guid: newNRLinkGuid,
            meter_guid: meterGuid,
        }

        if (clearOldData) {
            body.clear_data = true
        }

        try {
            await replaceNRLink(body)
            onSuccess()
        } catch {}
    }

    return (
        <Form
            aria-label="ReplaceNRLinkForm"
            onSubmit={async (data: // eslint-disable-next-line
            {
                /**
                 * Id of the new nrLINK to use.
                 */
                nrlinkGuid: string
            }) => {
                await updateNRLinkId(data.nrlinkGuid)
            }}
        >
            <Card className="relative cursor-pointer flex-wrap rounded-16">
                <CardContent>
                    <div className="flex justify-between">
                        <div className="flex items-center jutsify-center">
                            <TypographyFormatMessage className="font-bold text-16 whitespace-normal">
                                {MSG_REPLACE_NRLINK_MODAL_TITLE}
                            </TypographyFormatMessage>
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
                            label={<span className="flex text-13 font-bold">{MSG_REPLACE_NRLINK_CLEAR_OLD_DATA}</span>}
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
