import { useEffect, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { TextField } from 'src/common/ui-kit'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import {
    accomodationLabelOptions,
    accomodationNames,
    isolationOptions,
    performanceOptions,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { Form } from 'src/common/react-platform-components'
import { EditButtonsGroup } from 'src/modules/MyHouse/EditButtonsGroup'
import { useAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'
import {
    AccomodationDataType,
    ownershipStatusEnum,
} from 'src/modules/MyHouse/components/Accomodation/AccomodationType.d'
import { CircularProgress } from '@mui/material'
import { isMatch } from 'lodash'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { ReactComponent as MeterErrorIcon } from 'src/assets/images/content/housing/meter-error.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as OwnerIcon } from 'src/assets/images/accomodation/owner.svg'
import { ReactComponent as TenantIcon } from 'src/assets/images/accomodation/tenant.svg'
import { ReactComponent as HousingIcon } from 'src/assets/images/accomodation/logementMaison.svg'
import { ReactComponent as ApartmentIcon } from 'src/assets/images/accomodation/logementAppartement.svg'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * AccomodationForm .
 *
 * @returns AccomodationForm.
 */
export const AccomodationForm = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const { formatMessage } = useIntl()
    const [isDPE, setIsDPE] = useState(true)
    const { loadAccomodation, updateAccomodation, accomodation, isLoadingInProgress, isAccomodationMeterListEmpty } =
        useAccomodation(currentHousing?.id)
    const [isEditAccomodation, setIdEditAccomodation] = useState(false)
    const disabledField = !isAccomodationMeterListEmpty && !isEditAccomodation

    const [isAccomodationInfoConsentmentOpen, setIsAccomodationInfoConsentmentOpen] = useState(false)
    const theme = useTheme()

    const accomodationData = {
        houseType: accomodation?.houseType,
        houseYear: accomodation?.houseYear,
        residenceType: accomodation?.residenceType,
        energyPerformanceIndex: accomodation?.energyPerformanceIndex,
        isolationLevel: accomodation?.isolationLevel,
        numberOfInhabitants: accomodation?.numberOfInhabitants,
        houseArea: accomodation?.houseArea,
        ownershipStatus: accomodation?.ownershipStatus,
    }
    /**
     * Leave only one selected field in the data from.
     *
     * @param data OnSubmit data.
     * @returns Data.
     */
    const setSelectFields = (data: AccomodationDataType) => {
        if (
            data.hasOwnProperty(accomodationNames.energyPerformanceIndex) &&
            data.hasOwnProperty(accomodationNames.isolationLevel)
        ) {
            isDPE
                ? delete data[accomodationNames.isolationLevel as keyof AccomodationDataType]
                : delete data[accomodationNames.energyPerformanceIndex as keyof AccomodationDataType]
            return data
        }
        return data
    }

    useEffect(() => {
        loadAccomodation()
    }, [loadAccomodation])

    if (isLoadingInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    return (
        <div className="flex flex-col items-center justify-center w-full overflow-y-scroll">
            {isAccomodationInfoConsentmentOpen && (
                <div
                    className="flex items-center text-center text-13 md:text-16 justify-center w-full min-h-56"
                    style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                >
                    <TypographyFormatMessage>
                        En renseignant votre logement nous pourrons vous apporter une analyse plus précise de votre
                        consommation
                    </TypographyFormatMessage>
                </div>
            )}
            <div className="flex flex-col justify-center w-full items-center">
                <Form
                    style={{ width: '100%' }}
                    onSubmit={async (data: AccomodationDataType) => {
                        const dataAccomodation = setSelectFields(data)
                        const dataIsNotModified = isMatch(accomodationData as AccomodationDataType, dataAccomodation)
                        if (dataIsNotModified) return
                        await updateAccomodation(dataAccomodation)
                        loadAccomodation()
                        setIdEditAccomodation(false)
                    }}
                    defaultValues={accomodationData}
                >
                    <div className="flex justify-center font-semibold text-sm mb-4 mt-16 flex-wrap w-full">
                        {isAccomodationMeterListEmpty && (
                            <MeterErrorIcon
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    color: linksColor || theme.palette.primary.main,
                                    marginLeft: '12px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setIsAccomodationInfoConsentmentOpen(!isAccomodationInfoConsentmentOpen)}
                            />
                        )}
                    </div>
                    <SelectButtons
                        name={accomodationNames.ownershipStatus}
                        titleLabel="Je suis :"
                        wrapperStyles="flex flex-row justify-center space-x-12"
                        isDisabled={disabledField}
                        formOptions={[
                            {
                                label: accomodationLabelOptions.owner,
                                value: ownershipStatusEnum.OWNER,
                                buttonStyle: 'w-240 mt-16 flex flex-col mr-16',
                                icon: <OwnerIcon />,
                            },
                            {
                                label: accomodationLabelOptions.tenant,
                                value: ownershipStatusEnum.TENANT,
                                buttonStyle: 'w-240 mt-16 flex flex-col',
                                icon: <TenantIcon />,
                            },
                        ]}
                    />
                    <SelectButtons
                        name={accomodationNames.houseType}
                        wrapperStyles="flex flex-row justify-center space-x-12"
                        titleLabel="Type de logement :"
                        isDisabled={disabledField}
                        formOptions={[
                            {
                                label: accomodationLabelOptions.house,
                                buttonStyle: 'w-240 mt-16 flex flex-col mr-16',
                                value: accomodationLabelOptions.house,
                                icon: <HousingIcon className="p-5 mb-5" />,
                            },
                            {
                                label: accomodationLabelOptions.apartment,
                                buttonStyle: 'w-240 mt-16 flex flex-col',
                                value: accomodationLabelOptions.apartment,
                                icon: <ApartmentIcon className="p-5 mb-5" />,
                            },
                        ]}
                    />
                    <SelectButtons
                        name={accomodationNames.houseYear}
                        wrapperStyles="flex flex-row  justify-center"
                        titleLabel="Année de construction :"
                        isDisabled={disabledField}
                        formOptions={[
                            {
                                label: accomodationLabelOptions.before1950,
                                buttonStyle: 'w-224 mt-16 flex flex-col mr-16 text-xs pt-10 pb-10',
                                value: 'Avant_1950',
                            },
                            {
                                label: accomodationLabelOptions.from1950to1975,
                                buttonStyle: 'w-224 mt-16 flex flex-col mr-16 text-xs pt-10 pb-10',
                                value: 'Entre_1950_1975',
                            },
                            {
                                label: accomodationLabelOptions.after1975,
                                buttonStyle: 'w-224 mt-16 flex flex-col text-xs pt-10 pb-10',
                                value: 'Apres_1975',
                            },
                        ]}
                    />
                    <SelectButtons
                        wrapperStyles="flex flex-row justify-center"
                        titleLabel="Type de résidence :"
                        name={accomodationNames.residenceType}
                        isDisabled={disabledField}
                        formOptions={[
                            {
                                label: accomodationLabelOptions.main,
                                iconLabel: 'flag',
                                iconStyles: 'mr-5',
                                buttonStyle: 'w-224 max-h-40 mt-16 mr-16 text-xs pt-12 pb-12',
                                value: accomodationLabelOptions.main,
                            },
                            {
                                label: accomodationLabelOptions.secondary,
                                iconLabel: 'golf_course',
                                iconStyles: 'mr-5',
                                buttonStyle: 'w-224 max-h-40 mt-16 text-xs',
                                value: accomodationLabelOptions.secondary,
                            },
                        ]}
                    />
                    <div className="flex flex-col md:flex-row mt-16 mr-24 content-center items-end md:items-center justify-end">
                        <div className="w-full flex flex-row justify-between content-center items-center">
                            <div>
                                {formatMessage({
                                    id: 'Je connais mon DPE :',
                                    defaultMessage: 'Je connais mon DPE :',
                                })}
                                <Tooltip
                                    title={formatMessage({
                                        id: 'Diagnostic de performance énergétique',
                                        defaultMessage: 'Diagnostic de performance énergétique',
                                    })}
                                    placement="top"
                                    color="primary"
                                >
                                    <HelpOutlineIcon className="cursor-pointer ml-5" />
                                </Tooltip>
                            </div>
                            <RadioGroup row name="isDPE">
                                <FormControlLabel
                                    value="oui"
                                    control={<Radio color="primary" />}
                                    label="Oui"
                                    onClick={() => !disabledField && setIsDPE(true)}
                                    checked={isDPE}
                                    disabled={disabledField}
                                />
                                <FormControlLabel
                                    value="non"
                                    control={<Radio color="primary" />}
                                    label="Non"
                                    onClick={() => !disabledField && setIsDPE(false)}
                                    checked={!isDPE}
                                    disabled={disabledField}
                                />
                            </RadioGroup>
                        </div>
                        <div className="w-4/6 md:mt-20">
                            {isDPE ? (
                                <Select
                                    name={accomodationNames.energyPerformanceIndex}
                                    label={accomodationLabelOptions.energeticPerformance}
                                    children={performanceOptions.map((performance) => {
                                        return <MenuItem value={performance}>{performance}</MenuItem>
                                    })}
                                    defaultValue={null}
                                    disabled={disabledField}
                                />
                            ) : (
                                <Select
                                    name={accomodationNames.isolationLevel}
                                    label={accomodationLabelOptions.isolation}
                                    children={isolationOptions.map((isolation) => {
                                        return <MenuItem value={isolation}>{isolation}</MenuItem>
                                    })}
                                    defaultValue={null}
                                    disabled={disabledField}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between mt-16 mr-24">
                        <div className="mt-16 mr-10 w-full ">
                            {formatMessage({
                                id: "Nombre d'occupants :",
                                defaultMessage: "Nombre d'occupants :",
                            })}
                        </div>
                        <div className="w-4/6">
                            <TextField
                                type="number"
                                name={accomodationNames.numberOfInhabitants}
                                label={formatMessage({
                                    id: 'Occupants',
                                    defaultMessage: 'Occupants',
                                })}
                                disabled={disabledField}
                                inputProps={{ min: 0 }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between mb-10">
                        <div className="mt-16 mr-10 w-full ">
                            {formatMessage({
                                id: 'Superficie du logement :',
                                defaultMessage: 'Superficie du logement :',
                            })}
                        </div>
                        <div className="w-4/6 ">
                            <TextField
                                type="number"
                                name={accomodationNames.houseArea}
                                label={formatMessage({
                                    id: 'Superficie',
                                    defaultMessage: 'Superficie',
                                })}
                                disabled={disabledField}
                                inputProps={{ min: 0 }}
                            />
                        </div>
                        <div className="mt-16 ml-6  ">
                            {formatMessage({
                                id: 'm²',
                                defaultMessage: 'm²',
                            })}
                        </div>
                    </div>
                    <EditButtonsGroup
                        isEdit={isEditAccomodation || isAccomodationMeterListEmpty}
                        enableForm={() => setIdEditAccomodation(true)}
                        formInitialValues={accomodationData}
                        disableEdit={() => setIdEditAccomodation(false)}
                    />
                </Form>
            </div>
        </div>
    )
}
