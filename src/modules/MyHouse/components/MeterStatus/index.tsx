import { Card, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { MuiCardContent } from 'src/common/ui-kit'
import { MeterStatusProps } from 'src/modules/MyHouse/components/MeterStatus/meterStatus.d'

/**
 * Meter Status Component.
 *
 * @param param0 N/A.
 * @param param0.houseId House Id coming from parent.
 * @param param0.meterGuid MeterGuid of the actual house's meter.
 * @returns Meter Status component with different status for Nrlibk & Enedis.
 */
export const MeterStatus = ({ houseId, meterGuid }: MeterStatusProps) => {
    const theme = useTheme()

    return (
        <Card className="mb-12" variant="outlined">
            <MuiCardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <div className="flex flex-row justify-between bg-grey-200 p-12 border-b-1 border-grey-300">
                    <div className="flex flex-col justify-between">
                        <TypographyFormatMessage className="text-base">Compteur</TypographyFormatMessage>
                        <span className="text-grey-600 text-base">{`n° ${meterGuid}`}</span>
                    </div>
                    <NavLink to={`${URL_MY_HOUSE}/${houseId}/contracts`} className="flex">
                        <Card className="flex flex-col items-center rounded p-8">
                            <ContractIcon
                                style={{ fill: theme.palette.primary.main, marginBottom: '4px' }}
                                height={35}
                            />
                            <TypographyFormatMessage
                                variant="subtitle1"
                                color="CaptionText"
                                className="text-10 font-semibold"
                            >
                                Contrat
                            </TypographyFormatMessage>
                        </Card>
                    </NavLink>
                </div>
                {/* <div className="p-12 border-b-1 border-grey-300">
                    <TypographyFormatMessage className="text-xs md:text-sm">
                        Consommation en temps réel
                    </TypographyFormatMessage>
                </div> */}
            </MuiCardContent>
        </Card>
    )
}
