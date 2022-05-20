import { Button } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import { ButtonLoader } from 'src/common/ui-kit'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'

interface IEditButtonsGroup {
    isEdit: boolean
    // onSubmit: (data: any) => void
    enableForm: () => void
    formInitialValues: {}
    disableEdit: () => void
}

export const EditButtonsGroup = ({
    isEdit,
    // onSubmit,
    enableForm,
    formInitialValues,
    disableEdit,
}: IEditButtonsGroup) => {
    const { formatMessage } = useIntl()
    return (
        <div className="flex justify-center mt-10">
            {isEdit ? (
                <div className=" w-full ">
                    <ButtonResetForm initialValues={formInitialValues} onClickButtonReset={disableEdit} />
                    <ButtonLoader variant="contained" type="submit" className="ml-16">
                        {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                    </ButtonLoader>
                </div>
            ) : (
                <div className="w-full ">
                    <Button variant="contained" onClick={enableForm}>
                        {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                    </Button>
                </div>
            )}
        </div>
    )
}
