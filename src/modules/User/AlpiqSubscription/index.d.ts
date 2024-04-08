import { UserAddressType } from '../model'

/**
 * Indicate if when we first connect, we should show the form to enter the PDL before the popup registration.
 *
 * It's in unusual position because it creates a problem when put in AlpiqSubscriptionConfig.
 */
export const isAlpiqSubscriptionForm = window._env_.REACT_APP_ALPIQ_SUBSCRIPTION_FORM_STATE === 'enabled'

/**
 * Enum for Energy Provider Subscription connection steps.
 */
export enum AlpiqSubscriptionStepsEnum {
    /**
     * 1st step, Renseigner mon compteur linky.
     */
    firstStep = 0,
    /**
     * 2nd step, Donner mon consentement SGE.
     */
    secondStep = 1,
    /**
     * 3rd step, Get estimation for contract.
     */
    thridStep = 2,
    /**
     * Forth Step, Facturation.
     */
    forthStep = 3,
    /**
     * Fifith Step.
     */
    fifthStep = 4,
}

/**
 * Response for Alpiq Meter Eligibility.
 */
export interface IAlpiqMeterEligibiltyResponse {
    /**
     * Is meter eligible for alpiq provider.
     */
    isMeterEligible: boolean
}

/**
 * Response for alpiq monthly subscription estimation response.
 */
export interface IApliqMonthlySubscriptionEstimationResponse {
    /**
     * Monthly subscription estimation.
     */
    monthlySubscriptionEstimation: number
}

/**
 * Facturation Data.
 */
export type AlpiqFacturationDataType = /**
 */ {
    /**
     * Mode facturation.
     */
    modeFacturation: string
    /**
     * Jour prelevement.
     */
    jourPrelevement: number
    /**
     * Date debut de contrat.
     */
    dateDebutContrat: string
    /**
     * Address facturation.
     */
    addressFacturation: UserAddressType
    /**
     * Iban.
     */
    iban: string
    /**
     * Nom iban.
     */
    nomAssocieIban: string
    /**
     * Prenom iban.
     */
    prenomAssocieIban: string
}

/**
 * Alpiq subscription specs.
 */
export type AlpiqSubscriptionSpecsType = /**
 */ {
    /**
     * Puissance.
     */
    puissanceSouscrite: number
    /**
     * Option Tarifaire.
     */
    optionTarifaire: 'BASE' | 'HPHC'
    /**
     * Mensualite.
     */
    mensualite: number
}

/**
 * ICreate Alpiq subscription data.
 */
export type CreateAlpiqSubscriptionDataType = AlpiqFacturationDataType & AlpiqSubscriptionSpecsType

/**
 * Alpiq Subscription creation response.
 */
export interface ICreateAlpiqSubscriptionResponse {
    /**
     * Token.
     */
    token: string
    /**
     * Status Message.
     */
    message: string
}
