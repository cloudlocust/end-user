import React, { useState } from 'react'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { ButtonLoader, MuiTextField as TextField } from 'src/common/ui-kit'
import { Form, requiredBuilder, email } from 'src/common/react-platform-components'
import { PhoneNumber } from 'src/common/ui-kit/form-fields/phoneNumber/PhoneNumber'
import { useIntl } from 'src/common/react-platform-translation'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { Button } from '@mui/material'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import { IUser } from 'src/modules/User'
import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const ProfileManagementForm = () => {
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const { isModifyInProgress, onSubmit } = useProfileManagement()
    const { formatMessage } = useIntl()
    const [isEdit, setIsEdit] = useState(false)
    const disabledField = !isEdit

    const formInitialValues = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
    }
    /**
     * Handler function to setIsEdit.
     */
    const toggleEditFormDisable = () => {
        setIsEdit((prevIsEdit) => !prevIsEdit)
    }

    return (
        <Form
            defaultValues={formInitialValues}
            onSubmit={async (data: IUser) => {
                await onSubmit(data)
                setIsEdit(false)
            }}
        >
            <div className="flex flex-col justify-center p-16 sm:p-24 md:p-32 ">
                <TextField
                    name="firstName"
                    label="Prénom"
                    validateFunctions={[requiredBuilder()]}
                    variant="outlined"
                    className="mb-20 mt-24 sm:mt-0"
                    disabled={disabledField}
                />
                <TextField
                    name="lastName"
                    label="Nom"
                    className="mb-20"
                    validateFunctions={[requiredBuilder()]}
                    disabled={disabledField}
                />
                <TextField
                    name="email"
                    label="Email"
                    className="mb-20"
                    validateFunctions={[requiredBuilder(), email()]}
                    disabled={disabledField}
                />
                <PhoneNumber
                    name="phone"
                    label="Numéro de téléphone"
                    className="mb-20"
                    type="tel"
                    sx={{ margin: '0 0 1.25rem 0' }}
                    validateFunctions={[requiredBuilder()]}
                    disabled={disabledField}
                />
                <GoogleMapsAddressAutoCompleteField
                    name="address"
                    validateFunctions={[requiredBuilder()]}
                    disabled={disabledField}
                />
                <div>
                    {isEdit ? (
                        <div>
                            <ButtonResetForm
                                initialValues={formInitialValues}
                                onClickButtonReset={toggleEditFormDisable}
                            />
                            <ButtonLoader
                                inProgress={isModifyInProgress}
                                variant="contained"
                                type="submit"
                                className="ml-8 mb-4 sm:mr-8 sm:mb-0"
                            >
                                {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                            </ButtonLoader>
                        </div>
                    ) : (
                        <Button variant={'contained'} className={'w-224 mx-auto mb-16'} onClick={toggleEditFormDisable}>
                            {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                        </Button>
                    )}
                </div>
            </div>
        </Form>
    )
}
