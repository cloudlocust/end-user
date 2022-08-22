import React from 'react'
import ContractCard from 'src/modules/Contracts/components/ContractCard'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import './Contracts.scss'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import PostAddIcon from '@mui/icons-material/PostAdd'
import Icon from '@mui/material/Icon'
import CircularProgress from '@mui/material/CircularProgress'
import { NavLink, useParams } from 'react-router-dom'
import { contractsRouteParam } from 'src/modules/Contracts/contractsTypes.d'
import { isEmpty, isNull } from 'lodash'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { primaryMainColor } from 'src/modules/utils/muiThemeVariables'
/**
 * Contracts Page Component.
 *
 * @returns Contracts Page Component.
 */
const Contracts = () => {
    // HouseId extracted from params of the url :houseId/contracts
    const { houseId } = useParams<contractsRouteParam>()
    const { elementList: contractList, loadingInProgress: isContractsLoading } = useContractList(Number(houseId))
    return (
        <div className="p-24">
            <NavLink to={`${URL_MY_HOUSE}/${houseId}`} className="flex">
                <Button className="flex justify-center items-center">
                    <Icon sx={{ color: primaryMainColor }}>arrow_back</Icon>
                    <TypographyFormatMessage
                        sx={{ color: primaryMainColor }}
                        className="text-13 font-medium md:text-16 ml-4"
                    >
                        Retour
                    </TypographyFormatMessage>
                </Button>
            </NavLink>
            <div className="flex justify-between items-center">
                <TypographyFormatMessage className="text-16 font-medium md:text-20">
                    Mes Contrats
                </TypographyFormatMessage>
                <IconButton color="primary">
                    <PostAddIcon style={{ width: '30px', height: '30px' }} />
                </IconButton>
            </div>

            {isEmpty(contractList) && !isContractsLoading ? (
                <div className="flex justify-center items-center p-24" style={{ height: '320px' }}>
                    <TypographyFormatMessage
                        className="text-13 font-medium md:text-16 w-full text-center"
                        sx={{ color: 'secondary.main' }}
                    >
                        Aucun contrat enregistré. Les valeurs de votre consommation exprimées en Euros proviennent d'un
                        contrat EDF Tarif Bleu Base d'une puissance de 6kVA donnée à titre exemple.
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
                        contractList.map((contract) => <ContractCard key={contract.id} contract={contract} />)
                    )}
                </div>
            )}
        </div>
    )
}

export default Contracts
