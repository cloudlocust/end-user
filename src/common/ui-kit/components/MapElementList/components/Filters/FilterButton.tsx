import React from 'react'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Popover, { PopoverProps } from '@mui/material/Popover'
import { useIntl } from 'src/common/react-platform-translation'
import { isEmpty, isEqual } from 'lodash'

/**
 * Single Filter Options Type.
 */
export type filterDetailsTypePropertyT = 'bool' | 'select'

/**
 * FilterDetails Options Type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type filterDetailsOptionsType = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    label: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    name: string
}[]
/**
 *
 * Filters Types.
 */
export interface filterDetailsType {
    // eslint-disable-next-line jsdoc/require-jsdoc
    label: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    name: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: filterDetailsTypePropertyT
    // eslint-disable-next-line jsdoc/require-jsdoc
    options: filterDetailsOptionsType
}
// eslint-disable-next-line jsdoc/require-jsdoc
export type filterListType = filterDetailsType[]

// Type of anchorEl Property from Popover
// eslint-disable-next-line jsdoc/require-jsdoc
type popOverAnchorElType = PopoverProps['anchorEl']

/**
 * Filter Button Props.
 */
interface FilterButtonProps<T> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    filterDetails: filterDetailsType
    // eslint-disable-next-line jsdoc/require-jsdoc
    onConfirmFilter: (newFilters: T | {}) => void
}

/**
 * Function to create onConfirmFilter Arguments, from the filterDetails that has type 'bool'.
 * For example if we have filterDetails = {name: 'interest', type: 'bool', label: 'Intérêt', options: [ {name: 'nameOpt1', label:'labelOpt1'}, {name: 'nameOpt2', label: 'labelOpt2'} ]}.
 * If we call this function with checkValue=false, it'll return the following object {nameOpt1: false, nameOpt2: false}.
 *
 * @param filterDetailsOptions Single filter that comes from props passed as argument.
 * @param checkValue Value of either TRUE or FALSE to be passed, if we want the state to be intitially TRUE or FALSE.
 * @returns CreateInitialSelectedOptionStateFromFilterOptions function.
 */
function createOnConfirmFilterArgumentsFromFilterDetailsBoolType<T>(
    filterDetailsOptions: filterDetailsOptionsType,
    checkValue?: Boolean,
    // eslint-disable-next-line jsdoc/require-jsdoc
): T | {} {
    return filterDetailsOptions.reduce((acc, option) => {
        if (option.name === '__novalue__') return acc
        return { ...acc, [option.name]: checkValue }
    }, {})
}

/**
 * FilterButtonList component is the list of the FilterButtons for filtering MapElementList.
 *
 * @param props N/A.
 * @param props.filterList List of filterList data, each filter is an object that's going to be shown in AccordionItem for mobile screens, and FilterButton for other.
 * @param props.onConfirmFilter Action when chosing options for a specific filter.
 * @returns FilterButtonList component.
 */
export default function FilterButton<T>(props: FilterButtonProps<T>) {
    const { filterDetails, onConfirmFilter } = props
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([])
    const [selectedOptionsValueWhenOpeningOptionsMenu, setSelectedOptionsValueWhenOpeningOptionsMenu] =
        React.useState<string[]>(selectedOptions)
    const [filterDetailsOptionsMenu, setFilterDetailsOptionsMenu] = React.useState<HTMLAnchorElement | null | string>(
        null,
    )

    const { formatMessage } = useIntl()

    /**
     * Handler for the selectedOptions changes, which is a state to handle UI of checkboxes if they're checked or not, and it'll help to define the right arguments to call onConfirmFilter.
     *
     * @param e Event.
     */
    const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === '__novalue__') {
            setSelectedOptions(e.target.checked ? ['__novalue__'] : [])
        } else {
            setSelectedOptions((prevState) => {
                let newSelectedOptions = prevState.filter((selectedOption) => selectedOption !== '__novalue__')

                if (e.target.checked) newSelectedOptions.push(e.target.name)
                else
                    newSelectedOptions = newSelectedOptions.filter((selectedOption) => selectedOption !== e.target.name)
                return newSelectedOptions
            })
        }
    }

    /**
     * Function to Call the onConfirmFilter with arguments based on selectedOptions state.
     */
    const handleSubmitFilter = () => {
        // if selectedOptions is same when we close the menu as when we opened it, then we shouldn't call onConfirmFilter.
        if (isEqual(selectedOptions, selectedOptionsValueWhenOpeningOptionsMenu)) return
        let newFilter = {}
        // When type is bool, we'll call the onConfirm filter with an object which can have the following key/value pair {key1: true | false | undefined}.
        if (filterDetails.type === 'bool') {
            if (isEmpty(selectedOptions))
                onConfirmFilter(
                    createOnConfirmFilterArgumentsFromFilterDetailsBoolType<T>(filterDetails.options, undefined),
                )
            else if (selectedOptions.includes('__novalue__')) {
                onConfirmFilter(
                    createOnConfirmFilterArgumentsFromFilterDetailsBoolType<T>(filterDetails.options, false),
                )
            } else {
                // Create an object where the option that are unchecked will have {[name]: false}, and the one that are checked will have {[name]: true}.
                const deselectedFilterOptions = createOnConfirmFilterArgumentsFromFilterDetailsBoolType<T>(
                    filterDetails.options,
                    undefined,
                )
                const selectedFilterOptions = selectedOptions.reduce((acc, opt) => {
                    return { ...acc, [opt]: true }
                }, {})
                newFilter = { ...deselectedFilterOptions, ...selectedFilterOptions }
            }
        } else {
            newFilter = { [filterDetails.name]: selectedOptions }
        }
        onConfirmFilter(newFilter)
    }

    /**
     * Handler when clicking on Button in the toolbar to see the filterDetails options in a popover.
     * We store the selectedOptions at that moment, so that we don't trigger onConfirmFilter when closing the menu if nothing change.
     *
     * @param event Event.
     */
    const filterMenuClick = (
        // eslint-disable-next-line jsdoc/require-jsdoc
        event: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement, MouseEvent>,
    ) => {
        if (filterDetailsOptionsMenu) setFilterDetailsOptionsMenu(null)
        else {
            setSelectedOptionsValueWhenOpeningOptionsMenu(selectedOptions)
            setFilterDetailsOptionsMenu(event.currentTarget)
        }
    }

    /**
     * Handler when closing the filterOptionsMenu options popover.
     */
    const closeFilterDetailsOptionsMenu = async () => {
        setFilterDetailsOptionsMenu(null)
        handleSubmitFilter()
    }

    return (
        <>
            <Button
                key={filterDetails.label}
                variant={isEmpty(selectedOptions) ? 'outlined' : 'contained'}
                color="inherit"
                className="sm:min-w-64 rounded-none border-gray-300 mr-8"
                onClick={filterMenuClick}
                name={filterDetails.label}
            >
                {formatMessage({
                    id: filterDetails.label,
                    defaultMessage: filterDetails.label,
                })}
                {!isEmpty(selectedOptions) && `: ${selectedOptions.length}`}
            </Button>

            <Popover
                open={Boolean(filterDetailsOptionsMenu)}
                anchorEl={filterDetailsOptionsMenu as popOverAnchorElType}
                onClose={closeFilterDetailsOptionsMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                classes={{
                    paper: 'p-12 mt-6 w-full sm:w-1/4',
                }}
            >
                {filterDetailsOptionsMenu &&
                    filterDetails.options.map((opt) => {
                        return (
                            <FormGroup>
                                <FormControlLabel
                                    key={opt.name}
                                    name={opt.label}
                                    control={
                                        <Checkbox
                                            onChange={onOptionChange}
                                            id={opt.label}
                                            name={opt.name}
                                            checked={selectedOptions.includes(opt.name)}
                                            data-testid={`checkbox-${opt.name}`}
                                        />
                                    }
                                    label={formatMessage({
                                        id: opt.label,
                                        defaultMessage: opt.label,
                                    })}
                                />
                            </FormGroup>
                        )
                    })}
                {!isEmpty(selectedOptions) && (
                    <Button variant="outlined" className="mt-10 w-full" onClick={() => setSelectedOptions([])}>
                        {formatMessage({
                            id: 'Réinitialiser',
                            defaultMessage: 'Réinitialiser',
                        })}
                    </Button>
                )}
            </Popover>
        </>
    )
}
