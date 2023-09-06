import { useEffect, useState } from 'react'
import { CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, useTheme } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { EditButtonsGroup } from 'src/modules/MyHouse/EditButtonsGroup'
import {
    heaterEquipment,
    sanitaryEquipment,
    hotPlateEquipment,
    mappingEquipmentNameToType,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { useEquipmentList } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
import {
    equipmentAllowedTypeT,
    equipmentValuesType,
    equipmentMeterType,
    IEquipmentMeter,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as MeterErrorIcon } from 'src/assets/images/content/housing/meter-error.svg'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

/**
 * EquipmentForm Component.
 *
 * @returns Equipment Form equipment.
 */
export const EquipmentForm = () => {
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { equipmentList, saveEquipment, loadingEquipmentInProgress, isEquipmentMeterListEmpty, loadEquipmentList } =
        useEquipmentList(currentHousing?.id)

    const [solarPanelRadioValue, setSolarPanelRadioValue] = useState<'existant' | 'non-existant'>('existant')
    const [isEquiomentInfoConsentmentOpen, setIsEquiomentInfoConsentmentOpen] = useState(false)

    /**
     * Handler for solar panel radio button.
     *
     * @param event React change event.
     */
    const handleSolarPanelRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSolarPanelRadioValue((event.target as HTMLInputElement).value as 'existant' | 'non-existant')
    }
    const [isEdit, setIsEdit] = useState(false)

    // It'll have the following format an object of all equipment, name is the key, for example: {"heater": {equipment_id, equipment_type, equipment_number, isNumber, equipment: {id, name, allowed_type} } }.
    // eslint-disable-next-line jsdoc/require-jsdoc
    let savedEquipmentList: { [key: string]: IEquipmentMeter & { isNumber: boolean } } = {}
    if (equipmentList) {
        equipmentList.forEach((equipment) => {
            // Check that equipmentMeterList is not empty.
            savedEquipmentList![equipment.equipment.name] = {
                ...equipment,
                isNumber: mappingEquipmentNameToType[equipment.equipment.name] === 'number',
            }
        })
    }

    useEffect(() => {
        loadEquipmentList()
    }, [loadEquipmentList])

    if (!equipmentList || loadingEquipmentInProgress || equipmentList.length === 0)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    // eslint-disabled-next-line jsdoc/require-jsdoc
    let defaultValues: // eslint-disabled-next-line jsdoc/require-jsdoc
    /**
     * Default values used for setting the value of the form, and when resseting form.
     */
    {
        // eslint-disabled-next-line jsdoc/require-jsdoc
        [key: string]: number | equipmentAllowedTypeT
    } = {}
    // Initialise default Values
    Object.keys(savedEquipmentList!).forEach((equipmentName) => {
        defaultValues[equipmentName] = savedEquipmentList[equipmentName].isNumber
            ? savedEquipmentList[equipmentName].equipmentNumber!
            : savedEquipmentList[equipmentName].equipmentType!
    })

    return (
        <div className="flex flex-col justify-center w-full items-center">
            {isEquiomentInfoConsentmentOpen && (
                <div
                    className="flex items-center text-center text-13 md:text-16 justify-center w-full min-h-56"
                    style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                >
                    <TypographyFormatMessage>
                        En renseignant vos équiements nous pourrons vous apporter une analyse plus précise de votre
                        consommation
                    </TypographyFormatMessage>
                </div>
            )}
            <Form
                style={{ width: '100%' }}
                defaultValues={defaultValues}
                onSubmit={async (formData: equipmentValuesType) => {
                    let body: equipmentMeterType[] = []
                    // Transform formData into body for saveEquipment Request, using the savedData.
                    Object.keys(savedEquipmentList).forEach((equipmentName) => {
                        if (
                            formData[equipmentName as keyof equipmentValuesType] &&
                            // Check that it's new values.
                            savedEquipmentList[equipmentName].equipmentNumber !==
                                formData[equipmentName as keyof equipmentValuesType] &&
                            savedEquipmentList[equipmentName].equipmentType !==
                                formData[equipmentName as keyof equipmentValuesType]
                        ) {
                            if (savedEquipmentList[equipmentName].isNumber)
                                savedEquipmentList[equipmentName].equipmentNumber = formData[
                                    equipmentName as keyof equipmentValuesType
                                ] as number
                            else
                                savedEquipmentList[equipmentName].equipmentType = formData[
                                    equipmentName as keyof equipmentValuesType
                                ] as equipmentAllowedTypeT

                            const { equipment, isNumber, ...rest } = savedEquipmentList[equipmentName]
                            body.push(rest)
                        }
                    })

                    if (solarPanelRadioValue) {
                        body.push({ equipmentId: 14, equipmentType: solarPanelRadioValue })
                    }

                    if (body.length > 0) {
                        await saveEquipment(body)
                    }
                    setIsEdit(false)
                }}
            >
                <div className="flex justify-center font-semibold text-sm mb-4 mt-16 flex-wrap w-full">
                    {isEquipmentMeterListEmpty && (
                        <MeterErrorIcon
                            style={{
                                width: '24px',
                                height: '24px',
                                color: linksColor || theme.palette.primary.main,
                                marginLeft: '12px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsEquiomentInfoConsentmentOpen(!isEquiomentInfoConsentmentOpen)}
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center w-full">
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEquipmentMeterListEmpty && !isEdit} {...heaterEquipment} />
                    </div>
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEquipmentMeterListEmpty && !isEdit} {...sanitaryEquipment} />
                    </div>
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEquipmentMeterListEmpty && !isEdit} {...hotPlateEquipment} />
                    </div>
                    <div className="text-13 flex flex-row justify-around md:justify-center mt-8 md:mt-24">
                        <TypographyFormatMessage className="flex flex-row items-center">
                            Je dispose de panneaux solaires :
                        </TypographyFormatMessage>
                        <FormControl className="md:ml-8">
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={solarPanelRadioValue}
                                onChange={handleSolarPanelRadioChange}
                                className="flex flex-col md:flex-row ml-12"
                            >
                                <FormControlLabel
                                    value="existant"
                                    control={<Radio />}
                                    label="Oui"
                                    disabled={!isEquipmentMeterListEmpty && !isEdit}
                                />
                                <FormControlLabel
                                    value="non-existant"
                                    control={<Radio />}
                                    label="Non"
                                    disabled={!isEquipmentMeterListEmpty && !isEdit}
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <EditButtonsGroup
                    formInitialValues={defaultValues}
                    isEdit={isEquipmentMeterListEmpty || isEdit}
                    disableEdit={() => setIsEdit(false)}
                    enableForm={() => setIsEdit(true)}
                />
            </Form>
        </div>
    )
}
