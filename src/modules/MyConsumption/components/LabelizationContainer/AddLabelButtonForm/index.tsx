import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'src/common/react-platform-translation'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { MenuItem, Divider, Button, SvgIcon, ListSubheader } from '@mui/material'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { AddLabelButtonFormProps } from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm/AddLabelButtonForm'
import { ButtonLoader, MuiTextField } from 'src/common/ui-kit'
import { useFormContext, Controller } from 'react-hook-form'
import { requiredBuilder, validators } from 'src/common/react-platform-components'
import { AddEquipmentPopup } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import { getAvailableEquipments } from 'src/modules/MyHouse/components/Equipments/utils'
import {
    mappingEquipmentNameToType,
    mapppingEquipmentToLabel,
    myEquipmentOptions,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import _ from 'lodash'
import TextField from '@mui/material/TextField'

/**
 * Button to add a label.
 *
 * @param root0 N/A.
 * @param root0.chartRef Ref of the chart.
 * @param root0.inputPeriodTime Input Period Time.
 * @param root0.setInputPeriodTime Set the input period time.
 * @param root0.isAddingLabelInProgress Whether adding label is in progress.
 * @param root0.range The current range of the metrics.
 * @param root0.chartData The chart data.
 * @returns JSX Element.
 */
const AddLabelButtonForm = ({
    chartRef,
    inputPeriodTime,
    setInputPeriodTime,
    isAddingLabelInProgress,
    range,
    chartData,
}: AddLabelButtonFormProps) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { formatMessage } = useIntl()
    const {
        setValue,
        watch,
        clearErrors,
        formState,
        formState: { errors },
        control,
    } = useFormContext()
    const [labelingInProcess, setLabelingInProcess] = useState(false)
    const [isAddEquipmentPopupOpen, setIsAddEquipmentPopupOpen] = useState(false)
    const [addedEquipmentId, setAddedEquipmentId] = useState<number | null>(null)
    const {
        equipmentsList,
        housingEquipmentsList,
        addHousingEquipment,
        loadingEquipmentInProgress,
        addEquipment,
        isAddEquipmentLoading,
    } = useEquipmentList(currentHousing?.id)

    // TODO: Refactor this to avoid repeating the same code in several places.
    const mappedHousingEquipmentsList = useMemo(
        () =>
            housingEquipmentsList
                ?.filter(
                    (housingEquipment) =>
                        housingEquipment.equipment.allowedType.includes('existant') ||
                        housingEquipment.equipment.allowedType.includes('electricity'),
                )
                ?.map((housingEquipment) => {
                    const equipmentOption = myEquipmentOptions.find(
                        (option) => option.name === housingEquipment.equipment.name,
                    )
                    return {
                        id: housingEquipment.equipmentId,
                        housingEquipmentId: housingEquipment.id,
                        name: housingEquipment.equipment.name,
                        equipmentLabel: equipmentOption?.labelTitle || housingEquipment.equipment.name,
                        iconComponent: equipmentOption?.iconComponent,
                        allowedType: housingEquipment.equipment.allowedType,
                        number: housingEquipment.equipmentNumber,
                        isNumber:
                            mappingEquipmentNameToType[housingEquipment.equipment.name as equipmentNameType] ===
                            'number',
                        measurementModes: housingEquipment.equipment.measurementModes,
                        customerId: housingEquipment.equipment.customerId,
                    }
                })
                .filter((eq) => eq.number && (eq.isNumber || eq.customerId)),
        [housingEquipmentsList],
    )

    const availableEquipments = getAvailableEquipments(mappedHousingEquipmentsList, equipmentsList)

    /**
     * Reset the form fields.
     */
    const resetFormFields = useCallback(() => {
        setInputPeriodTime({
            startTime: undefined,
            endTime: undefined,
        })
        setValue('housingEquipmentId', '')
        setValue('useType', '')
        clearErrors()
    }, [clearErrors, setInputPeriodTime, setValue])

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

    useEffect(() => {
        if (addedEquipmentId !== null) {
            setValue(
                'housingEquipmentId',
                mappedHousingEquipmentsList?.find((housingEquipment) => housingEquipment.id === addedEquipmentId)
                    ?.housingEquipmentId ?? '',
            )
            setAddedEquipmentId(null)
        }
    }, [addedEquipmentId, mappedHousingEquipmentsList, setValue])

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

    /**
     * Function to update the chart selected range.
     *
     * @param startIndex The start index.
     * @param endIndex The end index.
     * @param changedSide The changed side ('startTime' or 'endTime').
     * @param newValue The new value.
     */
    const updateChartSelectedRange = (
        startIndex: number | null,
        endIndex: number | null,
        changedSide: 'startTime' | 'endTime',
        newValue: string,
    ) => {
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
                [changedSide]: newValue,
            }))
        }
    }

    const rangeValidation = useCallback(
        (errorMessage: string) => {
            return (): JSX.Element | undefined => {
                const startIndex = getIndexOfXAxisLabel(inputPeriodTime.startTime ?? '')
                const endIndex = getIndexOfXAxisLabel(inputPeriodTime.endTime ?? '')
                if (startIndex !== null && endIndex !== null && startIndex >= endIndex) {
                    return <FormattedMessage id={errorMessage} defaultMessage={errorMessage} />
                }
                return undefined
            }
        },
        [inputPeriodTime.endTime, inputPeriodTime.startTime],
    )

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-center items-center md:items-start mx-32 gap-24">
                <div className="flex">
                    <div
                        className="w-full flex flex-col md:flex-row justify-center items-start gap-x-10 gap-y-20"
                        style={{ maxWidth: 700 }}
                    >
                        {/* Equipment select */}
                        <div className="flex-1 w-full">
                            <Select
                                name="housingEquipmentId"
                                label={formatMessage({
                                    id: 'Equipement',
                                    defaultMessage: 'Equipement',
                                })}
                                validateFunctions={[requiredBuilder()]}
                                data-testid="housing-equipment-select"
                                inputProps={{
                                    'data-testid': 'housing-equipment-select-input',
                                }}
                            >
                                {mappedHousingEquipmentsList?.map((housingEquipment) => (
                                    <MenuItem
                                        key={housingEquipment.housingEquipmentId}
                                        value={housingEquipment.housingEquipmentId}
                                        data-testid="housing-equipment-option"
                                    >
                                        {mapppingEquipmentToLabel[housingEquipment.name as equipmentNameType] ||
                                            housingEquipment.name}
                                    </MenuItem>
                                ))}
                                <ListSubheader>
                                    <Divider className="my-8" />
                                    <Button
                                        variant="text"
                                        startIcon={
                                            <SvgIcon>
                                                <AddIcon />
                                            </SvgIcon>
                                        }
                                        onClick={() => setIsAddEquipmentPopupOpen(true)}
                                    >
                                        {formatMessage({
                                            id: 'Ajouter un équipement',
                                            defaultMessage: 'Ajouter un équipement',
                                        })}
                                    </Button>
                                </ListSubheader>
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
                                <TimePicker
                                    label={formatMessage({
                                        id: 'De',
                                        defaultMessage: 'De',
                                    })}
                                    value={inputPeriodTime.startTime ? dayjs(inputPeriodTime.startTime, 'HH:mm') : null}
                                    onChange={(newValue) => {
                                        const formattedTime = dayjs.utc(newValue).local().format('HH:mm')
                                        const startIndex = getIndexOfXAxisLabel(formattedTime ?? '')
                                        const endIndex = getIndexOfXAxisLabel(inputPeriodTime.endTime ?? '')
                                        updateChartSelectedRange(startIndex, endIndex, 'startTime', formattedTime)
                                    }}
                                    renderInput={(params) => (
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            rules={{
                                                validate: validators([
                                                    requiredBuilder(),
                                                    rangeValidation(
                                                        "L'heure de début doit être inférieure à l'heure de fin",
                                                    ),
                                                ]) as any,
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    {...params}
                                                    fullWidth
                                                    required
                                                    error={_.has(errors, 'startDate')}
                                                    helperText={
                                                        _.has(errors, 'startDate')
                                                            ? _.get(errors, `${'startDate'}.message`)
                                                            : ''
                                                    }
                                                    data-testId="start-time"
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </div>

                            {/* End time */}
                            <div className="flex-1 w-full">
                                <TimePicker
                                    label={formatMessage({
                                        id: 'À',
                                        defaultMessage: 'À',
                                    })}
                                    value={inputPeriodTime.endTime ? dayjs(inputPeriodTime.endTime, 'HH:mm') : null}
                                    onChange={(newValue) => {
                                        const formattedTime = dayjs.utc(newValue).local().format('HH:mm')
                                        const startIndex = getIndexOfXAxisLabel(inputPeriodTime.startTime ?? '')
                                        const endIndex = getIndexOfXAxisLabel(formattedTime ?? '')
                                        updateChartSelectedRange(startIndex, endIndex, 'endTime', formattedTime)
                                    }}
                                    renderInput={(params) => (
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            rules={{
                                                validate: validators([
                                                    requiredBuilder(),
                                                    rangeValidation(
                                                        "L'heure de fin doit être supérieure à l'heure de début",
                                                    ),
                                                ]) as any,
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    {...params}
                                                    fullWidth
                                                    required
                                                    error={_.has(errors, 'endDate')}
                                                    helperText={
                                                        _.has(errors, 'endDate')
                                                            ? _.get(errors, `${'endDate'}.message`)
                                                            : ''
                                                    }
                                                    data-testId="end-time"
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    className="flex flex-row w-full sm:w-auto sm:flex-col md:flex-row md:mt-5 justify-center items-center gap-x-10 gap-y-20"
                >
                    <ButtonLoader
                        inProgress={isAddingLabelInProgress || loadingEquipmentInProgress}
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
                        inProgress={isAddingLabelInProgress || loadingEquipmentInProgress}
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
            {isAddEquipmentPopupOpen && (
                <AddEquipmentPopup
                    isOpen={isAddEquipmentPopupOpen}
                    onClosePopup={() => setIsAddEquipmentPopupOpen(false)}
                    equipmentsList={availableEquipments}
                    addEquipment={addEquipment}
                    addHousingEquipment={addHousingEquipment}
                    isAddEquipmentLoading={isAddEquipmentLoading}
                    onAddingEquipmentSuccess={setAddedEquipmentId}
                />
            )}
        </>
    )
}

export default AddLabelButtonForm
