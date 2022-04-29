/**
 * ResetPasswordForm Props.
 */
export interface ResetPasswordFormProps {
    /**
     * Token retrieved from URL query params.
     */
    token: string
}

/**
 * ResetPasswordData to be sent to the backend.
 */
export interface ResetPasswordData {
    /**
     * New password.
     */
    password: string
    /**
     * Token retrieved from URL query params.
     */
    token: string
}
