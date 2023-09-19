import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import CustomRadioGroup from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import CustomRadioButton from 'src/modules/shared/CustomRadioButton/CustomRadioButton'
import {
    ConfigurationStepProps,
    RadioGroupOnChangeHandler,
    SelectOnChangeHandler,
} from 'src/modules/MyHouse/components/MicrowaveMeasurement/MicrowaveMeasurement'

/**
 * ConfigurationStep component.
 *
 * @param root0 N/A.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The ConfigurationStep component.
 */
const ConfigurationStep = ({ stepSetter }: ConfigurationStepProps) => {
    const [selectedMicrowave, setSelectedMicrowave] = useState('')
    const [measuringMode, setMeasuringMode] = useState('')

    /**
     * The select onChange handler function.
     *
     * @param e The onChange event.
     */
    const handleSelectMicrowaveChange: SelectOnChangeHandler = (e) => {
        setSelectedMicrowave(e.target.value)
    }

    /**
     * The radio group onChange handler function.
     *
     * @param v The new value after the change.
     */
    const handleRadioGroupChange: RadioGroupOnChangeHandler = (v) => {
        setMeasuringMode(v)
    }

    /**
     * Click handler for the button Suivant.
     */
    const handleBtnClick = () => {
        stepSetter(2)
    }

    return (
        <Box>
            {/* Header */}
            <Box textAlign="center" marginBottom="20px">
                <Typography component="h2" fontWeight="500" fontSize="18px" color="primary">
                    Configuration
                </Typography>
            </Box>

            {/* Content */}
            <Box>
                {/* Select the microwave */}
                <Box marginBottom="20px">
                    <Typography marginBottom="10px" fontWeight="500">
                        Selectionner le micro-onde à mesurer
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Mon équipement</InputLabel>
                        <Select value={selectedMicrowave} label="Mon équipement" onChange={handleSelectMicrowaveChange}>
                            <MenuItem value="micro-onde-1">Micro-onde 1</MenuItem>
                            <MenuItem value="micro-onde-2">Micro-onde 2</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Select the microwave */}
                <Box marginBottom="30px">
                    <Typography marginBottom="10px" fontWeight="500">
                        Selectionner le mode à mesurer
                    </Typography>
                    <CustomRadioGroup
                        defaultValue={measuringMode}
                        onValueChange={handleRadioGroupChange}
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        sx={{
                            '& > *': {
                                width: 'calc((100% - 10px) / 3)',
                            },
                        }}
                    >
                        <CustomRadioButton value="standard" label="Standard" />
                        <CustomRadioButton value="decongelation" label="Décongélation" />
                        <CustomRadioButton value="grill" label="Grill" />
                    </CustomRadioGroup>
                </Box>

                {/* Warning */}
                <Box display="flex" alignItems="center" gap="10px" marginBottom="20px">
                    <WarningRoundedIcon fontSize="large" color="secondary" />
                    <Typography>Attention à ne pas trop perturber le flux électrique durant le test</Typography>
                </Box>

                {/* The test starting button */}
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={handleBtnClick}
                        disabled={!selectedMicrowave || !measuringMode}
                    >
                        Suivant
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ConfigurationStep
