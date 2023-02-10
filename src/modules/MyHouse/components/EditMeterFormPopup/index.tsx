import { Card, CardContent, Modal, Button, CardActions } from '@mui/material'
import { useIntl } from 'react-intl'
import { Form, requiredBuilder, min, max } from 'src/common/react-platform-components'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { editMeterInputType } from 'src/modules/Meters/Meters.d'
import { EditMeterFormPopupProps } from 'src/modules/MyHouse/components/EditMeterFormPopup/editMeterFormPopup.d'

/**
 * Edit meter popup component.
 *
 * @param props Edit meter form popup props.
 * @returns JSX for edit meter form popup.
 */
export const EditMeterFormPopup = (props: EditMeterFormPopupProps) => {
    const { onClose, open, editMeter, houseId, loadHousinglist, loadingInProgress, foundHousing } = props
    const { formatMessage } = useIntl()
    return (
        <Modal open={open} onClose={onClose}>
            <Form
                onSubmit={async (values: editMeterInputType) => {
                    await editMeter(parseInt(houseId), values)
                    loadHousinglist()
                    onClose()
                }}
                defaultValues={{
                    guid: foundHousing?.meter?.guid,
                }}
            >
                <div
                    className="flex justify-center absolute top-1/2 left-1/2"
                    style={{ transform: 'translate(-50%, -50%)', width: '300px' }}
                >
                    <Card className="relative cursor-pointer flex-wrap rounded-16">
                        <CardContent className="mt-10">
                            <TextField
                                name="guid"
                                label="Numéro du PDL ou PRM"
                                placeholder={formatMessage({
                                    id: 'Ex: 12345678912345',
                                    defaultMessage: 'Ex: 12345678912345',
                                })}
                                validateFunctions={[requiredBuilder(), min(14), max(14)]}
                                inputProps={{ maxLength: 14 }}
                            />
                        </CardContent>
                        <CardActions className="flex items-center content-center justify-center mb-10">
                            <Button variant="outlined" className="mr-4" onClick={onClose}>
                                {formatMessage({
                                    id: 'Annuler',
                                    defaultMessage: 'Annuler',
                                })}
                            </Button>
                            <ButtonLoader
                                inProgress={loadingInProgress}
                                variant="contained"
                                type="submit"
                                className="ml-4"
                            >
                                {formatMessage({
                                    id: 'Modifier',
                                    defaultMessage: 'Modifier',
                                })}
                            </ButtonLoader>
                        </CardActions>
                    </Card>
                </div>
            </Form>
        </Modal>
    )
}
