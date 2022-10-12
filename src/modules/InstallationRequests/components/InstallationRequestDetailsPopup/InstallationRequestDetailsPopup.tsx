import { useIntl } from 'react-intl'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { InstallationRequestDetailsPopupProps } from 'src/modules/InstallationRequests/components/InstallationRequestDetailsPopup/installationRequestDetailsPopup'
import { ThemeProvider } from '@mui/material/styles'
import {
    AppBar,
    Dialog,
    Icon,
    IconButton,
    Toolbar,
    Typography,
    DialogContent,
    Button,
    DialogActions,
} from '@mui/material'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { equipmentsTypeList } from 'src/modules/InstallationRequests'
import { Form } from 'src/common/react-platform-components'
import { equipmentTypeT, IInstallationRequest } from 'src/modules/InstallationRequests/installationRequests.d'
import dayjs from 'dayjs'
import { useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import { useInstallationDetails } from 'src/modules/InstallationRequests/installationRequestsHooks'

/**
 * Installation request details popup component that shows the details of one installation request.
 *
 * @param props Props relevant to Installation request details popup.
 * @returns JSX for installation request details.
 */
export const InstallationRequestDetailsPopup = (props: InstallationRequestDetailsPopupProps) => {
    const { handleClosePopup, open, installationRequestDetails, onAfterCreateUpdateDeleteSuccess } = props
    const selectedTheme = selectTheme()
    const { formatMessage } = useIntl()
    const { editElementDetails: editInstallationRequest } = useInstallationDetails(installationRequestDetails.id)

    const [activeEquipmentButton, setActiveEquipmentButton] = useState<equipmentTypeT>(
        installationRequestDetails.equipmentType,
    )

    const defaultFormValues: Omit<IInstallationRequest, 'updatedAt'> = {
        id: installationRequestDetails.id,
        budget: installationRequestDetails.budget,
        comment: installationRequestDetails.comment,
        createdAt: dayjs.utc(installationRequestDetails.createdAt).local().format('DD/MM/YYYY'),
        equipmentBrand: installationRequestDetails.equipmentBrand,
        equipmentModel: installationRequestDetails.equipmentModel,
        equipmentType: installationRequestDetails.equipmentType,
        status: installationRequestDetails.status,
    }
    /**
     * Function that handle on change  equipment type.
     * When user click on button, the clicked button becomes outlined.
     *
     * @param equipment Equipment string.
     */
    const clickedButtonHandler = (equipment: equipmentTypeT) => {
        setActiveEquipmentButton(equipment)
    }

    return (
        <ThemeProvider theme={selectedTheme}>
            <Dialog
                open={open}
                classes={{
                    paper: 'm-24',
                }}
                fullWidth
                maxWidth="md"
                onClose={handleClosePopup}
            >
                <AppBar position="static" elevation={0}>
                    <Toolbar className="flex w-full justify-between">
                        <Typography variant="h5" color="inherit" className="flex items-center justify-center p-32">
                            {formatMessage({
                                id: "Détail d'une demande",
                                defaultMessage: "Détail d'une demande",
                            })}
                        </Typography>
                        <IconButton
                            color="inherit"
                            data-testid="InstallationsRequestsPopupCloseIcon"
                            onClick={handleClosePopup}
                        >
                            <Icon>close</Icon>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Dialog Content here */}
                <DialogContent>
                    <div className="mb-24">
                        <div className="flex mb-16">
                            <Icon className="sm:inline text-20 sm:text-32 mr-8">support</Icon>
                            <Typography className="text-12 sm:text-18 font-semibold">
                                {formatMessage({ id: 'Demande', defaultMessage: 'Demande' })}
                            </Typography>
                        </div>

                        <Form
                            onSubmit={(data: Omit<IInstallationRequest, 'updatedAt'>) => {
                                const { equipmentType, id, ...restOfData } = data
                                editInstallationRequest({
                                    ...restOfData,
                                    equipmentType: activeEquipmentButton,
                                })
                                handleClosePopup()
                                onAfterCreateUpdateDeleteSuccess()
                            }}
                            defaultValues={defaultFormValues}
                        >
                            <div className="flex items-center mb-12">
                                <Typography variant="subtitle1" className="font-semibold mr-4 whitespace-nowrap">
                                    <span className="hidden font-semibold mr-4 sm:inline">
                                        {formatMessage({
                                            id: `Date de la demande:`,
                                            defaultMessage: `Date de la demande:`,
                                        })}
                                    </span>
                                    <span className="inline font-semibold mr-4 sm:hidden">
                                        {formatMessage({
                                            id: `Date:`,
                                            defaultMessage: `Date:`,
                                        })}
                                    </span>
                                </Typography>
                                <TextField disabled name="createdAt" label="" />
                            </div>
                            {/* Matèriel demandé */}
                            <div className="flex flex-col mb-12">
                                <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                    <span className="hidden font-semibold mr-4 sm:inline">
                                        {formatMessage({
                                            id: `Matériel demandé:`,
                                            defaultMessage: `Matériel demandé:`,
                                        })}
                                    </span>
                                    <span className="inline font-semibold mr-4 sm:hidden">
                                        {formatMessage({
                                            id: `Matériel:`,
                                            defaultMessage: `Matériel:`,
                                        })}
                                    </span>
                                </Typography>
                                <div className="flex items-center justify-evenly flex-wrap">
                                    {Object.keys(equipmentsTypeList).map((equipment) => (
                                        <Button
                                            className="mb-8 rounded-8 mr-12 flex items-center justify-center"
                                            variant={activeEquipmentButton === equipment ? 'contained' : 'outlined'}
                                            onClick={() => clickedButtonHandler(equipment as equipmentTypeT)}
                                        >
                                            <Icon>
                                                {equipmentsTypeList[equipment as keyof typeof equipmentsTypeList].icon}
                                            </Icon>
                                            <span className="ml-4">
                                                {equipmentsTypeList[equipment as keyof typeof equipmentsTypeList].label}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Marque & Modèle */}
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center ">
                                <div className="flex flex-col mr-12 sm:mb-12">
                                    <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                        <span className="font-semibold mr-4">
                                            {formatMessage({
                                                id: `Marque:`,
                                                defaultMessage: `Marque:`,
                                            })}
                                        </span>
                                    </Typography>
                                    <TextField name="equipmentBrand" label="" />
                                </div>
                                <div className="flex flex-col mr-12 sm:mb-12">
                                    <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                        <span className="font-semibold mr-4">
                                            {formatMessage({
                                                id: `Modèle:`,
                                                defaultMessage: `Modèle:`,
                                            })}
                                        </span>
                                    </Typography>
                                    <TextField name="equipmentModel" label="" />
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="flex flex-col mb-12">
                                <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                    <span className="font-semibold mr-4">
                                        {formatMessage({
                                            id: `Budget:`,
                                            defaultMessage: `Budget:`,
                                        })}
                                    </span>
                                </Typography>
                                <TextField name="budget" label="" />
                            </div>

                            {/* Commentaire */}
                            <div className="flex flex-col mb-12">
                                <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                    <span className="font-semibold mr-4">
                                        {formatMessage({
                                            id: `Commentaire`,
                                            defaultMessage: `Commentaire`,
                                        })}
                                    </span>
                                </Typography>
                                <TextField name="comment" label="" />
                            </div>
                            <DialogActions className="justify-center p-4 pb-16">
                                <div className="px-16">
                                    <ButtonResetForm initialValues={defaultFormValues} />
                                </div>
                                <div className="px-16">
                                    <ButtonLoader type="submit">
                                        <TypographyFormatMessage>Valider</TypographyFormatMessage>
                                    </ButtonLoader>
                                </div>
                            </DialogActions>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    )
}
