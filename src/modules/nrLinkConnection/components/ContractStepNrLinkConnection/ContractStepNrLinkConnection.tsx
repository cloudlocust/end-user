import { Box, Button, useTheme, Hidden, CircularProgress } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as ContractIcon } from 'src/assets/images/content/housing/contract.svg'
import { Link, useHistory } from 'react-router-dom'
import { URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'
import { addContractDataType } from 'src/modules/Contracts/contractsTypes'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import { useState } from 'react'

// TODO: Add tests for this component.
/**
 * ContractStepNrLinkConnection component that handle contract setup after nrlink is connected.
 *
 * @param root0 N/A.
 * @param root0.housingId Housing id.
 * @returns ContractStepNrLinkConnection JSX.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const ContractStepNrLinkConnection = ({ housingId }: { housingId?: number }) => {
    const theme = useTheme()
    const history = useHistory()
    const [isContractAdding, setIsContractAdding] = useState(false)
    const { loadingInProgress: isContractsLoading, addElement: addContract } = useContractList(housingId!)

    const contractSetupTypography = (
        <TypographyFormatMessage className="text-center mb-20 text-13 font-medium md:text-16">
            Configurer mon contrat de fourniture d'énergie pour visualiser ma consommation en euro
        </TypographyFormatMessage>
    )

    if (isContractAdding)
        return (
            <div className="flex justify-center items-center h-full">
                <div
                    style={{
                        maxWidth: '320px',
                    }}
                >
                    <div
                        style={{
                            margin: '0 auto',
                            marginBottom: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress
                            className="w-[80px] h-[80px]"
                            style={{
                                height: '80px',
                                width: '80px',
                            }}
                        />
                    </div>
                    <TypographyFormatMessage variant="body1" className="w-full text-center text-14">
                        Merci de patienter quelques instants
                    </TypographyFormatMessage>
                </div>
            </div>
        )

    return (
        <Box className="landscape:flex landscape:justify-between portrait:flex-col">
            <div className="w-full">
                <ContractForm
                    onSubmit={async (input: addContractDataType) => {
                        setIsContractAdding(true)
                        try {
                            await addContract(input)
                            history.push(URL_DASHBOARD)
                            // Catching the error to avoir application crash and stops working.
                        } catch (error) {}
                        setIsContractAdding(false)
                    }}
                    isContractsLoading={isContractsLoading}
                    houseId={housingId!}
                />
            </div>

            <div className="my-16 flex justify-center align-center flex-col">
                <Hidden mdDown>
                    {contractSetupTypography}
                    <ContractIcon
                        style={{
                            fill: theme.palette.primary.main,
                        }}
                        height={180}
                        className="mb-20"
                    />
                </Hidden>
                <Button component={Link} to={URL_DASHBOARD} color="primary" variant="outlined" className="mx-24">
                    <TypographyFormatMessage>Passer cette étape</TypographyFormatMessage>
                </Button>
            </div>
        </Box>
    )
}

export default ContractStepNrLinkConnection
