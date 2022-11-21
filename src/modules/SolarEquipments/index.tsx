import { Icon, IconButton, Tooltip, useTheme, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useConfirm } from 'material-ui-confirm'
import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { motion } from 'framer-motion'
import Table from 'src/common/ui-kit/components/Table/Table'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'
import { SolarEquipmentHeader } from 'src/modules/SolarEquipments/SolarEquipmentsHeader'
import { useSolarEquipmentsList } from 'src/modules/SolarEquipments/solarEquipmentsHook'

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
 * @param props.row Represent the equipment information of the current row (current row represent the row when clicking on Accept or Refuse).
 * @param props.onAfterCreateUpdateDeleteSuccess Callback function when activation succeeded.
 * @param props.setIsUpdateSolarEquipmentPopup Setter function to trigger update popup.
 * @param props.setSolarEquipmentDetails Setter function to be passed in the row data.
 * @returns ActionsCell Component.
 */
const ActionsCell = ({
    row,
    onAfterCreateUpdateDeleteSuccess,
    setIsUpdateSolarEquipmentPopup,
    setSolarEquipmentDetails,
}: //eslint-disable-next-line jsdoc/require-jsdoc
{
    //eslint-disable-next-line jsdoc/require-jsdoc
    row: ISolarEquipment
    //eslint-disable-next-line jsdoc/require-jsdoc
    onAfterCreateUpdateDeleteSuccess: () => void
    //eslint-disable-next-line jsdoc/require-jsdoc
    setIsUpdateSolarEquipmentPopup: Dispatch<SetStateAction<boolean>>
    //eslint-disable-next-line jsdoc/require-jsdoc
    setSolarEquipmentDetails: Dispatch<SetStateAction<ISolarEquipment | null>>
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
                    Vous êtes sur le point de supprimer cet équipement. Ëtes-vous sûr de vouloir continuer ?
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
                            setIsUpdateSolarEquipmentPopup(true)
                            setSolarEquipmentDetails(row)
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
 * SolarEquipments page component.
 *
 * @returns SolarEquipments JSX.
 */
export const SolarEquipments = () => {
    const {
        elementList: solarEquipmentsList,
        loadingInProgress: isSolarEquipmentsLoading,
        totalElementList: totalSolarEquipmentsList,
        reloadElements: reloadSolarEquipmentsList,
        loadPage,
        page,
    } = useSolarEquipmentsList()
    const { formatMessage } = useIntl()
    const [, setSolarEquipmentDetails] = useState<ISolarEquipment | null>(null)
    const [, setIsUpdateolarEquipmentPopup] = useState(false)
    const [, setIsCreateSolarEquipmentPopup] = useState(false)

    const solarEquipmentCells = [
        {
            id: 'type',
            headCellLabel: formatMessage({ id: 'Type', defaultMessage: 'Type' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: ISolarEquipment) => row.type,
        },
        {
            id: 'brand',
            headCellLabel: formatMessage({
                id: 'Marque',
                defaultMessage: 'Marque',
            }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: ISolarEquipment) => row.brand,
        },
        {
            id: 'reference',
            headCellLabel: formatMessage({ id: 'Modèle', defaultMessage: 'Modèle' }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: ISolarEquipment) => row.reference,
        },
        {
            id: 'installedAt',
            headCellLabel: formatMessage({ id: "Date d'installation", defaultMessage: "Date d'installation" }),
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: ISolarEquipment) => row.installedAt,
        },
        {
            id: '',
            headCellLabel: '',
            // eslint-disable-next-line jsdoc/require-jsdoc
            rowCell: (row: ISolarEquipment) => (
                <ActionsCell
                    row={row}
                    setIsUpdateSolarEquipmentPopup={setIsUpdateolarEquipmentPopup}
                    setSolarEquipmentDetails={setSolarEquipmentDetails}
                    onAfterCreateUpdateDeleteSuccess={reloadSolarEquipmentsList}
                />
            ),
        },
    ]

    return (
        <Root
            header={<SolarEquipmentHeader setIsCreateSolarEquipmentPopup={setIsCreateSolarEquipmentPopup} />}
            content={
                isSolarEquipmentsLoading || !solarEquipmentsList ? (
                    <FuseLoading />
                ) : solarEquipmentsList.length === 0 ? (
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
                        <Table<ISolarEquipment>
                            cells={solarEquipmentCells}
                            totalRows={totalSolarEquipmentsList}
                            onPageChange={loadPage}
                            rows={solarEquipmentsList}
                            pageProps={page}
                        />
                    </div>
                )
            }
            innerScroll
        />
    )
}
