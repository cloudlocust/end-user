import React, { SyntheticEvent } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import 'src/common/ui-kit/components/MapElementList/components/Toolbar/Toolbar.scss'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import { useIntl } from 'src/common/react-platform-translation'
import FilterButton, {
    filterListType,
} from 'src/common/ui-kit/components/MapElementList/components/Filters/FilterButton'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import Paper from '@mui/material/Paper'
import { motion } from 'framer-motion'

/**
 *
 */
interface ToolbarProps<T> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleMapToggle: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    className?: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    filterList?: filterListType
    // eslint-disable-next-line jsdoc/require-jsdoc
    onConfirmFilter?: (newFilters: T | {}) => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    toolbarSearch?: Boolean
}

/**
 * React Component that show the toolbar that have a leftSide and a RightSide,the leftSide can be Listing Filters, and RightSide can be showMap Checkbow.
 *
 * @param props N/A.
 * @param props.handleMapToggle HandleMapToggle Component.
 * @param props.className Additional ClassName.
 * @param props.filterList List of filterList data, each filter is an object that's going to be shown in AccordionItem for mobile screens, and FilterButton for other.
 * @param props.onConfirmFilter Function to be called when submit filter.
 * @param props.toolbarSearch Boolean that activates or disactivate search bar on the component toolbar.
 * @returns Toolbar Component.
 */
export default function Toolbar<T>({
    handleMapToggle,
    className,
    filterList,
    onConfirmFilter,
    toolbarSearch,
}: ToolbarProps<T>) {
    const mainTheme = useTheme()
    const { formatMessage } = useIntl()
    const [searchInputValue, setSearchInputValue] = React.useState('')

    return (
        <ThemeProvider theme={mainTheme}>
            <Card className={`Toolbar ${className} w-full shadow`}>
                <div className={`toolbar-filters ${toolbarSearch && 'toolbar-filters-search'}`}>
                    <div>
                        {filterList && (
                            <div className="flex">
                                {filterList.map((filterDetails) => {
                                    return (
                                        <FilterButton<T>
                                            filterDetails={filterDetails}
                                            key={filterDetails.name}
                                            onConfirmFilter={onConfirmFilter!}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    {toolbarSearch && (
                        <div className="w-full flex flex-1 items-center justify-center p-12">
                            <Paper
                                component={motion.div}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                                className="flex items-center w-full max-w-512 px-8 py-8 rounded-16 shadow"
                            >
                                <IconButton
                                    onClick={(e: SyntheticEvent) => {
                                        onConfirmFilter?.({ search: searchInputValue })
                                    }}
                                    className="p-1 sm:p-4"
                                >
                                    <Icon color="action">search</Icon>
                                </IconButton>

                                <Input
                                    placeholder={formatMessage({
                                        id: 'Recherche',
                                        defaultMessage: 'Recherche',
                                    })}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            onConfirmFilter?.({ search: searchInputValue })
                                        }
                                    }}
                                    className="flex flex-1 mx-8"
                                    disableUnderline
                                    fullWidth
                                    onChange={
                                        // eslint-disable-next-line jsdoc/require-jsdoc
                                        (e: SyntheticEvent & { target: { value: string } }) =>
                                            setSearchInputValue(e.target.value)
                                    }
                                    value={searchInputValue}
                                    inputProps={{
                                        'aria-label': 'Search',
                                    }}
                                />
                            </Paper>
                        </div>
                    )}
                    <div className="ShowMapCheckbox">
                        <FormControlLabel
                            control={<Checkbox defaultChecked={false} onChange={handleMapToggle} color="secondary" />}
                            label={
                                <>
                                    <span className="hidden sm:flex text-13 font-bold">
                                        {formatMessage({
                                            id: 'Afficher Carte',
                                            defaultMessage: 'Afficher Carte',
                                        })}
                                    </span>
                                    <span className="flex sm:hidden text-13 font-bold">
                                        {formatMessage({
                                            id: 'Carte',
                                            defaultMessage: 'Carte',
                                        })}
                                    </span>
                                </>
                            }
                            labelPlacement="start"
                        />
                    </div>
                </div>
            </Card>
        </ThemeProvider>
    )
}
