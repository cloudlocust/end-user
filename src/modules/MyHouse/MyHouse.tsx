import 'src/modules/MyHouse/MyHouse.scss'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { URL_MY_HOUSE } from './MyHouseConfig'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * Form used for modify MyHouse.
 *
 * @returns MyHouse form component.
 */
export const MyHouse = () => {
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const history = useHistory()

    useEffect(() => {
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

    return (
        <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
            <CircularProgress size={32} />
        </div>
    )
}
