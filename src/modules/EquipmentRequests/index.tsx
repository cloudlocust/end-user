import { Icon, IconButton, Tooltip, useTheme, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useConfirm } from 'material-ui-confirm'
import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { IEquipmentRequest } from 'src/modules/EquipmentRequests/equipmentRequests'
import { EquipmentRequestsHeader } from 'src/modules/EquipmentRequests/EquipmentRequestsHeader'
import { useEquipmentRequestsList } from 'src/modules/EquipmentRequests/EquipmentRequestsHook'
import { motion } from 'framer-motion'
import Table from 'src/common/ui-kit/components/Table/Table'

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
 * Component ActionsCell that will be rendered as content of the ActionButtons Cell.
 *
 * @param props N/A.
 * @param props.row Represent the installer information of the current row (current row represent the row when clicking on Accept or Refuse).
 * @param props.onAfterCreateUpdateDeleteSuccess Callback function when activation succeeded.
 * @param props.setIsUpdateEquipmentRequestsPopup Setter function to trigger update popup.
 * @param props.setEquipmentRequestDetails Setter function to be passed in the row data.
 * @returns ActionsCell Component.
 */
const ActionsCell = ({
    row,
    onAfterCreateUpdateDeleteSuccess,
    setIsUpdateEquipmentRequestsPopup,
    setEquipmentRequestDetails,
}: //eslint-disable-next-line jsdoc/require-jsdoc
{
    //eslint-disable-next-line jsdoc/require-jsdoc
    row: IEquipmentRequest
    //eslint-disable-next-line jsdoc/require-jsdoc
    onAfterCreateUpdateDeleteSuccess: () => void
    //eslint-disable-next-line jsdoc/require-jsdoc
    setIsUpdateEquipmentRequestsPopup: Dispatch<SetStateAction<boolean>>
    //eslint-disable-next-line jsdoc/require-jsdoc
    setEquipmentRequestDetails: Dispatch<SetStateAction<IEquipmentRequest | null>>
}): JSX.Element => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const openMuiDialog = useConfirm()

    /**
     * Open warning remove popup on delete click.
     */
    const onDeleteInstallationRequestHandler = async () => {
        await openMuiDialog({
            title: '',
            dialogProps: {
                PaperProps: {
                    style: {
                        // MUI snackbar red color, used as a global error color.
                        background: theme.palette.error.main,
                    },
                },
            },
            description: (
                <TypographyFormatMessage className="text-16 md:text-20 text-center text-white">
                    Vous êtes sur le point de supprimer cette demande d'équipement. Ëtes-vous sûr de vouloir continuer ?
                </TypographyFormatMessage>
            ),
            confirmationText: (
                <TypographyFormatMessage className="text-13 md:text-16 font-medium text-white">
                    Continuer
                </TypographyFormatMessage>
            ),
            cancellationText: (
                <TypographyFormatMessage className="text-13 md:text-16 font-medium text-white">
                    Annuler
                </TypographyFormatMessage>
            ),
        })
        onAfterCreateUpdateDeleteSuccess()
    }

    return (
        <div>
            <>
                <Tooltip
                    title={formatMessage({
                        id: 'Modifier',
                        defaultMessage: 'Modifier',
                    })}
                >
                    <IconButton
                        color="success"
                        onClickCapture={() => {
                            setIsUpdateEquipmentRequestsPopup(true)
                            setEquipmentRequestDetails(row)
                        }}
                    >
                        <Icon>edit</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title={formatMessage({
                        id: 'Supprimer',
                        defaultMessage: 'Supprimer',
                    })}
                >
                    <IconButton color="error" onClick={onDeleteInstallationRequestHandler}>
                        <Icon>delete</Icon>
                    </IconButton>
                </Tooltip>
            </>
        </div>
    )
}

/**
 * EquipmentRequests page component.
 *
 * @returns EquipmentRequests JSX.
 */
export const EquipmentRequests = () => {
    const {
        elementList: equipmentRequestsList,
        loadingInProgress: isEquipmentRequestsLoading,
        totalElementList: totalEquipmentRequests,
        reloadElements: reloadEquipmentRequests,
        loadPage,
        page,
    } = useEquipmentRequestsList()
    const { formatMessage } = useIntl()
    const [, setEquipmentRequestDetails] = useState<IEquipmentRequest | null>(null)
    const [, setIsUpdateEquipmentRequestsPopup] = useState(false)
    const [, setIsCreateEquipmentRequestPopup] = useState(false)

    const equipmentRequestsCells = [
        {
            id: 'type',
            headCellLabel: formatMessage({ id: 'Type', defaultMessage: 'Type' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IEquipmentRequest) => row.type,
        },
        {
            id: 'brand',
            headCellLabel: formatMessage({
                id: 'Marque',
                defaultMessage: 'Marque',
            }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IEquipmentRequest) => row.brand,
        },
        {
            id: 'reference',
            headCellLabel: formatMessage({ id: 'Modèle', defaultMessage: 'Modèle' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IEquipmentRequest) => row.reference,
        },
        {
            id: 'installedAt',
            headCellLabel: formatMessage({ id: "Date d'installation", defaultMessage: "Date d'installation" }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IEquipmentRequest) => row.installedAt,
        },
        {
            id: '',
            headCellLabel: '',
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IEquipmentRequest) => (
                <ActionsCell
                    row={row}
                    setIsUpdateEquipmentRequestsPopup={setIsUpdateEquipmentRequestsPopup}
                    setEquipmentRequestDetails={setEquipmentRequestDetails}
                    onAfterCreateUpdateDeleteSuccess={reloadEquipmentRequests}
                />
            ),
        },
    ]

    return (
        <Root
            header={<EquipmentRequestsHeader setIsCreateEquipmentRequestPopup={setIsCreateEquipmentRequestPopup} />}
            content={
                isEquipmentRequestsLoading || !equipmentRequestsList ? (
                    <FuseLoading />
                ) : equipmentRequestsList.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                        className="flex flex-1 items-center justify-center h-full"
                    >
                        <Typography color="textSecondary" variant="h5">
                            {formatMessage({
                                id: "Aucune demandes d'installations!",
                                defaultMessage: "Aucune demandes d'installations!",
                            })}
                        </Typography>
                    </motion.div>
                ) : (
                    <div className="w-full flex flex-col">
                        <Table<IEquipmentRequest>
                            cells={equipmentRequestsCells}
                            totalRows={totalEquipmentRequests}
                            onPageChange={loadPage}
                            rows={equipmentRequestsList}
                            pageProps={page}
                        />
                    </div>
                )
            }
        ></Root>
    )
}
