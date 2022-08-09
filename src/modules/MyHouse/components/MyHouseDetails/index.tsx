import React from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { NavLink } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import Card from '@mui/material/Card'
import { ReactComponent as ContractIcon } from './contract.svg'
import { useTheme } from '@mui/material'

/**
 * Page for my house details.
 *
 * @returns House details.
 */
export const MyHouseDetails = () => {
    const houseId = 123
    const theme = useTheme()
    return (
        <div>
            <div>House Details</div>
            <NavLink to={`${URL_MY_HOUSE}/${houseId}/contracts`} className="flex">
                <Card className="flex flex-col items-center rounded p-8">
                    <ContractIcon style={{ fill: theme.palette.primary.main, marginBottom: '4px' }} height={35} />
                    <TypographyFormatMessage variant="subtitle1" color="CaptionText" className="text-10 font-semibold">
                        Contrat
                    </TypographyFormatMessage>
                </Card>
            </NavLink>
        </div>
    )
}
