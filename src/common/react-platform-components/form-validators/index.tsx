import { FormattedMessage } from 'src/common/react-platform-translation'
import isArray from 'lodash/isArray'
import React from 'react'
import * as yup from 'yup'
import { FieldValues, Message, Validate } from 'react-hook-form'
import dayjs from 'dayjs'
import { isValidPhoneNumber } from 'libphonenumber-js'

/**
 *  TODO Document.
 */
type CustomMessage = Message | JSX.Element
/**
 *  TODO Document.
 */
export type CustomValidateResult = ReturnType<Validate<any>> | CustomMessage | CustomMessage[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 *  TODO Document.
 */
type CustomValidate = Validate<any> | ((data: any) => CustomValidateResult)

/**
 *  TODO Document.
 */
export type EmailValidator = (errorMsg?: JSX.Element) => CustomValidate

/**
 * TODO Document.
 *
 * @description Validates the value as an email address.
 * @param {string} errorMsg  TODO Document.
 * @returns TODO Document.
 */
export const email: EmailValidator =
    (errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (!yup.string().email().isValidSync(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage id="L'email indiqué est invalide." defaultMessage="L'email indiqué est invalide." />
            )
        }
        return undefined
    }

/**
 *
 */
export type RequiredValidator = (errorMsg?: string | JSX.Element) => CustomValidate

/**
 * TODO Document.
 *
 * @description TODO Document.
 * @param {string} errorMsg TODO Document.
 * @returns TODO Document.
 */
export const requiredBuilder: RequiredValidator = (errorMsg) => {
    // The name of the function is important is it can be used by components like meterial ui textfield
    return function required(value: string | number): JSX.Element | string | undefined {
        if (typeof value === 'object' && value !== null && value !== undefined) {
            return undefined
        }
        if (!yup.string().required().isValidSync(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Champ obligatoire non renseigné"
                    defaultMessage="Champ obligatoire non renseigné"
                />
            )
        }
        return undefined
    }
}

/**
 *
 */
export type MinValidator = (length: number, errorMsg?: JSX.Element) => CustomValidate
/**
 * Set a minimum length limit for the string value.
 *
 * @param length TODO Document.
 * @param errorMsg TODO Document.
 * @returns TODO Document.
 */
export const min: MinValidator =
    (length: number, errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (!yup.string().min(length).isValidSync(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Le champ doit avoir au minimum {min} caractères"
                    defaultMessage="Le champ doit avoir au minimum {min} caractères"
                    values={{ min: length }}
                />
            )
        }
        return undefined
    }

/**
 *  TODO Document.
 */
export type MaxValidator = (length: number, errorMsg?: JSX.Element) => CustomValidate

/**
 * Set a maximum length limit for the string value.
 *
 * @param length  TODO Document.
 * @param errorMsg  TODO Document.
 * @returns  TODO Document.
 */
export const max: MaxValidator =
    (length: number, errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (!yup.string().max(length).isValidSync(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Le champ doit avoir au maximum {max} caractères"
                    defaultMessage="Le champ doit avoir au maximum {max} caractères"
                    values={{ max: length }}
                />
            )
        }
        return undefined
    }

/**
 * TODO Document.
 */
export type AcceptValidator = (errorMsg?: JSX.Element | string) => CustomValidate

/**
 *  TODO Document.
 *
 * @param {string} errorMsg  TODO Document.
 * @returns TODO Document.
 */
export const accept: AcceptValidator =
    (errorMsg?: JSX.Element | string) =>
    (value: boolean): JSX.Element | undefined | string => {
        if (!yup.boolean().isValidSync(value) || value === false) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage id="Il faut accepter les condition" defaultMessage="Il faut accepter les condition" />
            )
        }
        return undefined
    }

/**
 *
 */
export type IsPositiveValidator = (errorMsg?: JSX.Element) => CustomValidate

/**
 * TODO Document.
 *
 * @description Validates the value to be a positive number.
 * @param {string} errorMsg  TODO Document.
 * @returns TODO Document.
 */
export const isPositive: IsPositiveValidator =
    (errorMsg?: JSX.Element) =>
    (value: number): JSX.Element | undefined => {
        if (!yup.number().positive().isValidSync(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="La valeur doit être supérieur à 0"
                    defaultMessage="La valeur doit être supérieur à 0"
                />
            )
        }
        return undefined
    }

/**
 *  TODO Document.
 */
export type EqualValidator = (formValue: string | number, errorMsg?: JSX.Element) => CustomValidate

/**
 *   TODO Document.
 * Validator that insures that the provided value formValue
 * is equal to the value of the field.
 *
 * @param {string} formValue  TODO Document.
 * @param {string} errorMsg  TODO Document.
 * @returns TODO Document.
 */
export const equal: EqualValidator =
    (formValue: string | number, errorMsg?: JSX.Element) =>
    (value: string | number): JSX.Element | undefined => {
        const isValid = yup
            .string()
            .test('equal', (v) => v === formValue)
            .isValidSync(value)

        if (!isValid) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage id="Les valeurs ne sont pas égales" defaultMessage="Les valeurs ne sont pas égales" />
            )
        }
        return undefined
    }

/**
 *
 */
export type UrlValidator = (errorMsg?: JSX.Element) => CustomValidate

/**
 * Validates that the value is a url.
 *
 * @param {string} errorMsg  TODO Document.
 * @returns  TODO Document.
 */
export const url: UrlValidator =
    (errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (!yup.string().url().isValidSync(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage id="L'url indiqué est invalide" defaultMessage="L'url indiqué est invalide" />
            )
        }
        return undefined
    }

/**
 * DateFormatValidator type.
 */
export type DateFormatValidator = (format?: string, errorMsg?: JSX.Element) => CustomValidate

/**
 * Validates that the value is a valid date format.
 *
 * @param {string} format Format to check with.
 * @param errorMsg FormattedMessage contain the error message.
 * @returns Date format validator function.
 */
export const dateFormat: DateFormatValidator =
    (format: string = 'YYYY-MM-DD', errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (!dayjs(value, format).isValid()) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage id="Invalid date format" defaultMessage="Invalid date format" />
            )
        }
        return undefined
    }

/**
 * MinDateValidator type.
 */
export type MinDateValidator = (formValue: string, errorMsg?: JSX.Element) => CustomValidate

/**
 * Validates that the value is greater thana specific date.
 *
 * @param {string} formValue Min date with YYYY-MM-DD format.
 * @param errorMsg  FormattedMessage contain the error message.
 * @returns  Min date validator function.
 */
export const minDate: MinDateValidator =
    (formValue: string, errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        const parsedFormValue = dayjs(formValue)
        if (!yup.date().min(parsedFormValue).isValidSync(dayjs(value))) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Date should not be before {minDate}"
                    defaultMessage="Date should not be before {minDate}"
                    values={{ minDate: parsedFormValue.format('DD/MM/YYYY') }}
                />
            )
        }
        return undefined
    }

/**
 * MaxDateValidator type.
 */
export type MaxDateValidator = (formValue: string, errorMsg?: JSX.Element) => CustomValidate

/**
 * Validates that the value is less then a specific date.
 *
 * @param {string} formValue Max date with yyyy-MM-DD format.
 * @param errorMsg  FormattedMessage contain the error message.
 * @returns  Max date validator function.
 */
export const maxDate: MinDateValidator =
    (formValue: string, errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        const parsedFormValue = dayjs(formValue)
        if (!yup.date().max(parsedFormValue).isValidSync(dayjs(value))) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Date should not be after {maxDate}"
                    defaultMessage="Date should not be after {maxDate}"
                    values={{ maxDate: parsedFormValue.format('DD/MM/YYYY') }}
                />
            )
        }
        return undefined
    }

/**
 * PhoneNumberValidator type.
 */
export type PhoneNumberValidator = (errorMsg?: JSX.Element) => CustomValidate

/**
 * Validates that the value is valid phone number or not.
 *
 * @param errorMsg FormattedMessage contain the error message.
 * @returns Phone number validator function.
 */
export const phoneNumber: PhoneNumberValidator =
    (errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (value && !isValidPhoneNumber(value)) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Le numéro de téléphone indiqué est invalide."
                    defaultMessage="Le numéro de téléphone indiqué est invalide."
                />
            )
        }
        return undefined
    }

/**
 *  TODO Document.
 */
type Validation =
    | EmailValidator
    | RequiredValidator
    | MinValidator
    | MaxValidator
    | AcceptValidator
    | IsPositiveValidator
    | EqualValidator
    | UrlValidator
    | DateFormatValidator
    | MinDateValidator
    | MaxDateValidator
    | PhoneNumberValidator

/**
 *  TODO Document.
 */
export type FieldValidate = Array<ReturnType<Validation>>

// We use this function to use multiple validator
// for example validators([required(), email()])
// we are returned the first error obtained
/**
 * TODO Document.
 *
 * @param items TODO Document.
 * @returns   TODO Document.
 */
export const validators =
    (items: FieldValidate) =>
    (value: FieldValues): CustomValidateResult => {
        if (!isArray(items)) {
            throw Error('validators params must be array')
        }

        for (const item of items) {
            const error = item(value)
            if (error) {
                return error
            }
        }
    }

/**
 * Validates that the value is a url.
 *
 * @param {React.RefObject} ref  TODO Document.
 * @param {string} errorMsg  TODO Document.
 * @returns  TODO Document.
 */
export const repeatPassword =
    (ref: React.RefObject<any>, errorMsg?: JSX.Element) =>
    (value: string): JSX.Element | undefined => {
        if (value !== ref.current.value) {
            return errorMsg ? (
                errorMsg
            ) : (
                <FormattedMessage
                    id="Les mot de passes ne correspondent pas."
                    defaultMessage="Les mot de passes ne correspondent pas."
                />
            )
        }
        return undefined
    }
