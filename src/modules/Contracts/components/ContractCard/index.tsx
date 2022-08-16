import React from 'react'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IContract } from 'src/modules/Contracts/contractsTypes'

/**
 * Contract Card component.
 *
 * @param props N/A.
 * @param props.contract Contract information object.
 * @returns Contract Card component.
 */
const ContractCard = ({
    contract,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    contract: IContract
}) => {
    return (
        <Card key={contract.guid} className="p-16 overflow-hidden">
            <div className="flex justify-between items-center">
                <Typography className="text-16 font-bold md:text-20">{contract.provider}</Typography>
                <div>
                    <IconButton color="primary" size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small">
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
            <Divider className="my-8" />
            <Typography className="text-13 font-medium md:text-16">
                {contract.offer} - {contract.type} - {contract.power}
            </Typography>
        </Card>
    )
}

export default ContractCard
