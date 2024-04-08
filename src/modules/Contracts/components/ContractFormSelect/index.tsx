import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { ContractFormSelectProps } from 'src/modules/Contracts/contractsTypes.d'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { isNull } from 'lodash'
import { useFormContext } from 'react-hook-form'
import { manualContractFillingIsEnabled } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * ContractFormSelect component that calls the loadOptions on mount, and show the Select with optionList or spinner when loadOptions are still pending.
 *
 * @param props N/A.
 * @param props.name Select name property.
 * @param props.optionList Option List.
 * @param props.loadOptions Function that call loadOptions on mount of the Select.
 * @param props.isOptionsInProgress Boolean indicating loading state of optionList.
 * @param props.formatOptionLabel Function that returns the option label format.
 * @param props.formatOptionValue Function that returns the option value format.
 * @param props.label Label of the select.
 * @param props.otherOptionLabel Label for Additional "other" option.
 * @param props.validateFunctions Validate functions passed in the Select.
 * @returns ContractFormSelect component.
 */
const ContractFormSelect = <T extends unknown>({
    name,
    optionList,
    loadOptions,
    isOptionsInProgress,
    formatOptionLabel,
    formatOptionValue,
    label,
    otherOptionLabel,
    validateFunctions,
    ...otherSelectProps
}: ContractFormSelectProps<T>): JSX.Element => {
    const { formatMessage } = useIntl()
    const { getValues, setValue } = useFormContext()

    useEffect(() => {
        // Load optionList on mount, which will automatically update the optionList
        loadOptions()
    }, [loadOptions])

    /**
     * If User got only one choice, we choose it by default,
     * getValues(name) should send "undefined", if undefined we set else, we don't care.
     */
    useEffect(() => {
        if (!otherOptionLabel && optionList?.length === 1 && !getValues(name)) {
            setValue(name, formatOptionValue(optionList[0]))
        }
    }, [getValues, setValue, otherOptionLabel, optionList, formatOptionValue, name])

    if (isOptionsInProgress || isNull(optionList))
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        )

    return (
        <>
            <Select
                name={name}
                label={formatMessage({
                    id: `${label}`,
                    defaultMessage: `${label}`,
                })}
                defaultValue=""
                disabled={!manualContractFillingIsEnabled || (optionList.length === 1 && !otherOptionLabel)}
                validateFunctions={validateFunctions}
                formControlProps={{
                    margin: 'normal',
                }}
                {...otherSelectProps}
            >
                {optionList?.map((option, _index) => (
                    <MenuItem key={formatOptionValue(option)} value={formatOptionValue(option)}>
                        {formatOptionLabel(option)}
                    </MenuItem>
                ))}
                {otherOptionLabel && (
                    <MenuItem key={otherOptionLabel} value={-1}>
                        {otherOptionLabel}
                    </MenuItem>
                )}
            </Select>
        </>
    )
}

export default ContractFormSelect
