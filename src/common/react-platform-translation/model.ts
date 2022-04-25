import { RootModel } from 'src/models'
import { axios } from 'src/common/react-platform-components'
import Cookies from 'universal-cookie'
import { API_BASE_URL, DEFAULT_LOCALE, STATIC_PATH } from 'src/configs'
import { createModel } from '@rematch/core'

// export interface TransactionRootModel extends Models<TransactionRootModel> {
//     translationModel: typeof translationModel
// }

/**
 * TODO Document.
 */
export type ILocale = 'fr' | 'en' | 'de' | 'gr' | 'jp' | 'pt' | 'ru' | 'es' | 'sv' | 'tr'
/**
 * TODO Document.
 */
export type ITranslationData =
    /**
     *
     */
    /**
     *
     */ /**
     *
     */
    { [key: string]: string }

/**
 * TODO Document.
 */
export interface ITransltionState {
    /**
     * TODO Document.
     */
    locale: ILocale
    /**
     * TODO Document.
     */
    translations: ITranslationData | null
}

const defaultState: ITransltionState = {
    locale: DEFAULT_LOCALE as ILocale,
    translations: null,
}

/**
 * TODO Document.
 */
export const translationModel = createModel<RootModel>()({
    /**
     * TODO Document.
     *
     * @param dispatch TODO Document.
     * @returns  TODO Document.
     */
    effects: (dispatch) => ({
        /**
         * TODO Document.
         */
        async loadLocale(): Promise<void> {
            const cookies = new Cookies()
            const locale: ILocale = (cookies.get('pll_language') || DEFAULT_LOCALE) as ILocale
            const response = await axios.get(`${STATIC_PATH}/static/locales/${locale}.json`)
            dispatch.translationModel.setLocale({ locale, translations: response.data })
        },

        /**
         *  TODO Document.
         *
         * @param locale TODO Document.
         */
        async switchLocale(locale: ILocale): Promise<void> {
            // save swetched locale in cookie
            const cookies = new Cookies()
            cookies.set('pll_language', locale, {
                expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                path: '/',
            })
            const response = await axios.get(`${STATIC_PATH}/static/locales/${locale}.json`)
            dispatch.translationModel.setLocale({ locale, translations: response.data })
            // after change the locale we must sync with backen for update it
            // dispatch.translationModel.syncLocaleWithBackend()
        },

        /**
         * TODO Document.
         */
        async syncLocaleWithBackend(): Promise<void> {
            await axios.get(`${API_BASE_URL}language`)
        },
    }),
    reducers: {
        /**
         *  TODO Document.
         *
         * @param state TODO Document.
         * @param payload TODO Document.
         * @returns TODO Document.
         */
        setLocale(state: ITransltionState, payload: ITransltionState) {
            return {
                ...state,
                ...payload,
            }
        },
    },
    state: defaultState,
})
