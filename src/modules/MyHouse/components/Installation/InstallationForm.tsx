import { useEffect, useMemo, useState } from 'react'
import { CircularProgress, Radio, RadioGroup, FormControlLabel, useTheme, Container, Typography } from '@mui/material'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import MenuItem from '@mui/material/MenuItem'
import { heaterEquipment, sanitaryEquipment, hotPlateEquipment } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { useEquipmentList, useInstallation } from 'src/modules/MyHouse/components/Installation/installationHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useIntl } from 'src/common/react-platform-translation'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { ReactComponent as MeterErrorIcon } from 'src/assets/images/content/housing/meter-error.svg'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import {
    equipmentMeterType,
    installationFormFieldsType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'
import isEqual from 'lodash/isEqual'

// eslint-disable-next-line jsdoc/require-jsdoc
export const SOLAR_PANEL_TYPES = {
    onRoof: 'Sur le toit',
    plugAndPlay: 'Plug & Play',
    other: 'Autre',
}

const SOLAR_PANEL_BRANDS = [
    'Dualsun',
    'Sunpower',
    'Trina Solar',
    'Longi',
    'Systovi',
    'Voltec Solar',
    'Qcells',
    'Photowatt',
    'SolarWatt',
    'Axitec',
    'JA solar',
    'LG',
    'Panasonic',
    'Silfab',
    'JinkoSolar',
    'REC Solar',
    'Meyer Burger',
    'Recom',
    'Schuco',
    'Autres',
]

const INVERTER_BRANDS = [
    'SMA',
    'Fronius',
    'Enphase',
    'Huawei',
    'Growatt',
    'AP Systems',
    'Solaredge',
    'Ginlong Solis',
    'Sungrow',
    'Power Electronis',
    'Delta',
    'Abb',
    'Omron',
    'Goodwe',
    'Panasonic',
    'Recom',
    'Schuco',
    'Hoymiles',
    'Autres',
]

/**
 * EquipmentForm Component.
 *
 * @returns Equipment Form equipment.
 */
// TODO: this component is to be redone because it's a mess (thank you Kseniia)
export const InstallationTab = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { equipmentsList, isEquipmentMeterListEmpty } = useEquipmentList(currentHousing?.id)
    const {
        installationInfos,
        getInstallationInfosInProgress,
        addUpdateInstallationInfosInProgress,
        getInstallationInfos,
        addUpdateInstallationInfos,
    } = useInstallation(currentHousing?.id)
    const methods = useForm<installationFormFieldsType>({ mode: 'all' })
    const { reset, handleSubmit, setValue, watch, getValues } = methods
    const [isEquipmentInfoConsentmentOpen, setIsEquipmentInfoConsentmentOpen] = useState(false)

    useEffect(() => {
        getInstallationInfos()
    }, [getInstallationInfos])

    /**
     * Function to get the values of the fields solarPanelType and otherSolarPanelType
     * from the solarPanelType value cames from the backend.
     *
     * @param solarPanelType The solar panel type.
     * @returns The solarPanelType and otherSolarPanelType form fields values.
     */
    const getSolarPanelTypeFieldsValues = (solarPanelType?: string) => {
        let solarPanelTypeField: string | undefined
        let otherSolarPanelTypeField: string | undefined
        if (solarPanelType) {
            if ([SOLAR_PANEL_TYPES.onRoof, SOLAR_PANEL_TYPES.plugAndPlay].includes(solarPanelType)) {
                solarPanelTypeField = solarPanelType
                otherSolarPanelTypeField = undefined
            } else {
                solarPanelTypeField = SOLAR_PANEL_TYPES.other
                otherSolarPanelTypeField = solarPanelType
            }
        } else {
            solarPanelTypeField = undefined
            otherSolarPanelTypeField = undefined
        }
        return [solarPanelTypeField, otherSolarPanelTypeField]
    }

    /**
     * Form field values based on current housing installation information.
     */
    const formFieldsValuesAccordingToCurrentInstallation: installationFormFieldsType = useMemo(() => {
        const housingEquipmentsFields: Record<string, string> = {}
        installationInfos?.housingEquipments?.forEach((equipment) => {
            if (equipment.equipmentType) {
                const equipmentName = equipmentsList?.find((e) => e.id === equipment.equipmentId)?.name
                if (equipmentName) {
                    housingEquipmentsFields[equipmentName] = equipment.equipmentType
                }
            }
        })

        const [solarPanelType, otherSolarPanelType] = getSolarPanelTypeFieldsValues(
            installationInfos?.solarInstallation?.solarPanelType,
        )

        return {
            ...housingEquipmentsFields,
            title: installationInfos?.solarInstallation?.title,
            installationDate: installationInfos?.solarInstallation?.installationDate,
            solarPanelType,
            otherSolarPanelType,
            orientation: installationInfos?.solarInstallation?.orientation,
            solarPanelBrand: installationInfos?.solarInstallation?.solarPanelBrand,
            inverterBrand: installationInfos?.solarInstallation?.inverterBrand,
            inclination: installationInfos?.solarInstallation?.inclination,
            power: installationInfos?.solarInstallation?.power,
            hasResaleContract: installationInfos?.solarInstallation?.hasResaleContract,
            resaleTariff: installationInfos?.solarInstallation?.resaleTariff,
            statusWhenWantingSolarPanel: installationInfos?.solarInstallation?.statusWhenWantingSolarPanel,
        }
    }, [
        equipmentsList,
        installationInfos?.housingEquipments,
        installationInfos?.solarInstallation?.hasResaleContract,
        installationInfos?.solarInstallation?.inclination,
        installationInfos?.solarInstallation?.installationDate,
        installationInfos?.solarInstallation?.inverterBrand,
        installationInfos?.solarInstallation?.orientation,
        installationInfos?.solarInstallation?.power,
        installationInfos?.solarInstallation?.resaleTariff,
        installationInfos?.solarInstallation?.solarPanelBrand,
        installationInfos?.solarInstallation?.solarPanelType,
        installationInfos?.solarInstallation?.statusWhenWantingSolarPanel,
        installationInfos?.solarInstallation?.title,
    ])

    useEffect(() => {
        reset(formFieldsValuesAccordingToCurrentInstallation)
    }, [formFieldsValuesAccordingToCurrentInstallation, reset])

    /**
     * Function to handle form submit.
     *
     * @param data Form data.
     * @returns N/A.
     */
    const handleFormSubmit = async (data: any) => {
        /**
         * Generate the housingEquipments object to pass with the body of the request
         * to add or update the installation infos.
         */
        const housingEquipments: equipmentMeterType[] =
            equipmentsList
                ?.filter((e) => ['heater', 'hotplate', 'sanitary', 'solarpanel'].includes(e.name))
                .reduce(
                    (prev, curr) =>
                        /**
                         * Check if the value of the equipment is different from the default value,
                         * if yes, add it to the array of data to send to the backend.
                         */
                        data[curr.name] !==
                        formFieldsValuesAccordingToCurrentInstallation[
                            curr.name as 'heater' | 'hotplate' | 'sanitary' | 'solarpanel'
                        ]
                            ? [...prev, { equipmentId: curr.id, equipmentType: data[curr.name] }]
                            : [...prev],
                    [] as equipmentMeterType[],
                ) ?? []

        addUpdateInstallationInfos({
            housingEquipments,
            solarInstallation: {
                title: data.title || undefined,
                installationDate: data.installationDate || undefined,
                solarPanelType:
                    (data.solarPanelType === SOLAR_PANEL_TYPES.other
                        ? data.otherSolarPanelType
                        : data.solarPanelType) || undefined,
                orientation: data.orientation,
                solarPanelBrand: data.solarPanelBrand || undefined,
                inverterBrand: data.inverterBrand || undefined,
                inclination: data.inclination,
                power: data.power,
                hasResaleContract: data.hasResaleContract,
                resaleTariff: data.resaleTariff,
                statusWhenWantingSolarPanel: data.statusWhenWantingSolarPanel || undefined,
            },
        })
    }

    if (getInstallationInfosInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    return (
        <Container sx={{ paddingBottom: '30px', width: '100%', maxWidth: '660px !important' }}>
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
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="w-full">
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
                        <TypographyFormatMessage className="text-15 font-600">
                            Utilisation de l'énergie dans mon domicile
                        </TypographyFormatMessage>

                        {/***** The heater state *****/}
                        <div className="text-13 mt-32">
                            <SelectButtons {...heaterEquipment} />
                        </div>

                        {/***** The sanitary state *****/}
                        <div className="text-13 mt-32">
                            <SelectButtons {...sanitaryEquipment} />
                        </div>

                        {/***** The hot plate state *****/}
                        <div className="text-13 mt-32">
                            <SelectButtons {...hotPlateEquipment} />
                        </div>
                    </div>
                    <div className="mb-40">
                        <TypographyFormatMessage className="text-15 font-600">
                            Ma production d'énergie
                        </TypographyFormatMessage>

                        {/***** The solar panel possession state *****/}
                        <div className="text-13 mt-32 flex items-center justify-between gap-x-20 gap-y-10 flex-wrap">
                            <Typography>
                                {formatMessage({
                                    id: 'Je dispose de panneaux solaires',
                                    defaultMessage: 'Je dispose de panneaux solaires',
                                })}
                                &nbsp;:
                            </Typography>
                            <Controller
                                name="solarpanel"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={watch(field.name)}
                                        onChange={(_, value) => {
                                            switch (value) {
                                                case 'existant':
                                                    reset({
                                                        ...formFieldsValuesAccordingToCurrentInstallation,
                                                        heater: getValues('heater'),
                                                        sanitary: getValues('sanitary'),
                                                        hotplate: getValues('hotplate'),
                                                        solarpanel: 'existant',
                                                        statusWhenWantingSolarPanel: undefined,
                                                    })
                                                    break
                                                case 'nonexistant':
                                                    reset({
                                                        ...formFieldsValuesAccordingToCurrentInstallation,
                                                        heater: getValues('heater'),
                                                        sanitary: getValues('sanitary'),
                                                        hotplate: getValues('hotplate'),
                                                        solarpanel: 'nonexistant',
                                                        title: undefined,
                                                        installationDate: undefined,
                                                        solarPanelType: undefined,
                                                        otherSolarPanelType: undefined,
                                                        orientation: undefined,
                                                        solarPanelBrand: undefined,
                                                        inverterBrand: undefined,
                                                        inclination: undefined,
                                                        power: undefined,
                                                        hasResaleContract: undefined,
                                                        resaleTariff: undefined,
                                                        statusWhenWantingSolarPanel: undefined,
                                                    })
                                                    break
                                                case 'possibly':
                                                    reset({
                                                        ...formFieldsValuesAccordingToCurrentInstallation,
                                                        heater: getValues('heater'),
                                                        sanitary: getValues('sanitary'),
                                                        hotplate: getValues('hotplate'),
                                                        solarpanel: 'possibly',
                                                        title: undefined,
                                                        installationDate: undefined,
                                                        solarPanelType: undefined,
                                                        otherSolarPanelType: undefined,
                                                        orientation: undefined,
                                                        solarPanelBrand: undefined,
                                                        inverterBrand: undefined,
                                                        inclination: undefined,
                                                        power: undefined,
                                                        hasResaleContract: undefined,
                                                        resaleTariff: undefined,
                                                    })
                                                    break
                                            }
                                        }}
                                        className="flex flex-row"
                                    >
                                        <FormControlLabel
                                            value="existant"
                                            label="Oui"
                                            control={<Radio checked={watch('solarpanel') === 'existant'} />}
                                        />
                                        <FormControlLabel
                                            value="nonexistant"
                                            label="Non"
                                            control={<Radio checked={watch('solarpanel') === 'nonexistant'} />}
                                        />
                                        <FormControlLabel
                                            value="possibly"
                                            label="J'y pense"
                                            control={<Radio checked={watch('solarpanel') === 'possibly'} />}
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        {watch('solarpanel') === 'existant' && (
                            <>
                                <TypographyFormatMessage className="text-14 font-600 mt-32">
                                    Détail de votre installation
                                </TypographyFormatMessage>

                                {/***** The title of the installation *****/}
                                <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                    <Typography>
                                        {formatMessage({
                                            id: 'Nommez votre installation',
                                            defaultMessage: 'Nommez votre installation',
                                        })}
                                        &nbsp;:
                                    </Typography>
                                    <TextField
                                        name="title"
                                        label="Nom d'installation"
                                        style={{ marginBottom: 0 }}
                                        className="w-full sm:w-auto"
                                        placeholder="mon installation 3kwc sur le toit"
                                    />
                                </div>

                                {/***** The installation date *****/}
                                <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                    <Typography>
                                        {formatMessage({
                                            id: 'Date d’installation',
                                            defaultMessage: 'Date d’installation',
                                        })}
                                        &nbsp;:
                                    </Typography>
                                    <DatePicker
                                        name="installationDate"
                                        label="Date"
                                        textFieldProps={{
                                            className: 'w-full sm:w-auto mt-0 mb-0',
                                        }}
                                    />
                                </div>

                                {/***** The solar panel type *****/}
                                <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-20 gap-y-10 flex-wrap">
                                    <Typography className="self-start sm:mt-10">
                                        {formatMessage({
                                            id: 'Type de panneaux',
                                            defaultMessage: 'Type de panneaux',
                                        })}
                                        &nbsp;:
                                    </Typography>
                                    <Controller
                                        name="solarPanelType"
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={watch(field.name)}
                                                onChange={(_, value) => {
                                                    setValue(field.name, value)
                                                    switch (value) {
                                                        case SOLAR_PANEL_TYPES.onRoof:
                                                            setValue(
                                                                'orientation',
                                                                formFieldsValuesAccordingToCurrentInstallation.orientation,
                                                            )
                                                            setValue('otherSolarPanelType', '')
                                                            break
                                                        case SOLAR_PANEL_TYPES.plugAndPlay:
                                                            setValue('orientation', undefined)
                                                            setValue('otherSolarPanelType', '')
                                                            break
                                                        case SOLAR_PANEL_TYPES.other:
                                                            setValue('orientation', undefined)
                                                            setValue(
                                                                'otherSolarPanelType',
                                                                formFieldsValuesAccordingToCurrentInstallation.otherSolarPanelType,
                                                            )
                                                            break
                                                    }
                                                }}
                                                className="flex-1 grid grid-cols-1 sm:grid-cols-2 sm:max-w-400"
                                            >
                                                <FormControlLabel
                                                    value={SOLAR_PANEL_TYPES.onRoof}
                                                    label={SOLAR_PANEL_TYPES.onRoof}
                                                    control={
                                                        <Radio
                                                            checked={
                                                                watch('solarPanelType') === SOLAR_PANEL_TYPES.onRoof
                                                            }
                                                        />
                                                    }
                                                />
                                                <FormControlLabel
                                                    value={SOLAR_PANEL_TYPES.plugAndPlay}
                                                    label={SOLAR_PANEL_TYPES.plugAndPlay}
                                                    control={
                                                        <Radio
                                                            checked={
                                                                watch('solarPanelType') ===
                                                                SOLAR_PANEL_TYPES.plugAndPlay
                                                            }
                                                        />
                                                    }
                                                />
                                                <FormControlLabel
                                                    value={SOLAR_PANEL_TYPES.other}
                                                    label={SOLAR_PANEL_TYPES.other}
                                                    control={
                                                        <Radio
                                                            checked={
                                                                watch('solarPanelType') === SOLAR_PANEL_TYPES.other
                                                            }
                                                        />
                                                    }
                                                />
                                                <TextField
                                                    name="otherSolarPanelType"
                                                    value={watch('otherSolarPanelType')}
                                                    label="Préciser"
                                                    style={{ marginBottom: 0 }}
                                                    className="w-full"
                                                    disabled={watch('solarPanelType') !== SOLAR_PANEL_TYPES.other}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </div>

                                {/***** The orientation *****/}
                                {watch('solarPanelType') === SOLAR_PANEL_TYPES.onRoof && (
                                    <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-20 gap-y-10 flex-wrap">
                                        <Typography className="self-start sm:mt-10">
                                            {formatMessage({
                                                id: 'Orientation',
                                                defaultMessage: 'Orientation',
                                            })}
                                            &nbsp;:
                                        </Typography>
                                        <Controller
                                            name="orientation"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    value={watch(field.name)}
                                                    onChange={(_, value) => setValue(field.name, parseInt(value))}
                                                    className="flex-1 grid grid-cols-2 sm:grid-cols-3 sm:max-w-400"
                                                >
                                                    {[
                                                        { label: 'Nord-Ouest', value: 315 },
                                                        { label: 'Nord', value: 0 },
                                                        { label: 'Nord-Est', value: 45 },
                                                        { label: 'Ouest', value: 270 },
                                                        {},
                                                        { label: 'Est', value: 90 },
                                                        { label: 'Sud-Ouest', value: 225 },
                                                        { label: 'Sud', value: 180 },
                                                        { label: 'Sud-Est', value: 135 },
                                                    ].map(({ label, value }) =>
                                                        label ? (
                                                            <FormControlLabel
                                                                key={value}
                                                                value={value}
                                                                label={label}
                                                                control={
                                                                    <Radio checked={watch('orientation') === value} />
                                                                }
                                                                className="min-w-128"
                                                            />
                                                        ) : (
                                                            <div className="hidden sm:block" />
                                                        ),
                                                    )}
                                                </RadioGroup>
                                            )}
                                        />
                                    </div>
                                )}

                                <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-x-20 gap-y-32">
                                    {/***** The solar panel brand *****/}
                                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                        <Typography className="whitespace-nowrap">
                                            {formatMessage({
                                                id: 'Marque de panneaux',
                                                defaultMessage: 'Marque de panneaux',
                                            })}
                                            &nbsp;:
                                        </Typography>
                                        <div className="w-full sm:w-auto sm:max-w-160">
                                            <Select
                                                name="solarPanelBrand"
                                                label={formatMessage({
                                                    id: 'Marque',
                                                    defaultMessage: 'Marque',
                                                })}
                                                sx={{ minWidth: '160px' }}
                                            >
                                                {SOLAR_PANEL_BRANDS.map((panelBrand) => (
                                                    <MenuItem key={panelBrand} value={panelBrand}>
                                                        {panelBrand}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    {/***** The power *****/}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                        <Typography>
                                            {formatMessage({
                                                id: 'Puissance (kwc)',
                                                defaultMessage: 'Puissance (kwc)',
                                            })}
                                            &nbsp;:
                                        </Typography>
                                        <TextField
                                            name="power"
                                            label="Puissance"
                                            type="number"
                                            style={{ marginBottom: 0 }}
                                            className="w-full sm:w-auto sm:max-w-128"
                                        />
                                    </div>
                                </div>

                                <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-x-20 gap-y-32">
                                    {/***** The inverter brand *****/}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                        <Typography className="whitespace-nowrap">
                                            {formatMessage({
                                                id: 'Marque de l’onduleur',
                                                defaultMessage: 'Marque de l’onduleur',
                                            })}
                                            &nbsp;:
                                        </Typography>
                                        <div className="w-full sm:w-auto sm:max-w-160">
                                            <Select
                                                name="inverterBrand"
                                                label={formatMessage({
                                                    id: 'Marque',
                                                    defaultMessage: 'Marque',
                                                })}
                                                sx={{ minWidth: '160px' }}
                                            >
                                                {INVERTER_BRANDS.map((inverterBrand) => (
                                                    <MenuItem key={inverterBrand} value={inverterBrand}>
                                                        {inverterBrand}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    {/***** The inclination *****/}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                        <Typography>
                                            {formatMessage({
                                                id: 'Inclinaison (%)',
                                                defaultMessage: 'Inclinaison (%)',
                                            })}
                                            &nbsp;:
                                        </Typography>
                                        <TextField
                                            name="inclination"
                                            label="Inclinaison"
                                            type="number"
                                            style={{ marginBottom: 0 }}
                                            className="w-full sm:w-auto sm:max-w-128"
                                        />
                                    </div>
                                </div>

                                {/***** The resale contract possession status *****/}
                                <div className="text-13 mt-32 flex items-center justify-between gap-x-20 gap-y-10 flex-wrap">
                                    <Typography>
                                        {formatMessage({
                                            id: 'Avez-vous un contrat de revente',
                                            defaultMessage: 'Avez-vous un contrat de revente',
                                        })}
                                        &nbsp;:
                                    </Typography>
                                    <Controller
                                        name="hasResaleContract"
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={watch(field.name)}
                                                onChange={(_, value) => {
                                                    setValue(field.name, value === 'true')
                                                    switch (value) {
                                                        case 'true':
                                                            setValue(
                                                                'resaleTariff',
                                                                formFieldsValuesAccordingToCurrentInstallation.resaleTariff,
                                                            )
                                                            break
                                                        case 'false':
                                                            setValue('resaleTariff', undefined)
                                                            break
                                                    }
                                                }}
                                                className="flex flex-row"
                                            >
                                                <FormControlLabel
                                                    value={true}
                                                    label="Oui"
                                                    control={<Radio checked={watch('hasResaleContract')} />}
                                                />
                                                <FormControlLabel
                                                    value={false}
                                                    label="Non"
                                                    control={<Radio checked={watch('hasResaleContract') === false} />}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </div>

                                {/***** The resale tariff *****/}
                                {watch('hasResaleContract') && (
                                    <div className="text-13 mt-32 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-x-20 gap-y-10">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-20 gap-y-10">
                                            <Typography>
                                                {formatMessage({
                                                    id: 'Tarif de revente (€)',
                                                    defaultMessage: 'Tarif de revente (€)',
                                                })}
                                                &nbsp;:
                                            </Typography>
                                            <TextField
                                                name="resaleTariff"
                                                label="Tarif"
                                                type="number"
                                                style={{ marginBottom: 0 }}
                                                className="w-full sm:w-auto sm:max-w-128"
                                            />
                                        </div>
                                        <Typography className="text-11 text-grey-700 text-center w-auto sm:max-w-288">
                                            {formatMessage({
                                                id: '*avec cette information, nous pourrons bientôt vous permettre de voir votre production en euros.',
                                                defaultMessage:
                                                    '*avec cette information, nous pourrons bientôt vous permettre de voir votre production en euros.',
                                            })}
                                        </Typography>
                                    </div>
                                )}
                            </>
                        )}

                        {watch('solarpanel') === 'possibly' && (
                            <Controller
                                name="statusWhenWantingSolarPanel"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={watch(field.name)}
                                        onChange={(_, value) => setValue(field.name, value)}
                                        className="text-13 mt-20"
                                    >
                                        <FormControlLabel
                                            value="J’ai déjà des devis, je n’ai besoin de rien"
                                            label="J’ai déjà des devis, je n’ai besoin de rien"
                                            control={
                                                <Radio
                                                    checked={
                                                        watch('statusWhenWantingSolarPanel') ===
                                                        'J’ai déjà des devis, je n’ai besoin de rien'
                                                    }
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            value="Je souhaite être mis en relation avec un partenaire de confiance nrLINK"
                                            label="Je souhaite être mis en relation avec un partenaire de confiance nrLINK"
                                            control={
                                                <Radio
                                                    checked={
                                                        watch('statusWhenWantingSolarPanel') ===
                                                        'Je souhaite être mis en relation avec un partenaire de confiance nrLINK'
                                                    }
                                                />
                                            }
                                            className="mt-5"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        )}
                    </div>
                    <div className="flex justify-end item-center">
                        <ButtonLoader
                            type="submit"
                            inProgress={addUpdateInstallationInfosInProgress}
                            disabled={
                                addUpdateInstallationInfosInProgress ||
                                isEqual(watch(), formFieldsValuesAccordingToCurrentInstallation)
                            }
                            className="w-full sm:w-auto"
                        >
                            <TypographyFormatMessage>Enregistrer mes modification</TypographyFormatMessage>
                        </ButtonLoader>
                    </div>
                    <a
                        href="https://e0vzc8h9q32.typeform.com/to/pNFEjfzU"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: theme.palette.primary.main,
                            display: 'inline-block',
                            marginTop: '20px',
                            backgroundColor: 'transparent',
                            border: 0,
                        }}
                    >
                        {formatMessage({
                            id: 'Souhaitez-vous nous faire part de votre expérience et recommander votre installateur ?',
                            defaultMessage:
                                'Souhaitez-vous nous faire part de votre expérience et recommander votre installateur ?',
                        })}
                    </a>
                </form>
            </FormProvider>
        </Container>
    )
}
