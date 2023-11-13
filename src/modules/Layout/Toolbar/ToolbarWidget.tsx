import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import UserMenu from 'src/modules/Layout/Toolbar/components/UserMenu'
import Notification from 'src/modules/Layout/Toolbar/components/Novu/Notification'
import './ToolbarWidget.scss'
import { URL_ERROR_500 } from 'src/modules/Errors/ErrorsConfig'
import { SelectHousing } from 'src/modules/Layout/Toolbar/components/SelectHousing'
import { useHousingRedux } from 'src/modules/MyHouse/utils/MyHouseHooks'

/**
 * ToolbarWidget include the content of the Toolbar.
 *
 * @returns ToolbarWidget Component.
 */
export const ToolbarWidget = () => {
    const history = useHistory()
    const { loadHousingsAndScopes } = useHousingRedux()

    // when the toolbar mount we refetch the housings (this insure that the housings are updated when refresh the page)
    useEffect(() => {
        /**
         * Handler of loadHousingsList with a try/catch error.
         * If error in loadHousings then ErrorHousing Page should be shown.
         */
        const loadHousings = async () => {
            try {
                await loadHousingsAndScopes()
            } catch (error) {
                history.push(URL_ERROR_500)
            }
        }
        loadHousings()
    }, [loadHousingsAndScopes, history])

    return (
        <div className="flex flex-1 my-20 justify-between w-full">
            <SelectHousing />
            <div className="flex justify-end items-center w-1/3">
                <Notification />
                <UserMenu />
            </div>
        </div>
    )
}
