import { styled } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { Typography, Icon, Box } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { motion } from 'framer-motion'
import Table from 'src/common/ui-kit/components/Table/Table'
import ConnectedPlugsHeader from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsHeader'
import ConnectedPlugsMobileRowContent from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsMobileRow'
import { ButtonLoader } from 'src/common/ui-kit'
import { ICell } from 'src/common/ui-kit/components/Table/TableT'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import {
    IConnectedPlug,
    connectedPlugConsentStateEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import dayjs from 'dayjs'
import ConnectedPlugsInformationMessage from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsInformationMessage'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { contractsRouteParam } from 'src/modules/Contracts/contractsTypes.d'
import { useParams } from 'react-router-dom'
import { useShellyConnectedPlugs } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .FusePageCarded-content': {
        display: 'flex',
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

/**
 * ConnectedPlugsList page component.
 *
 * @returns ConnectedPlugsList JSX.
 */
const ConnectedPlugs = () => {
    const { housingList } = useSelector(({ housingModel }: RootState) => housingModel)
    // HouseId extracted from params of the url :houseId/connected-plugs
    const { houseId } = useParams<contractsRouteParam>()
    const currentHousingMeterGuid = housingList.find((housing) => housing.id === parseInt(houseId))?.meter?.guid

    const { loadingInProgress: isShellyLoadingInProgress, openShellyConnectedPlugsWindow } = useShellyConnectedPlugs(
        parseInt(houseId),
    )

    const {
        connectedPlugList,
        loadingInProgress: isConnectedPlugListLoading,
        loadConnectedPlugList,
    } = useConnectedPlugList(currentHousingMeterGuid!)
    const { formatMessage } = useIntl()

    const connectedPlugsCells: ICell<IConnectedPlug>[] = [
        {
            id: 'name',
            headCellLabel: formatMessage({ id: 'Nom', defaultMessage: 'Nom' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IConnectedPlug) => (
                <div className="flex gap-2">
                    <TypographyFormatMessage className="text-sm">Prise</TypographyFormatMessage>
                    <Typography>{row.deviceId}</Typography>
                </div>
            ),
        },
        {
            id: 'consent',
            headCellLabel: formatMessage({ id: 'Connectivité', defaultMessage: 'Connectivité' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IConnectedPlug) => (
                <>
                    {row.consentState === connectedPlugConsentStateEnum.APPROVED ? (
                        <div className="flex gap-2">
                            <TypographyFormatMessage className="text-sm">Connectée le</TypographyFormatMessage>
                            <Typography className="text-sm">
                                : {dayjs.utc(row.createdAt).local().format('DD/MM/YYYY')}
                            </Typography>
                        </div>
                    ) : (
                        <TypographyFormatMessage color="error" className="text-sm">
                            Non Connectée
                        </TypographyFormatMessage>
                    )}
                </>
            ),
        },
    ]

    return (
        <Root
            header={
                <ConnectedPlugsHeader
                    onAddClick={() => {
                        openShellyConnectedPlugsWindow(loadConnectedPlugList)
                    }}
                    isConnectedPlugListLoading={isConnectedPlugListLoading || isShellyLoadingInProgress}
                />
            }
            content={
                <div className="flex flex-col w-full">
                    <ConnectedPlugsInformationMessage />
                    <div className="w-full h-full flex flex-col">
                        <Table<IConnectedPlug>
                            cells={connectedPlugsCells}
                            totalRows={connectedPlugList.length}
                            onPageChange={loadConnectedPlugList}
                            isRowsLoadingInProgress={isConnectedPlugListLoading}
                            emptyRowsElement={
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                    className="flex flex-col p-16 items-center justify-center h-full gap-16 text-justify mb-48"
                                >
                                    <Box
                                        className="flex justify-center items-center p-8"
                                        sx={{
                                            borderWidth: '5px',
                                            borderStyle: 'solid',
                                            borderColor: 'primary.main',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        <Icon color="primary" style={{ fontSize: '96px' }}>
                                            power_off
                                        </Icon>
                                    </Box>
                                    <TypographyFormatMessage>
                                        {`Aucune prise connectée n'a encore été renseignée, cliquez "configuration" pour ouvrir l'onglet de paramètrage des prises connectée.`}
                                    </TypographyFormatMessage>
                                    <ButtonLoader
                                        className="whitespace-nowrap"
                                        variant="contained"
                                        inProgress={isConnectedPlugListLoading || isShellyLoadingInProgress}
                                        onClick={() => {
                                            openShellyConnectedPlugsWindow(loadConnectedPlugList)
                                        }}
                                    >
                                        <TypographyFormatMessage>Configuration</TypographyFormatMessage>{' '}
                                    </ButtonLoader>
                                </motion.div>
                            }
                            rows={connectedPlugList}
                            pageProps={1}
                            sizeRowsPerPage={100}
                            MobileRowContentElement={ConnectedPlugsMobileRowContent}
                        />
                    </div>
                </div>
            }
            innerScroll
        />
    )
}

export default ConnectedPlugs
