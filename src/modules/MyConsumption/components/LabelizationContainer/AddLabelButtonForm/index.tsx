import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import MenuItem from '@mui/material/MenuItem'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { AddLabelButtonFormProps } from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm/AddLabelButtonForm'
import { ButtonLoader, MuiTextField } from 'src/common/ui-kit'
import { useFormContext } from 'react-hook-form'
import { requiredBuilder } from 'src/common/react-platform-components'

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
 * @param root0.chartData The chart data.
 * @returns JSX Element.
 */
const AddLabelButtonForm = ({
    chartRef,
    inputPeriodTime,
    setInputPeriodTime,
    equipments,
    addingLabelsIsDisabled,
    range,
    chartData,
}: AddLabelButtonFormProps) => {
    const { formatMessage } = useIntl()
    const { setValue, watch, clearErrors, reset, formState } = useFormContext()
    const [labelingInProcess, setLabelingInProcess] = useState(false)

    /**
     * Reset the form fields.
     */
    const resetFormFields = useCallback(() => {
        reset()
        setInputPeriodTime({
            startTime: undefined,
            endTime: undefined,
        })
        setValue('housingEquipmentId', '')
        setValue('useType', '')
    }, [reset, setInputPeriodTime, setValue])

    /**
     *  Canceling the labeling.
     */
    const cancelLabelingProcess = () => {
        if (!chartRef.current) return
        setLabelingInProcess(false)
        chartRef.current.getEchartsInstance()?.dispatchAction({
            type: 'brush',
            areas: [],
        })
        resetFormFields()
        clearErrors()
    }

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.getEchartsInstance()?.dispatchAction({
                type: 'takeGlobalCursor',
                key: 'brush',
                brushOption: {
                    brushType: 'lineX',
                },
            })
        }
    }, [chartRef, chartData])

    useEffect(() => {
        setValue('startDate', inputPeriodTime.startTime ?? '')
        setValue('endDate', inputPeriodTime.endTime ?? '')
        if (inputPeriodTime.startTime === undefined && inputPeriodTime.endTime === undefined) {
            setValue('housingEquipmentId', '')
            setValue('useType', '')
            setLabelingInProcess(false)
        }
    }, [inputPeriodTime.endTime, inputPeriodTime.startTime, setValue])

    const startDate = watch('startDate')
    const endDate = watch('endDate')
    const housingEquipmentId = watch('housingEquipmentId')
    const useType = watch('useType')

    useEffect(() => {
        resetFormFields()
    }, [resetFormFields, range])

    useEffect(() => {
        if (startDate || endDate || housingEquipmentId || useType || formState.isDirty) {
            setLabelingInProcess(true)
        } else {
            setLabelingInProcess(false)
        }
    }, [startDate, endDate, housingEquipmentId, useType, formState.isDirty])

    return (
        <div className="flex flex-col sm:flex-row justify-end items-center mx-32 gap-24 relative">
            <div className="flex-1 flex justify-start lg:justify-center">
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
                                inputProps={{
                                    readOnly: true,
                                }}
                                focused={inputPeriodTime.startTime !== undefined}
                                validateFunctions={[requiredBuilder()]}
                                className="w-full"
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
                                inputProps={{
                                    readOnly: true,
                                }}
                                focused={inputPeriodTime.endTime !== undefined}
                                validateFunctions={[requiredBuilder()]}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                className="flex flex-row sm:flex-col md:flex-row justify-center items-center gap-x-10 gap-y-20 lg:absolute lg:right-0"
            >
                <ButtonLoader
                    inProgress={addingLabelsIsDisabled}
                    className="whitespace-nowrap w-full md:w-auto"
                    variant="contained"
                    color="primary"
                    sx={{ height: '38.7px', borderRadius: 100 }}
                    type="submit"
                    disabled={!labelingInProcess}
                >
                    <TypographyFormatMessage>Ajouter</TypographyFormatMessage>
                </ButtonLoader>
                <ButtonLoader
                    inProgress={addingLabelsIsDisabled}
                    className="whitespace-nowrap w-full md:w-auto"
                    variant="contained"
                    color="primary"
                    sx={{ height: '38.7px', borderRadius: 100 }}
                    onClick={() => cancelLabelingProcess()}
                    disabled={!labelingInProcess}
                >
                    <TypographyFormatMessage>Annuler</TypographyFormatMessage>
                </ButtonLoader>
            </motion.div>
        </div>
    )
}

export default AddLabelButtonForm
