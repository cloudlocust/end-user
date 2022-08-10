import { Card } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import { contractsRouteParam } from 'src/modules/Contracts/contractsTypes.d'
import { useContractList } from './contractsHook'

// eslint-disable-next-line jsdoc/require-jsdoc
const Contracts = () => {
    const { houseId } = useParams<contractsRouteParam>()
    const { elementList: contractList } = useContractList(Number(houseId))
    return (
        <div className="flex wrap p-16">
            {contractList &&
                contractList.map((contract) => (
                    <Card key={contract.guid} className="m-5 p-16" style={{ width: 200, flexBasis: 200 }}>
                        <p>{contract.provider}</p>
                        <p>
                            {contract.offer} - {contract.type} - {contract.power}
                        </p>
                    </Card>
                ))}
        </div>
    )
}

export default Contracts
