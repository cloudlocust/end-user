import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'src/common/react-platform-translation'
import IconButton from '@mui/material/IconButton'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import { AddLabelButtonFormProps } from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm/AddLabelButtonForm'
import { ButtonLoader, MuiTextField } from 'src/common/ui-kit'
import CircularProgress from '@mui/material/CircularProgress'
import { useFormContext } from 'react-hook-form'
import { requiredBuilder, regex } from 'src/common/react-platform-components'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes'

/**
 * Button to add a label.
 *
 * @param root0 N/A.
 * @param root0.chartRef Ref of the chart.
 * @param root0.inputPeriodTime Input Period Time.
 * @param root0.setInputPeriodTime Set the input period time.
 * @param root0.equipments The equipments list.
 * @param root0.addingLabelsIsDisabled Weather the creation of labels is disabled.
 * @param root0.range The current range of the metrics.
 * @returns JSX Element.
 */
const AddLabelButtonForm = ({
    chartRef,
    inputPeriodTime,
    setInputPeriodTime,
    equipments,
    addingLabelsIsDisabled,
    range,
}: AddLabelButtonFormProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { setValue } = useFormContext()
    const [isSelectLabelActive, setIsSelectLabelActive] = useState(false)

    /**
     *  Handle the click on the button.
     */
    const handleBrushSelection = () => {
        if (!chartRef.current || addingLabelsIsDisabled) return
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
                startTime: undefined,
                endTime: undefined,
            })
            setValue('housingEquipmentId', '')
            setValue('useType', '')
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

    useEffect(() => {
        setIsSelectLabelActive(false)
    }, [range])

    useEffect(() => {
        setValue('startDate', inputPeriodTime.startTime ?? '')
        setValue('endDate', inputPeriodTime.endTime ?? '')
        if (inputPeriodTime.startTime === undefined && inputPeriodTime.endTime === undefined) {
            setValue('housingEquipmentId', '')
            setValue('useType', '')
        }
    }, [inputPeriodTime.endTime, inputPeriodTime.startTime, setValue])

    /**
     * Get the index of the label.
     *
     * @param label The label to get the index of.
     * @returns The index of the label.
     */
    const getIndexOfXAxisLabel = (label: string) => {
        const labelParts = label.split(':')
        if (
            labelParts.length !== 2 ||
            labelParts[0].length !== 2 ||
            labelParts[1].length !== 2 ||
            isNaN(Number(labelParts[0])) ||
            Number(labelParts[0]) < 0 ||
            Number(labelParts[0]) > 23 ||
            isNaN(Number(labelParts[1])) ||
            Number(labelParts[1]) < 0 ||
            Number(labelParts[1]) > 59
        )
            return null
        return Number(labelParts[0]) * 60 + Number(labelParts[1]) - 1
    }

    return (
        <div className="flex justify-end items-center gap-24 mx-32">
            {isSelectLabelActive && (
                <div className="flex-1 flex justify-start lg:justify-center pl-0 lg:pl-208">
                    <div className="w-full md:max-w-640 flex flex-col md:flex-row justify-center items-start gap-x-10 gap-y-20">
                        {/* Equipment select */}
                        <div className="flex-1 w-full">
                            <Select
                                name="housingEquipmentId"
                                label={formatMessage({
                                    id: 'Equipement',
                                    defaultMessage: 'Equipement',
                                })}
                                validateFunctions={[requiredBuilder()]}
                            >
                                {equipments.map((equipment) => (
                                    <MenuItem key={equipment.id} value={equipment.id}>
                                        {equipment.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        {/* Equipment use type */}
                        <div className="flex-1 w-full">
                            <MuiTextField
                                name="useType"
                                label={formatMessage({
                                    id: "Type d'usage",
                                    defaultMessage: "Type d'usage",
                                })}
                                className="w-full"
                            />
                        </div>

                        <div className="w-full flex-1 flex justify-center items-start gap-10">
                            {/* Start time */}
                            <div className="flex-1 w-full">
                                <MuiTextField
                                    name="startDate"
                                    value={inputPeriodTime.startTime}
                                    label={formatMessage({
                                        id: 'De',
                                        defaultMessage: 'De',
                                    })}
                                    validateFunctions={[
                                        requiredBuilder(),
                                        regex(
                                            '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$',
                                            'Veuillez entrer une heure valide (format HH:MM)',
                                        ),
                                        (): JSX.Element | undefined => {
                                            const startIndex = getIndexOfXAxisLabel(inputPeriodTime.startTime ?? '')
                                            const endIndex = getIndexOfXAxisLabel(inputPeriodTime.endTime ?? '')
                                            if (startIndex !== null && endIndex !== null && startIndex >= endIndex) {
                                                return (
                                                    <FormattedMessage
                                                        id="L'heure de début doit être inférieure à l'heure de fin"
                                                        defaultMessage="L'heure de début doit être inférieure à l'heure de fin"
                                                    />
                                                )
                                            }
                                            return undefined
                                        },
                                    ]}
                                    placeholder="00:00"
                                    className="w-full"
                                    onChange={(e) => {
                                        const startIndex = getIndexOfXAxisLabel(e.target.value)
                                        const endIndex = getIndexOfXAxisLabel(inputPeriodTime.endTime ?? '')
                                        if (startIndex !== null && endIndex !== null && startIndex < endIndex) {
                                            chartRef.current.getEchartsInstance().dispatchAction({
                                                type: 'brush',
                                                areas: [
                                                    {
                                                        brushType: 'lineX',
                                                        xAxisIndex: 0,
                                                        coordRange: [startIndex, endIndex],
                                                    },
                                                ],
                                            })
                                        } else {
                                            chartRef.current.getEchartsInstance().dispatchAction({
                                                type: 'brush',
                                                areas: [],
                                            })
                                            setInputPeriodTime((prevState: IPeriodTime) => ({
                                                ...prevState,
                                                startTime: e.target.value,
                                            }))
                                        }
                                    }}
                                />
                            </div>

                            {/* End time */}
                            <div className="flex-1 w-full">
                                <MuiTextField
                                    name="endDate"
                                    value={inputPeriodTime.endTime}
                                    label={formatMessage({
                                        id: 'À',
                                        defaultMessage: 'À',
                                    })}
                                    validateFunctions={[
                                        requiredBuilder(),
                                        regex(
                                            '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$',
                                            'Veuillez entrer une heure valide (format HH:MM)',
                                        ),
                                        (): JSX.Element | undefined => {
                                            const startIndex = getIndexOfXAxisLabel(inputPeriodTime.startTime ?? '')
                                            const endIndex = getIndexOfXAxisLabel(inputPeriodTime.endTime ?? '')
                                            if (startIndex !== null && endIndex !== null && startIndex >= endIndex) {
                                                return (
                                                    <FormattedMessage
                                                        id="L'heure de fin doit être supérieure à l'heure de début"
                                                        defaultMessage="L'heure de fin doit être supérieure à l'heure de début"
                                                    />
                                                )
                                            }
                                            return undefined
                                        },
                                    ]}
                                    placeholder="00:00"
                                    className="w-full"
                                    onChange={(e) => {
                                        const startIndex = getIndexOfXAxisLabel(inputPeriodTime.startTime ?? '')
                                        const endIndex = getIndexOfXAxisLabel(e.target.value)
                                        if (startIndex !== null && endIndex !== null && startIndex < endIndex) {
                                            chartRef.current.getEchartsInstance().dispatchAction({
                                                type: 'brush',
                                                areas: [
                                                    {
                                                        brushType: 'lineX',
                                                        xAxisIndex: 0,
                                                        coordRange: [startIndex, endIndex],
                                                    },
                                                ],
                                            })
                                        } else {
                                            chartRef.current.getEchartsInstance().dispatchAction({
                                                type: 'brush',
                                                areas: [],
                                            })
                                            setInputPeriodTime((prevState: IPeriodTime) => ({
                                                ...prevState,
                                                endTime: e.target.value,
                                            }))
                                        }
                                    }}
                                />
                            </div>
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
                        <ButtonLoader
                            inProgress={addingLabelsIsDisabled}
                            className="whitespace-nowrap hidden sm:block w-full md:w-auto"
                            variant="contained"
                            color="primary"
                            sx={{ height: '38.7px', borderRadius: 100 }}
                            type="submit"
                        >
                            <TypographyFormatMessage>Enregistrer</TypographyFormatMessage>
                        </ButtonLoader>
                        <IconButton
                            className="flex sm:hidden justify-center items-center"
                            sx={{
                                height: '38.7px',
                                width: '38.7px',
                                backgroundColor: addingLabelsIsDisabled
                                    ? theme.palette.grey[300]
                                    : theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: addingLabelsIsDisabled
                                        ? theme.palette.grey[300]
                                        : theme.palette.primary.main,
                                },
                                color: addingLabelsIsDisabled ? theme.palette.grey[500] : 'white',
                            }}
                            type="submit"
                        >
                            {addingLabelsIsDisabled ? (
                                <CircularProgress size={14} color="inherit" />
                            ) : (
                                <SaveIcon sx={{ color: 'white' }} />
                            )}
                        </IconButton>
                    </>
                )}
                <ButtonLoader
                    inProgress={addingLabelsIsDisabled}
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
                        backgroundColor: addingLabelsIsDisabled ? theme.palette.grey[300] : theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: addingLabelsIsDisabled
                                ? theme.palette.grey[300]
                                : theme.palette.primary.main,
                        },
                        color: addingLabelsIsDisabled ? theme.palette.grey[500] : 'white',
                    }}
                    onClick={() => handleBrushSelection()}
                >
                    {addingLabelsIsDisabled ? (
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
