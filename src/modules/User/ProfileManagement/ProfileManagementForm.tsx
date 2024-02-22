import { useState } from 'react'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { ButtonLoader, MuiTextField as TextField } from 'src/common/ui-kit'
import { Form, requiredBuilder, email, regex } from 'src/common/react-platform-components'
import { PhoneNumber } from 'src/common/ui-kit/form-fields/phoneNumber/PhoneNumber'
import { useIntl } from 'src/common/react-platform-translation'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { Button } from '@mui/material'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import { IUser } from 'src/modules/User'
import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
import { ChangePassword } from 'src/modules/User/ChangePassword/ChangePassword'
import { isProfessionalRegisterFeature } from 'src/modules/User/Register/RegisterConfig'
import { sirenFieldRegex } from 'src/modules/User/Register/utils'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const ProfileManagementForm = () => {
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const { isLoadingInProgress, updateProfile } = useProfileManagement()
    const { formatMessage } = useIntl()
    const [isEdit, setIsEdit] = useState(false)
    const disabledField = !isEdit

    const formInitialValues = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        siren: user?.siren,
        companyName: user?.companyName,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
        birthdate: user?.birthdate,
    }
    /**
     * Handler function to setIsEdit.
     */
    const toggleEditFormDisable = () => {
        setIsEdit((prevIsEdit) => !prevIsEdit)
    }

    return (
        <>
            <Form
                defaultValues={formInitialValues}
                onSubmit={async (data: IUser) => {
                    await updateProfile(data)
                    setIsEdit(false)
                }}
            >
                <div className="flex flex-col justify-center p-16 sm:p-24 md:p-32 ">
                    {isProfessionalRegisterFeature && (
                        <>
                            <TextField
                                name="companyName"
                                label="Raison sociale"
                                validateFunctions={[requiredBuilder()]}
                                variant="outlined"
                                style={{ margin: '0 0 1.5rem 0' }}
                                disabled={disabledField}
                            />
                            <TextField
                                name="siren"
                                label="Siren"
                                validateFunctions={[
                                    requiredBuilder(),
                                    regex(sirenFieldRegex, 'Le numéro Siren doit être composé de 9 chiffres'),
                                ]}
                                variant="outlined"
                                style={{ marginBottom: '1.5rem' }}
                                disabled={disabledField}
                            />
                        </>
                    )}
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
                    <DatePicker
                        name="birthdate"
                        label={formatMessage({
                            id: 'Date de naissance',
                            defaultMessage: 'Date de naissance',
                        })}
                        disabled={disabledField}
                        textFieldProps={{
                            style: {
                                margin: '0 0 2rem 0',
                            },
                        }}
                    />
                    <div className="flex flex-row justify-center sm:justify-between flex-wrap">
                        {isEdit ? (
                            <div className="flex justify-start mb-16 sm:mb-0">
                                <ButtonResetForm
                                    initialValues={formInitialValues}
                                    onClickButtonReset={toggleEditFormDisable}
                                />
                                <ButtonLoader
                                    inProgress={isLoadingInProgress}
                                    variant="contained"
                                    type="submit"
                                    className=" w-128 ml-8 mb-4 sm:mr-8 sm:mb-0"
                                >
                                    {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                                </ButtonLoader>
                            </div>
                        ) : (
                            <div className="flex justify-start mb-16 sm:mb-0">
                                <Button
                                    variant={'contained'}
                                    className={'w-256 mx-auto'}
                                    onClick={toggleEditFormDisable}
                                >
                                    {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                                </Button>
                            </div>
                        )}
                        <div className="flex flex-row justify-center">
                            <ChangePassword />
                        </div>
                    </div>
                </div>
            </Form>
        </>
    )
}
