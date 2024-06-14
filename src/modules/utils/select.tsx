import MenuItem from '@mui/material/MenuItem'

/**
 * Option of the select.
 */
export type SelectOption =
    /**
     * Option of the select.
     */
    {
        /**
         * Label .
         */
        label: JSX.Element
        /**
         * Value of the option.
         */
        value: string
    }

/**
 * Function to render the options of the select component.
 *
 * @param options The options to render.
 * @returns The rendered options.
 */
export const renderOptions = (options: SelectOption[]) => {
    return options.map((option, _index) => (
        <MenuItem key={option.value} value={option.value}>
            {option.label}
        </MenuItem>
    ))
}
