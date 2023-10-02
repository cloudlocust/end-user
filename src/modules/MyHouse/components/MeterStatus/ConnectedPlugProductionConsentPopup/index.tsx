import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Dialog, DialogContent, useMediaQuery, useTheme, CircularProgress } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { ButtonLoader } from 'src/common/ui-kit'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useShellyConnectedPlugs } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import SelectConnectedPlugProductionList from 'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup/SelectConnectedPlugProductionList'
import { IConnectedPlugProductionConsentPopupProps } from 'src/modules/MyHouse/components/MeterStatus/MeterStatus.d'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * ConnectedPlugProductionConsentPopup Page Component.
 *
 * @param props N/A.
 * @param props.onClose Handler to be called when Closing Connected Plug Production Consent Popup.
 * @returns ConnectedPlugProductionConsentPopup .
 */
const ConnectedPlugProductionConsentPopup = ({ onClose }: IConnectedPlugProductionConsentPopupProps) => {
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const history = useHistory()

    const { loadingInProgress: isShellyLoadingInProgress, openShellyConnectedPlugsWindow } = useShellyConnectedPlugs(
        currentHousing?.id,
    )

    const {
        connectedPlugList,
        loadingInProgress: isConnectedPlugListLoadingInProgress,
        loadConnectedPlugList,
        associateConnectedPlug,
    } = useConnectedPlugList(currentHousing?.id)

    useEffect(() => {
        if (currentHousing?.meter?.guid) loadConnectedPlugList()
    }, [currentHousing?.meter?.guid, loadConnectedPlugList])

    return (
        <Dialog open={true} fullWidth maxWidth={mdDown ? 'xl' : 'sm'} onClose={onClose} onBackdropClick={onClose}>
            <DialogContent className="flex flex-col">
                {isConnectedPlugListLoadingInProgress ? (
                    <div className="flex justify-center items-center w-full h-full" style={{ height: '150px' }}>
                        <CircularProgress size={32} />
                    </div>
                ) : !connectedPlugList.length ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                        className="flex flex-col items-center justify-center h-full gap-16 text-justify"
                    >
                        <TypographyFormatMessage>
                            {formatMessage({
                                id: `Aucune prise détectée. Renseignez vos prises connectées Shelly dans l'espace dedié`,
                                defaultMessage: `Aucune prise détectée. Renseignez vos prises connectées Shelly dans l'espace dedié`,
                            })}
                        </TypographyFormatMessage>

                        <ButtonLoader
                            className="whitespace-nowrap"
                            variant="contained"
                            inProgress={isShellyLoadingInProgress}
                            onClick={() => {
                                openShellyConnectedPlugsWindow(loadConnectedPlugList)
                            }}
                        >
                            <TypographyFormatMessage>Configurer</TypographyFormatMessage>{' '}
                        </ButtonLoader>
                    </motion.div>
                ) : (
                    <SelectConnectedPlugProductionList
                        onSubmit={async (connectedPlugId) => {
                            const isSuccessResponse = await associateConnectedPlug(
                                connectedPlugId,
                                currentHousing!.id,
                                currentHousing?.meter?.guid,
                            )
                            if (isSuccessResponse) history.push(`${URL_MY_HOUSE}/${currentHousing?.id}/connected-plugs`)
                        }}
                        connectedPlugList={connectedPlugList}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ConnectedPlugProductionConsentPopup
