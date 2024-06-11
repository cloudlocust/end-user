import 'src/modules/MyHouse/MyHouse.scss'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import CircularProgress from '@mui/material/CircularProgress'
import ContractList from 'src/modules/Contracts/components/ContractList'

/**
 * MyHouse Component is used for urls that follow /my-houses and /my-houses/:id.
 *
 * @returns MyHouse form component.
 */
export const Contracts = () => {
    const [isCurrentHousingInProgress, setIsCurrentHousingInProgress] = useState(false)
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const history = useHistory()
    // initialMount will make sure that Contracts will change only when currentHousing changes when it gets selected.
    // We have two cases:,
    // Case1: If currentHousing didn't change through select where user access the url /../:houseId/contracts the Contracts should fetch :houseId on usepParams
    // Case2: if select currentHousing happens then Contracts should fetch according to the new currentHousing
    const initialMount = useRef(true)
    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    useEffect(() => {
        // This condition makes sure only when select on housing changes currentHousing then Contracts should fetch its data according to the new currentHousing
        // We have two cases, when no select currentHousing happens Contracts should be fetched according to houseId from useParams even if it's different from currentHousing
        // And if select housing, then we should enforce the Contracts should be fetched according to the selected currentHousing and show its id on the history useParams
        // >> Because if currentHousing didn't change through select.
        // >> Then in case where user access the url /../:houseId/contracts the Contracts should fetch :houseId on usepParams even if it's different from currentHousing
        // >> And if select currentHousing happens then Contracts should fetch according to the selected currentHousing
        if (!initialMount.current && currentHousing?.id) {
            setIsCurrentHousingInProgress(true)
            history.replace(`${URL_MY_HOUSE}/${currentHousing.id}/contracts`)
        }
    }, [currentHousing?.id, history, houseId])

    useEffect(() => {
        initialMount.current = false
        setIsCurrentHousingInProgress(false)
    }, [houseId])

    // While waiting for houseId on history params change.
    // This enforces Contracts component to rerender and fetch data according to the new houseId.
    if (isCurrentHousingInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress size={32} />
            </div>
        )

    return <ContractList />
}
