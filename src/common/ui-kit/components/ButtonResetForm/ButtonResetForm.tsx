import Button from '@mui/material/Button'
import { useFormContext, FieldValues } from 'react-hook-form'
import { useIntl } from 'react-intl'

/**
 * ButtonReset Component for applying the reset on the Form.
 *
 * @param props N/A.
 * @param props.initialValues Initial Values of the form when reset.
 * @param props.onClickButtonReset To disable edit of form when reset.
 * @returns ButtonReset.
 */
export const ButtonResetForm = ({
    initialValues,
    onClickButtonReset,
}: /**
 *
 */
{
    /**
     *
     */
    initialValues: FieldValues
    /**
     *
     */
    onClickButtonReset?: () => void
}) => {
    const { reset } = useFormContext()
    const { formatMessage } = useIntl()

    return (
        <Button
            variant="outlined"
            className="mb-4 sm:mr-8 sm:mb-0"
            onClick={() => {
                reset(initialValues)
                if (onClickButtonReset) onClickButtonReset()
            }}
        >
            {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
        </Button>
    )
}
