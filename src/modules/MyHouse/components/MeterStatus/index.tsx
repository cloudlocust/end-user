import { Card, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'

// eslint-disable-next-line jsdoc/require-jsdoc
export const MeterStatus = ({ houseId, meterGuid }: { houseId: string; meterGuid: string }) => {
    const theme = useTheme()

    // TODO: MYEM-2940
    return (
        <>
            <NavLink to={`${URL_MY_HOUSE}/${houseId}/contracts`} className="flex">
                <Card className="flex flex-col items-center rounded p-8">
                    <ContractIcon style={{ fill: theme.palette.primary.main, marginBottom: '4px' }} height={35} />
                    <TypographyFormatMessage variant="subtitle1" color="CaptionText" className="text-10 font-semibold">
                        Contrat
                    </TypographyFormatMessage>
                </Card>
            </NavLink>
        </>
    )
}
