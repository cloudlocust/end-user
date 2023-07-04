import {
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Icon,
    ThemeProvider,
    DialogContent,
    Button,
    DialogActions,
} from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { equipmentsTypeList } from 'src/modules/InstallationRequests'
import { equipmentTypeT } from 'src/modules/InstallationRequests/installationRequests'
import { SolarEquipmentCreateUpdateProps } from 'src/modules/SolarEquipments/components/SolarEquipmentCreateUpdate/solarEquipmentCreateUpdate.d'
import { solarEquipmentInputType } from 'src/modules/SolarEquipments/solarEquipments'
import { useSolarEquipmentsDetails, useSolarEquipmentsList } from 'src/modules/SolarEquipments/solarEquipmentsHook'

/**
 * SolarEquipmentCreateUpdate component, it handles creation & update.
 *
 * @param props SolarEquipmentCreateUpdate component Props.
 * @returns SolarEquipmentCreateUpdate JSX.
 */
export const SolarEquipmentCreateUpdate = (props: SolarEquipmentCreateUpdateProps) => {
    const { open, onClose, solarEquipmentDetails, reloadSolarEquipmentsList } = props
    const selectedTheme = selectTheme()
    const { formatMessage } = useIntl()
    const { addElement: addEquipment, loadingInProgress: createSolarEquipmentInProgress } = useSolarEquipmentsList()
    const { editElementDetails: updateEquipmentDetails, loadingInProgress: updateEquipmentDetailsInProgress } =
        useSolarEquipmentsDetails(solarEquipmentDetails?.id ?? -1)
    const [activeEquipmentButton, setActiveEquipmentButton] = useState<equipmentTypeT | null>(
        solarEquipmentDetails ? solarEquipmentDetails.type : null,
    )

    const defaultFormValues = {
        brand: solarEquipmentDetails?.brand,
        installedAt: solarEquipmentDetails?.installedAt,
        reference: solarEquipmentDetails?.reference,
        type: solarEquipmentDetails?.type,
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
                onClose={onClose}
                classes={{
                    paper: 'm-24',
                }}
                fullWidth
                maxWidth="md"
            >
                <AppBar position="static" elevation={0}>
                    <Toolbar className="flex w-full justify-between">
                        <Typography variant="h5" color="inherit" className="flex items-center justify-center p-32">
                            {formatMessage({
                                id: solarEquipmentDetails ? 'Mon équipement' : 'Ajouter mon équipement',
                                defaultMessage: solarEquipmentDetails ? 'Mon équipement' : 'Ajouter mon équipement',
                            })}
                        </Typography>
                        <IconButton color="inherit" data-testid="solrEquipmentCloseIcon" onClick={onClose}>
                            <Icon>close</Icon>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <div className="mb-24">
                        <Form
                            onSubmit={async (data: solarEquipmentInputType) => {
                                solarEquipmentDetails
                                    ? await updateEquipmentDetails({
                                          ...data,
                                          type: activeEquipmentButton!,
                                      })
                                    : await addEquipment({
                                          ...data,
                                          type: activeEquipmentButton!,
                                      })
                                onClose()
                                reloadSolarEquipmentsList()
                            }}
                            defaultValues={solarEquipmentDetails ? defaultFormValues : undefined}
                        >
                            {/* Matèriel demandé */}
                            <div className="flex flex-col mb-12">
                                <Typography
                                    variant="subtitle1"
                                    className="text-center md:text-left font-semibold mb-16 whitespace-nowrap"
                                >
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
                                <DatePicker
                                    name="installedAt"
                                    label="Date d'installation"
                                    validateFunctions={[requiredBuilder()]}
                                />
                            </div>

                            {/* Brand */}
                            <div className="flex flex-col">
                                <TextField name="brand" label="Marque" validateFunctions={[requiredBuilder()]} />
                            </div>

                            {/* Reference */}
                            <div className="flex flex-col mb-12">
                                <TextField name="reference" label="Modèle" validateFunctions={[requiredBuilder()]} />
                            </div>

                            <DialogActions className="justify-center p-4 pb-16">
                                <div className="px-16">
                                    <ButtonResetForm
                                        initialValues={() => (solarEquipmentDetails ? defaultFormValues : {})}
                                    />
                                </div>
                                <div className="px-16">
                                    <ButtonLoader
                                        type="submit"
                                        inProgress={
                                            solarEquipmentDetails
                                                ? updateEquipmentDetailsInProgress
                                                : createSolarEquipmentInProgress
                                        }
                                        disabled={!Boolean(activeEquipmentButton)}
                                    >
                                        <TypographyFormatMessage>
                                            {solarEquipmentDetails ? 'Modifier' : 'Ajouter'}
                                        </TypographyFormatMessage>
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
