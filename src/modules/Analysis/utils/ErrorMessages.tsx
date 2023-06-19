import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { URL_MY_HOUSE, manualContractFillingIsEnabled } from 'src/modules/MyHouse/MyHouseConfig'
import { NavLink } from 'react-router-dom'
import { AnalysisCTAColor } from 'src/modules/Analysis/tabs/AnalysisSummary'

/**
 * MissingHousingMeterErrorMessage Component.
 *
 * @returns MissingHousingMeterErrorMessage.
 */
export const MissingContractsWarning = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    return (
        <div style={{ minHeight: '64px' }} className="w-full relative flex flex-col justify-center items-center">
            <div className="flex items-center justify-center gap-8">
                <ErrorOutlineIcon
                    sx={{
                        color: AnalysisCTAColor,
                        width: { xs: '24px', md: '32px' },
                        height: { xs: '24px', md: '32px' },
                    }}
                />

                <div className="w-full">
                    <TypographyFormatMessage sx={{ color: AnalysisCTAColor }} className="text-13 md:text-16 inline">
                        Le coût en euros est un exemple. Pour avoir le coût réel.
                    </TypographyFormatMessage>{' '}
                    {manualContractFillingIsEnabled && (
                        <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}>
                            <TypographyFormatMessage
                                className="underline text-13 md:text-16 inline"
                                sx={{ color: AnalysisCTAColor }}
                            >
                                Renseigner votre contrat d'énergie
                            </TypographyFormatMessage>
                        </NavLink>
                    )}
                </div>
            </div>
        </div>
    )
}
