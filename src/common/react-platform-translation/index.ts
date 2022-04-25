import { IntlFormatters } from 'react-intl'
export * from './model'
export * from './TranslationProvider'
export { useIntl, injectIntl, FormattedMessage } from 'react-intl'

/**
 * TODO Document.
 */
export const LOAD_TRANSLATIONS = 'translationModel/loadLocale'
/**
 * Type of formatMessage from react-intl package.
 */
export type formatMessageType = IntlFormatters['formatMessage']
