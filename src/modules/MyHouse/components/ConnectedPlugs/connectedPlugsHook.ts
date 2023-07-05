import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'

/**
 * Connected Plug requests API.
 */
export const CONNECTED_PLUG_CONSENT_API = `${API_RESOURCES_URL}/shelly/consent`

/**
 * Error message loadElementListError.
 *
 * @param _error Error.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
export const loadElementListError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement de vos prises',
        defaultMessage: 'Erreur lors du chargement de vos prises',
    })
}

/**
 * Hook to get Connected Plug Consent list.
 *
 * @param meterGuid Meter GUID.
 * @param sizeParam Indicates the default sizeParam for loadElementList.
 * @returns Hook useConnectedPlugList.
 */
export const useConnectedPlugList = (meterGuid: string, sizeParam?: number) =>
    // eslint-disable-next-line jsdoc/require-jsdoc
    BuilderUseElementList<IConnectedPlug, {}, searchFilterType>({
        API_ENDPOINT: `${CONNECTED_PLUG_CONSENT_API}/${meterGuid}`,
        sizeParam,
        snackBarMessage0verride: { loadElementListError },
    })(true)
