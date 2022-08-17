import React from 'react'
import { useParams } from 'react-router-dom'
import { contractsRouteParam } from 'src/modules/Contracts/contractsTypes.d'

// eslint-disable-next-line jsdoc/require-jsdoc
const Contracts = () => {
    const { houseId } = useParams<contractsRouteParam>()
    return (
        <div>
            <div>{houseId} Contracts</div>
        </div>
    )
}

export default Contracts
