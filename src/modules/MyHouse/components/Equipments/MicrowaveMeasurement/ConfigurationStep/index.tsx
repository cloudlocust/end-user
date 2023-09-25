import { useIntl } from 'react-intl'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { CustomRadioGroup } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import {
    ConfigurationStepProps,
    RadioGroupOnChangeHandler,
    SelectOnChangeHandler,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'

/**
 * ConfigurationStep component.
 *
 * @param root0 N/A.
 * @param root0.equipmentsNumber The number of microwaves.
 * @param root0.selectedMicrowave The state that hold the selected microwave.
 * @param root0.setSelectedMicrowave The setter associated to the selected microwave state.
 * @param root0.measurementMode The state that hold the measurement mode.
 * @param root0.setMeasurementMode The setter associated to the measurement mode state.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The ConfigurationStep component.
 */
export const ConfigurationStep = ({
    equipmentsNumber,
    selectedMicrowave,
    setSelectedMicrowave,
    measurementMode,
    setMeasurementMode,
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
        setMeasurementMode(value)
    }

    /**
     * Click handler for the button Suivant.
     */
    const handleBtnClick = () => {
        stepSetter(2)
    }

    const monEquipementStr = 'Mon équipement'

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
            <div>
                {/* Select the microwave */}
                <div className="mb-20">
                    <Typography marginBottom="15px" fontWeight="500">
                        {formatMessage({
                            id: 'Selectionner le micro-onde à mesurer',
                            defaultMessage: 'Selectionner le micro-onde à mesurer',
                        })}
                    </Typography>
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
                            {Array(equipmentsNumber).map((_, index) => (
                                <MenuItem value={`micro-onde-${index + 1}`}>Micro-onde {index + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Select the microwave */}
                <div className="mb-20">
                    <Typography marginBottom="15px" fontWeight="500">
                        {formatMessage({
                            id: 'Selectionner le mode à mesurer',
                            defaultMessage: 'Selectionner le mode à mesurer',
                        })}
                    </Typography>
                    <CustomRadioGroup
                        elements={[
                            { value: 'Standard', label: 'Standard' },
                            { value: 'Décongélation', label: 'Décongélation' },
                            { value: 'Grill', label: 'Grill' },
                        ]}
                        defaultValue={measurementMode}
                        onValueChange={handleRadioGroupChange}
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        sx={{
                            '& > *': {
                                width: 'calc((100% - 10px) / 3)',
                            },
                        }}
                    />
                </div>

                {/* Warning */}
                <div className="flex items-center gap-7 mb-20">
                    <WarningRoundedIcon fontSize="large" color="secondary" />
                    <Typography>
                        {formatMessage({
                            id: 'Attention à ne pas trop perturber le flux électrique durant le test',
                            defaultMessage: 'Attention à ne pas trop perturber le flux électrique durant le test',
                        })}
                    </Typography>
                </div>

                {/* The test starting button */}
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={handleBtnClick}
                        disabled={!selectedMicrowave || !measurementMode}
                    >
                        {formatMessage({
                            id: 'Suivant',
                            defaultMessage: 'Suivant',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}
