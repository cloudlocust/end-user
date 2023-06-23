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
import { InstallationRequestCreatePopupProps } from 'src/modules/InstallationRequests/components/InstallationRequestCreatePopup/installationRequestCreatePopup.d'
import { ThemeProvider } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { equipmentsTypeList } from 'src/modules/InstallationRequests'
import { Form } from 'src/common/react-platform-components'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useState } from 'react'
import { createInstallationRequestType, equipmentTypeT } from 'src/modules/InstallationRequests/installationRequests'
import { useInstallationRequestsList } from 'src/modules/InstallationRequests/installationRequestsHooks'

/**
 * Installation request creation popup component.
 *
 * @param props Props relevant to Installation request creation popup.
 * @returns JSX for installation request creation.
 */
export const InstallationRequestCreatePopup = (props: InstallationRequestCreatePopupProps) => {
    const { handleClosePopup, open, onAfterCreateUpdateDeleteSuccess } = props
    const { loadingInProgress, addElement } = useInstallationRequestsList()
    const [activeEquipmentButton, setActiveEquipmentButton] = useState<equipmentTypeT | null>(null)

    const selectedTheme = selectTheme()
    const { formatMessage } = useIntl()

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
                                id: "Demande d'installation",
                                defaultMessage: "Demande d'installation",
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
                        <Form
                            onSubmit={async (data: createInstallationRequestType) => {
                                const { equipmentType, ...restOfData } = data
                                await addElement({
                                    ...restOfData,
                                    equipmentType: activeEquipmentButton!,
                                })
                                handleClosePopup()
                                onAfterCreateUpdateDeleteSuccess()
                            }}
                        >
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
                                    <ButtonResetForm initialValues={() => {}} />
                                </div>
                                <div className="px-16">
                                    <ButtonLoader
                                        inProgress={loadingInProgress}
                                        disabled={!Boolean(activeEquipmentButton)}
                                        type="submit"
                                    >
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
