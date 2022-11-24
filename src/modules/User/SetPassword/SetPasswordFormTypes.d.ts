/**
 * Type onSubmitSetPasswordData, data received from submitting SetPasswordForm.
 */
export interface onSubmitSetPasswordData {
    /**
     * New password.
     */
    password: string
    /**
     * Repeat New password.
     */
    repeatPwd: string
    /**
     * Rgpd checkbox.
     */
    rgpdCheckbox: boolean
    /**
     * Sge checkbox.
     */
    sgeConsentCheckbox: boolean
}
