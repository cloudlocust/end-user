import { useEffect, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { Radio, RadioGroup, FormControlLabel, MenuItem, CircularProgress, Tooltip, useTheme } from '@mui/material'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import {
    accomodationLabelOptions,
    accomodationNames,
    houseLocationOptions,
    houseYearOptions,
    isolationOptions,
    numberOfLevelsOptions,
    performanceOptions,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { requiredBuilder } from 'src/common/react-platform-components'
import { useAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'
import {
    AccomodationDataType,
    ownershipStatusEnum,
} from 'src/modules/MyHouse/components/Accomodation/AccomodationType.d'
import { isMatch } from 'lodash'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { ReactComponent as MeterErrorIcon } from 'src/assets/images/content/housing/meter-error.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as OwnerIcon } from 'src/assets/images/accomodation/owner.svg'
import { ReactComponent as TenantIcon } from 'src/assets/images/accomodation/tenant.svg'
import { ReactComponent as HousingIcon } from 'src/assets/images/accomodation/logementMaison.svg'
import { ReactComponent as ApartmentIcon } from 'src/assets/images/accomodation/logementAppartement.svg'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { RouterPrompt } from 'src/modules/shared/RoutePrompt'
import { FormProvider, useForm, Controller } from 'react-hook-form'

/**
 * AccomodationForm .
 *
 * @returns AccomodationForm.
 */
export const AccomodationTab = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { updateAccomodation, accomodation, isLoadingInProgress, isAccomodationMeterListEmpty } = useAccomodation(
        currentHousing?.id,
    )
    const [isAccomodationInfoConsentmentOpen, setIsAccomodationInfoConsentmentOpen] = useState(false)

    const defaultAccomodationData = {
        id: accomodation?.id,
        houseType: accomodation?.houseType,
        houseYear: accomodation?.houseYear,
        residenceType: accomodation?.residenceType,
        energyPerformanceIndex: accomodation?.energyPerformanceIndex,
        isolationLevel: accomodation?.isolationLevel,
        numberOfInhabitants: accomodation?.numberOfInhabitants,
        houseArea: accomodation?.houseArea,
        ownershipStatus: accomodation?.ownershipStatus,
    }

    const [isDPE, setIsDPE] = useState(() => (accomodation?.energyPerformanceIndex ? true : false))

    /**
     * Leave only one selected field in the data from.
     *
     * @param data OnSubmit data.
     * @returns Data.
     */
    const setSelectFields = (data: AccomodationDataType) => {
        const { energyPerformanceIndex, isolationLevel } = accomodationNames
        if (data.hasOwnProperty(energyPerformanceIndex) && data.hasOwnProperty(isolationLevel)) {
            if (isDPE) {
                delete data.isolationLevel
            } else {
                delete data.energyPerformanceIndex
            }
        }
        return data
    }

    /**
     * Function to handle form submit.
     *
     * @param data Form data.
     * @returns N/A.
     */
    const handleFormSubmit = async (data: AccomodationDataType) => {
        const newAccomodationData = setSelectFields(data)
        const dataIsNotModified = isMatch(defaultAccomodationData, data)
        if (dataIsNotModified) return
        await updateAccomodation(newAccomodationData)
        return true
    }

    const methods = useForm({
        mode: 'all',
        ...(accomodation ? { defaultValues: accomodation } : null),
    })

    const { getValues, reset, handleSubmit, watch, setValue } = methods

    useEffect(() => {
        if (accomodation) {
            // Populate form when data is retrieved from api.
            reset(accomodation)
        }
    }, [accomodation, reset])

    if (isLoadingInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '100%' }}>
                <CircularProgress />
            </div>
        )

    return (
        <>
            <RouterPrompt
                when={methods.formState.isDirty}
                content="Attention si vous n’enregistrez pas, vos données risques d’être perdues, souhaitez-vous enregistrer vos modifications"
                okText="Oui"
                cancelText="Non"
                onOK={handleSubmit(async (data) => {
                    try {
                        const isSubmitted = await handleFormSubmit(data)
                        if (isSubmitted) {
                            return true
                        }
                    } catch {
                        return false
                    }
                })}
                onCancel={() => {
                    const values = getValues()
                    reset(values)
                }}
            />

            <div
                className="flex flex-col items-center justify-center w-full overflow-y-scroll pb-40 mx-auto"
                style={{ maxWidth: '700px' }}
            >
                {isAccomodationInfoConsentmentOpen && (
                    <div
                        className="flex items-center text-center text-13 md:text-16 justify-center w-full min-h-56"
                        style={{
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                        }}
                    >
                        <TypographyFormatMessage>
                            En renseignant votre logement nous pourrons vous apporter une analyse plus précise de votre
                            consommation
                        </TypographyFormatMessage>
                    </div>
                )}
                <div className="flex flex-col justify-center w-full items-center">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleFormSubmit)} noValidate className="w-full">
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
                                        onClick={() =>
                                            setIsAccomodationInfoConsentmentOpen(!isAccomodationInfoConsentmentOpen)
                                        }
                                    />
                                )}
                            </div>
                            <SelectButtons
                                name={accomodationNames.ownershipStatus}
                                titleLabel={formatMessage({
                                    id: 'Je suis :',
                                    defaultMessage: 'Je suis :',
                                })}
                                wrapperStyles="flex flex-row justify-center space-x-12"
                                formOptions={[
                                    {
                                        label: accomodationLabelOptions.owner,
                                        value: ownershipStatusEnum.OWNER,
                                        buttonStyle: 'w-240 mt-16 flex flex-col mr-16',
                                        icon: <OwnerIcon fill={theme.palette.secondary.main} />,
                                    },
                                    {
                                        label: accomodationLabelOptions.tenant,
                                        value: ownershipStatusEnum.TENANT,
                                        buttonStyle: 'w-240 mt-16 flex flex-col',
                                        icon: <TenantIcon fill={theme.palette.secondary.main} />,
                                    },
                                ]}
                            />
                            <SelectButtons
                                name={accomodationNames.houseType}
                                wrapperStyles="flex flex-row justify-center space-x-12"
                                titleLabel={formatMessage({
                                    id: 'Type de logement :',
                                    defaultMessage: 'Type de logement :',
                                })}
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
                                wrapperStyles="flex flex-row justify-center"
                                titleLabel={formatMessage({
                                    id: 'Type de résidence :',
                                    defaultMessage: 'Type de résidence :',
                                })}
                                name={accomodationNames.residenceType}
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
                            <div className="flex flex-row justify-between mt-16 mr-24">
                                <div className="mt-16 mr-10 w-full ">
                                    {formatMessage({
                                        id: 'Nombre de niveaux :',
                                        defaultMessage: 'Nombre de niveaux :',
                                    })}
                                </div>
                                <div className="w-4/6">
                                    <Select
                                        name={accomodationNames.numberOfLevels}
                                        label={formatMessage({
                                            id: 'Niveaux',
                                            defaultMessage: 'Niveaux',
                                        })}
                                        children={numberOfLevelsOptions.map((numberOfLevels) => (
                                            <MenuItem value={numberOfLevels.value}>{numberOfLevels.label}</MenuItem>
                                        ))}
                                        defaultValue={null}
                                        formControlProps={{
                                            margin: 'normal',
                                        }}
                                    />
                                </div>
                            </div>
                            {watch('houseType') === accomodationLabelOptions.house && (
                                <div className="flex flex-row justify-between mt-16 mr-24">
                                    <div className="mt-16 mr-10 w-full ">
                                        {formatMessage({
                                            id: 'Emplacement de la maison :',
                                            defaultMessage: 'Emplacement de la maison :',
                                        })}
                                    </div>
                                    <div className="w-4/6">
                                        <Select
                                            name={accomodationNames.houseLocation}
                                            label={formatMessage({
                                                id: 'Emplacement',
                                                defaultMessage: 'Emplacement',
                                            })}
                                            children={houseLocationOptions.map((houseLocation) => (
                                                <MenuItem value={houseLocation.value}>{houseLocation.label}</MenuItem>
                                            ))}
                                            defaultValue={null}
                                            formControlProps={{
                                                margin: 'normal',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-row justify-between mt-16 mr-24">
                                <div className="mt-16 mr-10 w-full ">
                                    {formatMessage({
                                        id: 'Année de construction :',
                                        defaultMessage: 'Année de construction :',
                                    })}
                                </div>
                                <div className="w-4/6">
                                    <Select
                                        name={accomodationNames.houseYear}
                                        label={formatMessage({
                                            id: 'Année',
                                            defaultMessage: 'Année',
                                        })}
                                        children={houseYearOptions.map((houseYear) => (
                                            <MenuItem value={houseYear.value}>{houseYear.label}</MenuItem>
                                        ))}
                                        defaultValue={null}
                                        formControlProps={{
                                            margin: 'normal',
                                        }}
                                    />
                                </div>
                            </div>
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
                                    <RadioGroup name="isDPE" row>
                                        <FormControlLabel
                                            value="oui"
                                            control={<Radio color="primary" />}
                                            label={formatMessage({
                                                id: 'Oui',
                                                defaultMessage: 'Oui',
                                            })}
                                            onClick={() => setIsDPE(true)}
                                            checked={isDPE}
                                        />
                                        <FormControlLabel
                                            value="non"
                                            control={<Radio color="primary" />}
                                            label={formatMessage({
                                                id: 'Non',
                                                defaultMessage: 'Non',
                                            })}
                                            onClick={() => setIsDPE(false)}
                                            checked={!isDPE}
                                        />
                                    </RadioGroup>
                                </div>
                                <div className="w-4/6 md:mt-20">
                                    {isDPE ? (
                                        <Select
                                            name={accomodationNames.energyPerformanceIndex}
                                            label={formatMessage({
                                                id: accomodationLabelOptions.energeticPerformance,
                                                defaultMessage: accomodationLabelOptions.energeticPerformance,
                                            })}
                                            children={performanceOptions.map((performance) => {
                                                return <MenuItem value={performance}>{performance}</MenuItem>
                                            })}
                                            defaultValue={null}
                                            validateFunctions={[requiredBuilder()]}
                                            formControlProps={{
                                                margin: 'normal',
                                            }}
                                        />
                                    ) : (
                                        <Select
                                            name={accomodationNames.isolationLevel}
                                            label={formatMessage({
                                                id: accomodationLabelOptions.isolation,
                                                defaultMessage: accomodationLabelOptions.isolation,
                                            })}
                                            children={isolationOptions.map((isolation) => {
                                                return <MenuItem value={isolation}>{isolation}</MenuItem>
                                            })}
                                            defaultValue={null}
                                            validateFunctions={[requiredBuilder()]}
                                            formControlProps={{
                                                margin: 'normal',
                                            }}
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
                                        inputProps={{ min: 0 }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
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
                                        inputProps={{ min: 0 }}
                                    />
                                </div>
                                <div className="mt-16 ml-6">m²</div>
                            </div>
                            <div className="flex flex-row gap-x-24 flex-wrap mt-16 mr-24 mb-10">
                                <div className="flex-1 flex flex-row justify-between min-w-256">
                                    <div className="mt-16 mr-10 w-full ">
                                        {formatMessage({
                                            id: 'Nombre de fenêtres :',
                                            defaultMessage: 'Nombre de fenêtres :',
                                        })}
                                    </div>
                                    <div className="w-4/6">
                                        <TextField
                                            type="number"
                                            name={accomodationNames.numberOfWindows}
                                            label={formatMessage({
                                                id: 'Fenêtres',
                                                defaultMessage: 'Fenêtres',
                                            })}
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row justify-between min-w-256">
                                    <div className="mt-16 mr-10 w-full ">
                                        {formatMessage({
                                            id: 'Double / Triple vitrage ?',
                                            defaultMessage: 'Double / Triple vitrage ?',
                                        })}
                                    </div>
                                    <div className="w-full mt-5">
                                        <Controller
                                            name="isGlazedWindows"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    value={watch(field.name)}
                                                    onChange={(_, value) => {
                                                        setValue(field.name, value === 'true')
                                                    }}
                                                    className="flex flex-row"
                                                >
                                                    <FormControlLabel
                                                        value={true}
                                                        label={formatMessage({
                                                            id: 'Oui',
                                                            defaultMessage: 'Oui',
                                                        })}
                                                        control={<Radio checked={watch(field.name)} />}
                                                    />
                                                    <FormControlLabel
                                                        value={false}
                                                        label={formatMessage({
                                                            id: 'Non',
                                                            defaultMessage: 'Non',
                                                        })}
                                                        control={<Radio checked={watch(field.name) === false} />}
                                                    />
                                                </RadioGroup>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end item-center">
                                <ButtonLoader
                                    type="submit"
                                    inProgress={isLoadingInProgress}
                                    disabled={isLoadingInProgress}
                                >
                                    <TypographyFormatMessage>Enregistrer mes modifications</TypographyFormatMessage>
                                </ButtonLoader>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </>
    )
}
