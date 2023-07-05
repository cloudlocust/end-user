import { styled } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { motion } from 'framer-motion'
import Table from 'src/common/ui-kit/components/Table/Table'
import ConnectedPlugsHeader from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsHeader'
import ConnectedPlugsMobileRowContent from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsMobileRow'
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
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const {
        elementList: connectedPlugsList,
        loadingInProgress: isConnectedPlugsLoading,
        totalElementList: totalConnectedPlugsList,
        loadPage,
        page,
    } = useConnectedPlugList(currentHousing?.meter?.guid!)
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
            header={<ConnectedPlugsHeader />}
            content={
                <div className="flex flex-col w-full">
                    <ConnectedPlugsInformationMessage />
                    <div className="w-full flex flex-col">
                        <Table<IConnectedPlug>
                            cells={connectedPlugsCells}
                            totalRows={totalConnectedPlugsList}
                            onPageChange={loadPage}
                            isRowsLoadingInProgress={isConnectedPlugsLoading}
                            emptyRowsElement={
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                    className="flex flex-1 items-center justify-center h-full"
                                >
                                    <TypographyFormatMessage color="textSecondary" variant="h5">
                                        {formatMessage({
                                            id: 'Aucune Prises !',
                                            defaultMessage: 'Aucune Prises !',
                                        })}
                                    </TypographyFormatMessage>
                                </motion.div>
                            }
                            rows={connectedPlugsList}
                            pageProps={page}
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
