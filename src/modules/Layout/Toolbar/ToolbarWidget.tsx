import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'src/redux'
import { useHistory } from 'react-router-dom'
import UserMenu from 'src/modules/Layout/Toolbar/components/UserMenu'
import Notification from 'src/modules/Layout/Toolbar/components/Novu/Notification'
import './ToolbarWidget.scss'
import { Alerts } from 'src/modules/Layout/Toolbar/components/Alerts'
import { URL_ERROR_HOUSING } from 'src/modules/Errors/ErrorsConfig'
import { SelectHousing } from 'src/modules/Layout/Toolbar/components/SelectHousing'

/**
 * ToolbarWidget include the content of the Toolbar.
 *
 * @returns ToolbarWidget Component.
 */
export const ToolbarWidget = () => {
    const history = useHistory()
    // We use the dispatch to get the housing model from the redux state.
    const dispatch = useDispatch<Dispatch>()

    // when the toolbar mount we refetch the housings (this insure that the housings are updated when refresh the page)
    useEffect(() => {
        /**
         * Handler of loadHousingsList with a try/catch error.
         * If error in loadHousings then ErrorHousing Page should be shown.
         */
        const loadHousings = async () => {
            try {
                await dispatch.housingModel.loadHousingsList()
            } catch (error) {
                history.push(URL_ERROR_HOUSING)
            }
        }
        loadHousings()
    }, [dispatch.housingModel, history])

    return (
        <div className="flex flex-1 my-20 justify-between toolbar-widget">
            <SelectHousing />
            <div className="flex align-center">
                <Notification />
                <Alerts />
                <UserMenu />
            </div>
        </div>
    )
}
