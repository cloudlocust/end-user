import { useIntl } from 'src/common/react-platform-translation'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { CustomRadioGroup } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import {
    ConfigurationStepProps,
    RadioGroupOnChangeHandler,
    SelectOnChangeHandler,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/ConfigurationStep/ConfigurationStep.d'

/**
 * ConfigurationStep component.
 *
 * @param root0 N/A.
 * @param root0.equipmentsNumber The number of microwaves.
 * @param root0.selectedMicrowave The state that hold the selected microwave.
 * @param root0.setSelectedMicrowave The setter associated to the selected microwave state.
 * @param root0.measurementModes Measurement modes for the Equipment.
 * @param root0.selectedMeasurementMode The state that hold the selected measurement mode.
 * @param root0.setSelectedMeasurementMode The setter associated to the measurement mode state.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The ConfigurationStep component.
 */
export const ConfigurationStep = ({
    equipmentsNumber,
    selectedMicrowave,
    setSelectedMicrowave,
    measurementModes,
    selectedMeasurementMode,
    setSelectedMeasurementMode,
    stepSetter,
}: ConfigurationStepProps) => {
    const { formatMessage } = useIntl()

    /**
     * The select onChange handler function.
     *
     * @param event The onChange event.
     */
    const handleSelectMicrowaveChange: SelectOnChangeHandler = (event) => {
        setSelectedMicrowave(event.target.value)
    }

    /**
     * The radio group onChange handler function.
     *
     * @param value The new value after the change.
     */
    const handleRadioGroupChange: RadioGroupOnChangeHandler = (value) => {
        setSelectedMeasurementMode(value)
    }

    /**
     * Click handler for the button Suivant.
     */
    const handleBtnClick = () => {
        stepSetter(2)
    }

    const monEquipementStr = 'Mon équipement'

    const measurementModesOptions = measurementModes?.map((measurementMode) => ({
        value: measurementMode,
        label: measurementMode,
    }))

    const defaultMicrowaveMeasurementModesOptions = [
        {
            value: 'Standard',
            label: 'Standard',
        },
        {
            value: 'Décongélation',
            label: 'Décongélation',
        },
        {
            value: 'Grill',
            label: 'Grill',
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="text-center mb-20">
                <Typography component="h2" fontWeight="500" fontSize="18px" color="primary">
                    {formatMessage({
                        id: 'Configuration',
                        defaultMessage: 'Configuration',
                    })}
                </Typography>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-evenly">
                {/* Select the microwave */}
                {equipmentsNumber > 1 && (
                    <div className="mb-20">
                        <TypographyFormatMessage marginBottom="15px" fontWeight="500">
                            Sélectionner le micro-onde à mesurer
                        </TypographyFormatMessage>
                        <FormControl fullWidth>
                            <InputLabel id="microwave-select-label">
                                {formatMessage({
                                    id: monEquipementStr,
                                    defaultMessage: monEquipementStr,
                                })}
                            </InputLabel>
                            <Select
                                labelId="microwave-select-label"
                                id="microwave-select"
                                value={selectedMicrowave}
                                label={formatMessage({
                                    id: monEquipementStr,
                                    defaultMessage: monEquipementStr,
                                })}
                                onChange={handleSelectMicrowaveChange}
                            >
                                {Array(equipmentsNumber)
                                    .fill(null)
                                    .map((_, index) => (
                                        <MenuItem value={index + 1}>Micro-onde {index + 1}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                )}

                {/* Select the measurement mode */}
                <div className="mb-20">
                    <TypographyFormatMessage marginBottom="15px" fontWeight="500">
                        Choisir le réglage à mesurer
                    </TypographyFormatMessage>
                    <CustomRadioGroup
                        elements={measurementModesOptions || defaultMicrowaveMeasurementModesOptions}
                        initialValue={selectedMeasurementMode}
                        onValueChange={handleRadioGroupChange}
                        boxClassName="w-full flex justify-between gap-10"
                    />
                </div>

                {/* Warning */}
                <div className="flex items-center gap-7 mb-20">
                    <WarningRoundedIcon fontSize="large" color="secondary" />
                    <TypographyFormatMessage>
                        Attention : si vous lancez un autre appareil au même moment, cela risque de fausser la mesure.
                    </TypographyFormatMessage>
                </div>
            </div>

            {/* The test starting button */}
            <div className="flex justify-center">
                <Button
                    variant="contained"
                    sx={{ padding: '10px auto', textAlign: 'center', minWidth: '210px' }}
                    onClick={handleBtnClick}
                    disabled={!selectedMicrowave || !selectedMeasurementMode}
                >
                    {formatMessage({
                        id: 'Suivant',
                        defaultMessage: 'Suivant',
                    })}
                </Button>
            </div>
        </>
    )
}
