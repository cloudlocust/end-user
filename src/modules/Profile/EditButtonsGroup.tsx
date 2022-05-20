import { Button } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import { ButtonLoader } from 'src/common/ui-kit'

interface IEditButtonsGroup {
    isEdit: boolean
    onSubmit: (data: any) => void
    enableForm: () => void
}

export const EditButtonsGroup = ({ isEdit, onSubmit, enableForm }: IEditButtonsGroup) => {
    const { formatMessage } = useIntl()
    return (
        <div className="flex justify-center mt-10">
            {!isEdit ? (
                <div className=" w-full ">
                    {/* <ButtonResetForm
                initialValues={formInitialValues}
                onClickButtonReset={toggleEditFormDisable}
                className="mr-16"
            /> */}
                    <ButtonLoader variant="contained" type="submit" onClick={onSubmit}>
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
