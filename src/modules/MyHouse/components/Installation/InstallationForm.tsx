import { useEffect, useState } from 'react'
import { CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, useTheme, Container } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import {
    heaterEquipment,
    sanitaryEquipment,
    hotPlateEquipment,
    mappingEquipmentNameToType,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import {
    equipmentAllowedTypeT,
    equipmentValuesType,
    equipmentMeterType,
    IEquipmentMeter,
    equipmentNameType,
} from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as MeterErrorIcon } from 'src/assets/images/content/housing/meter-error.svg'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { ButtonLoader } from 'src/common/ui-kit'

/**
 * EquipmentForm Component.
 *
 * @returns Equipment Form equipment.
 */
// TODO: this component is to be redone because it's a mess (thank you Kseniia)
export const InstallationTab = () => {
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const {
        housingEquipmentsList,
        addHousingEquipment,
        loadingEquipmentInProgress,
        isEquipmentMeterListEmpty,
        loadEquipmentList,
    } = useEquipmentList(currentHousing?.id)

    const [solarPanelRadioValue, setSolarPanelRadioValue] = useState<'existant' | 'nonexistant' | 'possibly'>(
        'existant',
    )
    const [isEquipmentInfoConsentmentOpen, setIsEquipmentInfoConsentmentOpen] = useState(false)

    /**
     * Handler for solar panel radio button.
     *
     * @param event React change event.
     */
    const handleSolarPanelRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSolarPanelRadioValue((event.target as HTMLInputElement).value as 'existant' | 'nonexistant' | 'possibly')
    }

    // It'll have the following format an object of all equipment, name is the key, for example: {"heater": {equipment_id, equipment_type, equipment_number, isNumber, equipment: {id, name, allowed_type} } }.
    // eslint-disable-next-line jsdoc/require-jsdoc
    let savedEquipmentList: { [key: string]: IEquipmentMeter & { isNumber: boolean } } = {}
    if (housingEquipmentsList) {
        housingEquipmentsList.forEach((equipment) => {
            // Check that equipmentMeterList is not empty.
            savedEquipmentList![equipment.equipment.name] = {
                ...equipment,
                isNumber: mappingEquipmentNameToType[equipment.equipment.name as equipmentNameType] === 'number',
            }
        })
    }

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

    const solarpanelValue = defaultValues['solarpanel']

    useEffect(() => {
        loadEquipmentList()
    }, [loadEquipmentList])

    useEffect(() => {
        if (solarpanelValue) {
            setSolarPanelRadioValue(defaultValues['solarpanel'] as 'existant' | 'nonexistant')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solarpanelValue])

    if (!housingEquipmentsList || loadingEquipmentInProgress || housingEquipmentsList.length === 0)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    return (
        <Container sx={{ paddingBottom: '30px', width: '100%', maxWidth: '700px !important' }}>
            {isEquipmentInfoConsentmentOpen && (
                <div
                    className="flex items-center text-center text-13 md:text-16 justify-center w-full min-h-56"
                    style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                >
                    <TypographyFormatMessage>
                        En renseignant vos équipements nous pourrons vous apporter une analyse plus précise de votre
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
                        await addHousingEquipment(body)
                    }
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
                            onClick={() => setIsEquipmentInfoConsentmentOpen(!isEquipmentInfoConsentmentOpen)}
                        />
                    )}
                </div>

                <div className="mb-40">
                    <TypographyFormatMessage className="text-14 font-600">
                        Utilisation de l'énergie dans mon domicile
                    </TypographyFormatMessage>
                    <div className="text-13 mt-20">
                        <SelectButtons {...heaterEquipment} />
                    </div>
                    <div className="text-13 mt-20">
                        <SelectButtons {...sanitaryEquipment} />
                    </div>
                    <div className="text-13 mt-20">
                        <SelectButtons {...hotPlateEquipment} />
                    </div>
                </div>
                <div className="mb-40">
                    <TypographyFormatMessage className="text-14 font-600">
                        Ma production d'énergie
                    </TypographyFormatMessage>
                    <div className="text-13 mt-20 flex items-center justify-between gap-x-20 flex-wrap">
                        <TypographyFormatMessage>Je dispose de panneaux solaires :</TypographyFormatMessage>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={solarPanelRadioValue}
                                onChange={handleSolarPanelRadioChange}
                                className="w-full flex flex-row"
                            >
                                <FormControlLabel value="existant" control={<Radio />} label="Oui" />
                                <FormControlLabel value="nonexistant" control={<Radio />} label="Non" />
                                <FormControlLabel value="possibly" control={<Radio />} label="J'y pense" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div className="flex justify-end item-center">
                    <ButtonLoader
                        type="submit"
                        inProgress={loadingEquipmentInProgress}
                        disabled={loadingEquipmentInProgress}
                        className="w-full sm:w-auto"
                    >
                        <TypographyFormatMessage>Enregistrer mes modification</TypographyFormatMessage>
                    </ButtonLoader>
                </div>
            </Form>
        </Container>
    )
}
