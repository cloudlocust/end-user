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
import { ThemeProvider } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { equipmentsTypeList } from 'src/modules/InstallationRequests'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useState } from 'react'
import { equipmentTypeT } from 'src/modules/InstallationRequests/installationRequests'
import { EquipmentRequestCreatePopupProps } from 'src/modules/EquipmentRequests/EquipmentRequestsCreatePopup/equipmentRequestsCreatePopup'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { useEquipmentRequestsList } from 'src/modules/EquipmentRequests/EquipmentRequestsHook'
import { createEquipmentRequestType } from 'src/modules/EquipmentRequests/equipmentRequests'

/**
 * Equipment request creation popup component.
 *
 * @param props Props relevant to equipment request creation popup.
 * @returns JSX for equipment request creation.
 */
export const EquipmentnRequestCreatePopup = (props: EquipmentRequestCreatePopupProps) => {
    const { handleClosePopup, open, onAfterCreateUpdateDeleteSuccess } = props
    const { loadingInProgress, addElement } = useEquipmentRequestsList()
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
                                id: "Demande d'équipement",
                                defaultMessage: "Demande d'équipement",
                            })}
                        </Typography>
                        <IconButton
                            color="inherit"
                            data-testid="EquipmentRequestsPopupCloseIcon"
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
                            onSubmit={async (data: createEquipmentRequestType) => {
                                const { type, ...restOfData } = data
                                await addElement({
                                    ...restOfData,
                                    type: activeEquipmentButton!,
                                })
                                handleClosePopup()
                                onAfterCreateUpdateDeleteSuccess()
                            }}
                        >
                            {/* Matèriel demandé */}
                            <div className="flex flex-col mb-12">
                                <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                    <span className="font-semibold mr-4 sm:inline">
                                        {formatMessage({
                                            id: `Quel est votre matériel ?`,
                                            defaultMessage: `Quel est votre matériel ?`,
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

                            {/* Installed At */}
                            <div className="flex flex-col mb-12">
                                <div className="flex flex-col mr-12 sm:mb-12">
                                    <Typography variant="subtitle1" className="font-semibold whitespace-nowrap">
                                        <span className="font-semibold">
                                            {formatMessage({
                                                id: `Quand votre matériel a été posé ?`,
                                                defaultMessage: `Quand votre matériel a été posé ?`,
                                            })}
                                        </span>
                                    </Typography>
                                    <DatePicker name="installedAt" validateFunctions={[requiredBuilder()]} />
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="flex flex-col mb-12">
                                <div className="flex flex-col mr-12 sm:mb-12">
                                    <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                        <span className="font-semibold mr-4">
                                            {formatMessage({
                                                id: `Quelle est votre marque ?`,
                                                defaultMessage: `Quelle est votre marque ?`,
                                            })}
                                        </span>
                                    </Typography>
                                    <TextField name="brand" label="" validateFunctions={[requiredBuilder()]} />
                                </div>
                            </div>

                            {/* Reference */}
                            <div className="flex flex-col mb-12">
                                <Typography variant="subtitle1" className="font-semibold mb-8 whitespace-nowrap">
                                    <span className="font-semibold mr-4">
                                        {formatMessage({
                                            id: `Quel est le modèle ?`,
                                            defaultMessage: `Quel est le modèle ?`,
                                        })}
                                    </span>
                                </Typography>
                                <TextField name="reference" label="" validateFunctions={[requiredBuilder()]} />
                            </div>

                            <DialogActions className="justify-center p-4 pb-16">
                                <div className="px-16">
                                    <ButtonResetForm initialValues={() => {}} />
                                </div>
                                <div className="px-16">
                                    <ButtonLoader
                                        inProgress={loadingInProgress}
                                        type="submit"
                                        disabled={!Boolean(activeEquipmentButton)}
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
