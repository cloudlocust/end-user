import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { MenuItem, Divider, Button, SvgIcon, ListSubheader } from '@mui/material'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { AddLabelButtonFormProps } from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm/AddLabelButtonForm'
import { ButtonLoader, MuiTextField } from 'src/common/ui-kit'
import { useFormContext } from 'react-hook-form'
import { requiredBuilder } from 'src/common/react-platform-components'
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

/**
 * Button to add a label.
 *
 * @param root0 N/A.
 * @param root0.chartRef Ref of the chart.
 * @param root0.inputPeriodTime Input Period Time.
 * @param root0.setInputPeriodTime Set the input period time.
 * @param root0.isAddingLabelInProgress Weither the add label is in progress.
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
    const { setValue, watch, clearErrors, reset, formState } = useFormContext()
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

    return (
        <>
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
                                {mappedHousingEquipmentsList?.map((housingEquipment) => (
                                    <MenuItem
                                        key={housingEquipment.housingEquipmentId}
                                        value={housingEquipment.housingEquipmentId}
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
                    onAddingEquipmentSuccesses={setAddedEquipmentId}
                />
            )}
        </>
    )
}

export default AddLabelButtonForm
