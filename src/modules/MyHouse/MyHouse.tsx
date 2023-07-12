import 'src/modules/MyHouse/MyHouse.scss'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import CircularProgress from '@mui/material/CircularProgress'
import { HousingDetails } from 'src/modules/MyHouse/components/HousingDetails'
import { isEmpty } from 'lodash'

/**
 * MyHouse Component is used for urls that follow /my-houses and /my-houses/:id.
 *
 * @returns MyHouse form component.
 */
export const MyHouse = () => {
    const { formatMessage } = useIntl()
    const { currentHousing, housingList } = useSelector(({ housingModel }: RootState) => housingModel)
    const history = useHistory()

    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    useEffect(() => {
        // When current housing change, we modify the url.
        if (currentHousing) history.replace(URL_MY_HOUSE + '/' + currentHousing.id)
    }, [currentHousing, history])

    if (!currentHousing)
        return (
            <div className="container relative h-200 sm:h-256 p-16 sm:p-24 flex-col text-center flex items-center justify-center">
                <Typography color="primary">
                    {formatMessage({
                        id: 'Veuillez sélectionner un logement pour voir ses détails.',
                        defaultMessage: 'Veuillez sélectionner un logement pour voir ses détails.',
                    })}
                </Typography>
            </div>
        )

    // While waiting for history to change we show loading state.
    if (!parseInt(houseId) || !housingList || isEmpty(housingList))
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress size={32} />
            </div>
        )
    return <HousingDetails />
}
