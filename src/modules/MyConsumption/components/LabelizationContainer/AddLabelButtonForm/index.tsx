import { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import { AddLabelButtonFormProps } from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm/AddLabelButtonForm'
import { ButtonLoader } from 'src/common/ui-kit'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * Button to add a label.
 *
 * @param root0 N/A.
 * @param root0.chartRef Ref of the chart.
 * @param root0.inputPeriodTime Input Period Time.
 * @param root0.setInputPeriodTime Set the input period time.
 * @param root0.equipments The equipments list.
 * @param root0.loadingEquipmentsInProgress Whether the equipments are loading.
 * @param root0.addNewLabel Function to add a new label.
 * @returns JSX Element.
 */
const AddLabelButtonForm = ({
    chartRef,
    inputPeriodTime,
    setInputPeriodTime,
    equipments,
    loadingEquipmentsInProgress,
    addNewLabel,
}: AddLabelButtonFormProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const [isSelectLabelActive, setIsSelectLabelActive] = useState(false)
    const [selectedEquipmentId, setSelectedEquipmentId] = useState('')
    const [equipmentUseType, setEquipmentUseType] = useState('')

    /**
     *  Handle the click on the button.
     */
    const handleBrushSelection = () => {
        if (!chartRef.current || loadingEquipmentsInProgress) return
        if (isSelectLabelActive) {
            setIsSelectLabelActive(false)
            // To Desactivate the cursor
            chartRef.current.getEchartsInstance().dispatchAction({
                type: 'takeGlobalCursor',
            })
            // To clean the brush selected area
            chartRef.current.getEchartsInstance().dispatchAction({
                type: 'brush',
                areas: [],
            })
            // Reset the states
            setInputPeriodTime({
                startTime: '',
                endTime: '',
            })
            setSelectedEquipmentId('')
            setEquipmentUseType('')
        } else {
            setIsSelectLabelActive(true)
            // Activate the cursor with a brush selection on lineX
            chartRef.current.getEchartsInstance().dispatchAction({
                type: 'takeGlobalCursor',
                key: 'brush',
                brushOption: {
                    brushType: 'lineX',
                },
            })
        }
    }

    /**
     *  Handle the click on the button.
     */
    const handleSaveLabel = () => {
        addNewLabel(inputPeriodTime, selectedEquipmentId, equipmentUseType)
    }

    const equipmentLabel = 'Equipement'
    const equipmentUseTypeLabel = "Type d'usage"
    const startTimeLabel = 'De'
    const endTimeLabel = 'À'

    const formControlStyle = {
        '& .MuiInputBase-input': {
            paddingY: '10px',
        },
        '& label': {
            top: '-4px',
        },
    }

    return (
        <div className="flex justify-end items-center gap-24 mx-32">
            {isSelectLabelActive && (
                <div className="flex-1 flex justify-start lg:justify-center pl-0 lg:pl-208">
                    <div className="w-full md:max-w-640 flex flex-col md:flex-row justify-center items-center gap-x-10 gap-y-20">
                        {/* Equipment select */}
                        <FormControl fullWidth className="flex-1" sx={formControlStyle}>
                            <InputLabel id="equipment-select-label">
                                {formatMessage({
                                    id: equipmentLabel,
                                    defaultMessage: equipmentLabel,
                                })}
                            </InputLabel>
                            <Select
                                labelId="equipment-select-label"
                                value={selectedEquipmentId}
                                label={formatMessage({
                                    id: equipmentLabel,
                                    defaultMessage: equipmentLabel,
                                })}
                                onChange={(event) => setSelectedEquipmentId(event.target.value)}
                            >
                                {equipments.map((equipment) => (
                                    <MenuItem key={equipment.id} value={equipment.id}>
                                        {equipment.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Equipment use type */}
                        <FormControl fullWidth className="flex-1" sx={formControlStyle}>
                            <TextField
                                value={equipmentUseType}
                                label={formatMessage({
                                    id: equipmentUseTypeLabel,
                                    defaultMessage: equipmentUseTypeLabel,
                                })}
                                onChange={(event) => {
                                    setEquipmentUseType(event.target.value)
                                }}
                            />
                        </FormControl>

                        <div className="w-full flex-1 flex justify-center items-center gap-10">
                            {/* Start time */}
                            <FormControl className="flex-1" sx={formControlStyle}>
                                <TextField
                                    value={inputPeriodTime?.startTime || ''}
                                    label={formatMessage({
                                        id: startTimeLabel,
                                        defaultMessage: startTimeLabel,
                                    })}
                                    inputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>

                            {/* End time */}
                            <FormControl className="flex-1" sx={formControlStyle}>
                                <TextField
                                    value={inputPeriodTime?.endTime || ''}
                                    label={formatMessage({
                                        id: endTimeLabel,
                                        defaultMessage: endTimeLabel,
                                    })}
                                    inputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            )}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                className="flex flex-col md:flex-row justify-center items-center gap-x-10 gap-y-20"
            >
                {isSelectLabelActive && (
                    <>
                        <Button
                            className="whitespace-nowrap hidden sm:block w-full md:w-auto"
                            variant="contained"
                            color="primary"
                            sx={{ height: '38.7px', borderRadius: 100 }}
                            onClick={() => handleSaveLabel()}
                        >
                            <TypographyFormatMessage>Enregistrer</TypographyFormatMessage>
                        </Button>
                        <IconButton
                            className="flex sm:hidden justify-center items-center"
                            sx={{
                                height: '38.7px',
                                width: '38.7px',
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                },
                            }}
                            onClick={() => handleSaveLabel()}
                        >
                            <SaveIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </>
                )}
                <ButtonLoader
                    inProgress={loadingEquipmentsInProgress}
                    className="whitespace-nowrap hidden sm:block w-full md:w-auto"
                    variant="contained"
                    color="primary"
                    sx={{ height: '38.7px', borderRadius: 100 }}
                    onClick={() => handleBrushSelection()}
                >
                    <TypographyFormatMessage>
                        {isSelectLabelActive ? 'Annuler' : 'Ajouter une étiquette'}
                    </TypographyFormatMessage>
                </ButtonLoader>
                <IconButton
                    className="flex sm:hidden justify-center items-center"
                    sx={{
                        height: '38.7px',
                        width: '38.7px',
                        backgroundColor: loadingEquipmentsInProgress
                            ? theme.palette.grey[300]
                            : theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: loadingEquipmentsInProgress
                                ? theme.palette.grey[300]
                                : theme.palette.primary.main,
                        },
                        color: loadingEquipmentsInProgress ? theme.palette.grey[500] : 'white',
                    }}
                    onClick={() => handleBrushSelection()}
                >
                    {loadingEquipmentsInProgress ? (
                        <CircularProgress size={14} color="inherit" />
                    ) : isSelectLabelActive ? (
                        <ClearIcon sx={{ color: 'white' }} />
                    ) : (
                        <AddIcon sx={{ color: 'white' }} />
                    )}
                </IconButton>
            </motion.div>
        </div>
    )
}

export default AddLabelButtonForm
