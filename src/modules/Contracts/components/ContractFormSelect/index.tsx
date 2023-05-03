import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { ContractFormSelectProps } from 'src/modules/Contracts/contractsTypes.d'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { isNull } from 'lodash'

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
    useEffect(() => {
        // Load optionList on mount, which will automatically update the optionList
        loadOptions()
    }, [loadOptions])

    /**
     * Eyes tears blood...
     * I haven't found any work around that work better than that without a big refactor,
     * the Form is managed with a logic, when a MenuItem::onChange is fired, its calling all parents onChange untill he call
     * the onChange inside ContractForm, the thing is I can't touch to this, or the hooks cause its will make a big refactor,
     * this is the best workAround for it.
     * When he has no other option (list of option contain one choice, no otherOptionLabel so no custom fields),
     * I call the onChange myself in the useEffect, the onChange just use target {...} not the ReactNode,
     * I just listen on optionList, this @var will only have two change
     * render -> where is Empty and dont call useEffect
     * loaded -> when loadOptions have been a success so it will hidrate optionList once.
     */

    useEffect(() => {
        if (!otherOptionLabel && optionList && optionList.length === 1 && otherSelectProps.onChange) {
            otherSelectProps.onChange(
                {
                    target: {
                        name: name,
                        value: formatOptionValue(optionList[0]),
                    },
                } as any,
                null,
            )
        } // eslint-disable-next-line
    }, [optionList])

    if (isOptionsInProgress || isNull(optionList))
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        )

    if (!otherOptionLabel && optionList && optionList.length === 1) {
        return (
            <Select
                name={name}
                data-testid="formSelectDefaultAndDisabled"
                label={formatMessage({
                    id: `${label}`,
                    defaultMessage: `${label}`,
                })}
                validateFunctions={validateFunctions}
                disabled={true}
                {...otherSelectProps}
            >
                <MenuItem value={formatOptionValue(optionList[0])}>{formatOptionLabel(optionList[0])}</MenuItem>
            </Select>
        )
    }

    return (
        <>
            <Select
                name={name}
                label={formatMessage({
                    id: `${label}`,
                    defaultMessage: `${label}`,
                })}
                defaultValue=""
                validateFunctions={validateFunctions}
                {...otherSelectProps}
            >
                {optionList.map((option, _index) => (
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
