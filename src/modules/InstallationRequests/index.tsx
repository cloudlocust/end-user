import { IconButton, Tooltip, Chip, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { Icon } from 'src/common/ui-kit'
import Table from 'src/common/ui-kit/components/Table/Table'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { IInstallationRequest } from 'src/modules/InstallationRequests/installationRequests'
import {
    useInstallationRequestsList,
    useInstallationRequestDetails,
} from 'src/modules/InstallationRequests/installationRequestsHooks'
import { VariantType } from 'notistack'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'
import { InstallationRequestDetailsPopup } from 'src/modules/InstallationRequests/components/InstallationRequestDetailsPopup'
import { InstallationRequestsHeader } from 'src/modules/InstallationRequests/components/InstallationRequestsHeader'
import { InstallationRequestCreatePopup } from 'src/modules/InstallationRequests/components/InstallationRequestCreatePopup'
import { useConfirm } from 'material-ui-confirm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

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
 * Equipement status list.
 */
export const statusList = {
    NEW: {
        label: 'Nouveau',
        color: 'warning',
    },
    PENDING: {
        label: 'En Cours',
        color: 'info',
    },
    CLOSED: {
        label: 'Terminé',
        color: 'success',
    },
    CANCELED: {
        label: 'Abandonnée',
        color: 'error',
    },
}

/**
 * Equipement type list.
 */
export const equipmentsTypeList = {
    SOLAR: {
        label: 'Panneau Solaire',
        icon: 'panorama_horizontal_select',
    },
    INVERTER: {
        label: 'Onduleur',
        icon: 'autofps_select',
    },
    DEMOTIC: {
        label: 'Domotique',
        icon: 'other_houses',
    },
    OTHER: {
        label: 'Autre',
        icon: 'help_center',
    },
}

/**
 * Component ActionsCell that will be rendered as content of the ActionButtons Cell.
 *
 * @param props N/A.
 * @param props.row Represent the installer information of the current row (current row represent the row when clicking on Accept or Refuse).
 * @param props.onAfterCreateUpdateDeleteSuccess Callback function when activation succeeded.
 * @param props.setIsUpdateInstallationsRequestsPopup Setter function to trigger update popup.
 * @param props.setInstallationRequestDetails Setter function to be passed in the row data.
 * @returns ActionsCell Component.
 */
const ActionsCell = ({
    row,
    onAfterCreateUpdateDeleteSuccess,
    setIsUpdateInstallationsRequestsPopup,
    setInstallationRequestDetails,
}: //eslint-disable-next-line jsdoc/require-jsdoc
{
    //eslint-disable-next-line jsdoc/require-jsdoc
    row: IInstallationRequest
    //eslint-disable-next-line jsdoc/require-jsdoc
    onAfterCreateUpdateDeleteSuccess: () => void
    //eslint-disable-next-line jsdoc/require-jsdoc
    setIsUpdateInstallationsRequestsPopup: Dispatch<SetStateAction<boolean>>
    //eslint-disable-next-line jsdoc/require-jsdoc
    setInstallationRequestDetails: Dispatch<SetStateAction<IInstallationRequest | null>>
}): JSX.Element => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const openMuiDialog = useConfirm()
    const { removeElementDetails } = useInstallationRequestDetails(row.id)

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
                    Vous êtes sur le point de supprimer cette demande d'installation. Ëtes-vous sûr de vouloir continuer
                    ?
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
        await removeElementDetails()
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
                            setIsUpdateInstallationsRequestsPopup(true)
                            setInstallationRequestDetails(row)
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
 * Installation Requests page.
 *
 * @returns Installation Request JSX.
 */
export const InstallationRequests = (): JSX.Element => {
    const {
        elementList: installationRequestsList,
        loadingInProgress: isInstallationRequestsLoading,
        totalElementList: totalInstallationRequests,
        reloadElements: reloadInstallationRequests,
        loadPage,
        page,
    } = useInstallationRequestsList()
    const { formatMessage } = useIntl()
    const [installationRequestDetails, setInstallationRequestDetails] = useState<IInstallationRequest | null>(null)
    const [isUpdateInstallationsRequestsPopup, setIsUpdateInstallationsRequestsPopup] = useState(false)
    const [isCreateInstallationRequestPopup, setIsCreateInstallationRequestPopup] = useState(false)

    const installerRequestsCells = [
        {
            id: 'type',
            headCellLabel: formatMessage({ id: 'Type', defaultMessage: 'Type' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IInstallationRequest) =>
                equipmentsTypeList[row.equipmentType as keyof typeof equipmentsTypeList].label,
        },
        {
            id: 'createdAt',
            headCellLabel: formatMessage({
                id: 'Date',
                defaultMessage: 'Date',
            }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IInstallationRequest) => {
                return dayjs.utc(row.createdAt).local().format('DD/MM/YYYY')
            },
        },
        {
            id: 'budget',
            headCellLabel: formatMessage({ id: 'Budget', defaultMessage: 'Budget' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IInstallationRequest) => {
                // eslint-disable-next-line no-lone-blocks
                return new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(row.budget)
            },
        },
        {
            id: 'status',
            headCellLabel: formatMessage({ id: 'Etat', defaultMessage: 'Etat' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IInstallationRequest) => {
                return (
                    <Chip
                        color={statusList[row.status as keyof typeof statusList].color as VariantType}
                        label={statusList[row.status as keyof typeof statusList].label}
                    />
                )
            },
        },
        {
            id: '',
            headCellLabel: '',
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: IInstallationRequest) => (
                <ActionsCell
                    row={row}
                    setIsUpdateInstallationsRequestsPopup={setIsUpdateInstallationsRequestsPopup}
                    setInstallationRequestDetails={setInstallationRequestDetails}
                    onAfterCreateUpdateDeleteSuccess={reloadInstallationRequests}
                />
            ),
        },
    ]

    return (
        <Root
            header={
                <InstallationRequestsHeader setIsCreateInstallationRequestPopup={setIsCreateInstallationRequestPopup} />
            }
            content={
                <>
                    {isCreateInstallationRequestPopup && (
                        <InstallationRequestCreatePopup
                            open={isCreateInstallationRequestPopup}
                            handleClosePopup={() => {
                                setIsCreateInstallationRequestPopup(false)
                            }}
                            onAfterCreateUpdateDeleteSuccess={reloadInstallationRequests}
                        />
                    )}
                    {isUpdateInstallationsRequestsPopup && installationRequestDetails && (
                        <InstallationRequestDetailsPopup
                            installationRequestDetails={installationRequestDetails}
                            open={isUpdateInstallationsRequestsPopup}
                            handleClosePopup={() => {
                                setIsUpdateInstallationsRequestsPopup(false)
                                setInstallationRequestDetails(null)
                            }}
                            onAfterCreateUpdateDeleteSuccess={reloadInstallationRequests}
                        />
                    )}
                    {isInstallationRequestsLoading || !installationRequestsList ? (
                        <FuseLoading />
                    ) : installationRequestsList.length === 0 ? (
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
                            <Table<IInstallationRequest>
                                cells={installerRequestsCells}
                                totalRows={totalInstallationRequests}
                                onPageChange={loadPage}
                                rows={installationRequestsList}
                                pageProps={page}
                            />
                        </div>
                    )}
                </>
            }
            innerScroll
        />
    )
}
