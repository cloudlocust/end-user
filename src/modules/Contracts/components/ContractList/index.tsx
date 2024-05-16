import { useState } from 'react'
import ContractCard from 'src/modules/Contracts/components/ContractCard'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import 'src/modules/Contracts/Contracts.scss'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import PostAddIcon from '@mui/icons-material/PostAdd'
import Icon from '@mui/material/Icon'
import CircularProgress from '@mui/material/CircularProgress'
import { useHistory, useParams } from 'react-router-dom'
import { contractsRouteParam, addContractDataType } from 'src/modules/Contracts/contractsTypes.d'
import { isEmpty, isNull } from 'lodash'
import { primaryMainColor } from 'src/modules/utils/muiThemeVariables'
import Dialog from '@mui/material/Dialog'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import { manualContractFillingIsEnabled } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * ContractsList Page Component.
 *
 * @returns ContractsList Page Component.
 */
const ContractList = () => {
    // HouseId extracted from params of the url :houseId/contracts
    const { houseId } = useParams<contractsRouteParam>()
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const history = useHistory()

    const {
        elementList: contractList,
        loadingInProgress: isContractsLoading,
        reloadElements: reloadContractList,
        addElement: addContract,
    } = useContractList(parseInt(houseId))

    return (
        <>
            <Dialog open={isOpenDialog} fullWidth={true} maxWidth="sm" onClose={() => setIsOpenDialog(false)}>
                <ContractForm
                    onSubmit={async (input: addContractDataType) => {
                        try {
                            await addContract(input)
                            setIsOpenDialog(false)
                            reloadContractList()
                            // Catching the error to avoir application crash and stops working.
                        } catch (error) {}
                    }}
                    isContractsLoading={isContractsLoading}
                    houseId={parseInt(houseId)}
                />
            </Dialog>
            <div className="p-24">
                <Button className="flex justify-center items-center" variant="text" onClick={() => history.goBack()}>
                    <Icon sx={{ color: primaryMainColor }}>arrow_back</Icon>
                    <TypographyFormatMessage
                        sx={{ color: primaryMainColor }}
                        className="text-13 font-medium md:text-16 ml-4"
                    >
                        Retour
                    </TypographyFormatMessage>
                </Button>
                <div className="flex justify-between items-center">
                    <TypographyFormatMessage className="text-16 font-medium md:text-20 mx-auto">
                        Mes Contrats
                    </TypographyFormatMessage>
                    {manualContractFillingIsEnabled && (
                        <IconButton color="primary" onClick={() => setIsOpenDialog(true)}>
                            <PostAddIcon style={{ width: '30px', height: '30px' }} />
                        </IconButton>
                    )}
                </div>

                {isEmpty(contractList) && !isContractsLoading ? (
                    <div className="flex justify-center items-center p-24" style={{ height: '320px' }}>
                        <TypographyFormatMessage
                            className="text-13 font-medium md:text-16 w-full text-center"
                            sx={{ color: 'primary.main' }}
                        >
                            {manualContractFillingIsEnabled
                                ? "Aucun contrat de fourniture d'énergie enregistré"
                                : 'Grille tarifaire en cours de configuration'}
                        </TypographyFormatMessage>
                    </div>
                ) : (
                    <div className="Contracts items-center p-24">
                        {isNull(contractList) || isContractsLoading ? (
                            <div
                                className="flex flex-col justify-center items-center w-full h-full"
                                style={{ height: '320px' }}
                            >
                                <CircularProgress sx={{ color: primaryMainColor }} />
                            </div>
                        ) : (
                            contractList.map((contract) => (
                                <ContractCard
                                    key={contract.id}
                                    contract={contract}
                                    onAfterDeleteUpdateSuccess={reloadContractList}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default ContractList
