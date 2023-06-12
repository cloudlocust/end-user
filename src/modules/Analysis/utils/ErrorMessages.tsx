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
        <div style={{ minHeight: '64px' }} className="w-full relative flex sflex-col justify-center items-center p-16">
            <div className="flex items-center justify-center flex-col">
                <ErrorOutlineIcon
                    sx={{
                        color: AnalysisCTAColor,
                        width: { xs: '24px', md: '32px' },
                        height: { xs: '24px', md: '32px' },
                        margin: { xs: '0 0 4px 0', md: '0 8px 0 0' },
                    }}
                />

                <div className="w-full">
                    <TypographyFormatMessage
                        sx={{ color: AnalysisCTAColor }}
                        className="text-13 md:text-16 text-center"
                    >
                        Le coût en euros est un exemple. Vos données contractuelles de fourniture d'énergie ne sont pas
                        disponibles sur toute la période.
                    </TypographyFormatMessage>
                    {manualContractFillingIsEnabled ? (
                        <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}>
                            <TypographyFormatMessage
                                className="underline text-13 md:text-16 text-center"
                                sx={{ color: AnalysisCTAColor }}
                            >
                                Renseigner votre contrat d'énergie
                            </TypographyFormatMessage>
                        </NavLink>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
