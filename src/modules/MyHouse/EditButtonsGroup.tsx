import { Button } from '@mui/material'
import { useIntl } from 'react-intl'
import { ButtonLoader } from 'src/common/ui-kit'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import { FieldValues } from 'react-hook-form'
import EditIcon from '@mui/icons-material/Edit'
/**
 * Interface for Edit Button Group.
 */
interface IEditButtonsGroup {
    /**
     * Is it Edit mode.
     */
    isEdit: boolean
    /**
     * Function to enable form.
     */
    enableForm: () => void
    /**
     * Function to disable form.
     */
    disableEdit: () => void
    /**
     * Initial values.
     */
    formInitialValues: FieldValues
    /**
     * Progress Status.
     */
    inProgress?: boolean
}
/**
 * EditButtonsGroup consist of modify, cancel and save buttons.
 *
 * @param param0 N/A.
 * @param param0.isEdit Is it Edit mode.
 * @param param0.enableForm Function to enable form.
 * @param param0.formInitialValues Function to disable form.
 * @param param0.disableEdit Initial values.
 * @param param0.inProgress Loading indicator.
 * @returns EditButtonsGroup.
 */
export const EditButtonsGroup = ({
    isEdit,
    enableForm,
    formInitialValues,
    disableEdit,
    inProgress,
}: IEditButtonsGroup) => {
    const { formatMessage } = useIntl()
    return (
        <div className="flex my-10 justify-end w-full">
            {isEdit ? (
                <>
                    <ButtonResetForm initialValues={formInitialValues} onClickButtonReset={disableEdit} />
                    <ButtonLoader variant="contained" type="submit" className="ml-16" inProgress={inProgress}>
                        {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                    </ButtonLoader>
                </>
            ) : (
                <Button variant="contained" onClick={enableForm} endIcon={<EditIcon />}>
                    {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                </Button>
            )}
        </div>
    )
}
