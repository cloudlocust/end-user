import { Card } from '@mui/material'
import React from 'react'
import { useContractList } from './contractsHook'

// eslint-disable-next-line jsdoc/require-jsdoc
const Contracts = () => {
    const { elementList: contractList } = useContractList()
    return (
        <div className="flex wrap p-16">
            {contractList &&
                contractList.map((contract) => (
                    <Card key={contract.id} className="m-5 p-16" style={{ width: 200, flexBasis: 200 }}>
                        <p>{contract.provider}</p>
                        <p>
                            {contract.offer} - {contract.tariffType} - {contract.power}
                        </p>
                    </Card>
                ))}
        </div>
    )
}

export default Contracts
