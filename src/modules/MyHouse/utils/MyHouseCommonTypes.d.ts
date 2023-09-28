/**
 * Scope types Enum.
 */
export enum ScopesTypesEnum {
    /**
     * Production.
     */
    PRODUCTION = 'production',
}

/**
 * Scopes Types.
 */
export interface ScopesAccessRightsType {
    /**
     * Scopes access rights.
     */
    scopes: ScopesTypesEnum[]
}
