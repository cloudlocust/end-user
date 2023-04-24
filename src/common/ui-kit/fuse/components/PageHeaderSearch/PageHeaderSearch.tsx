import { useState, SyntheticEvent } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Input from '@mui/material/Input'
import Paper from '@mui/material/Paper'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { useIntl } from 'src/common/react-platform-translation'
import IconButton from '@mui/material/IconButton'

/**
 *
 */
type PageHeaderSearchProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        headerTitle: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        headerIconName: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        onSearchClick: ({ search }: { search: string }) => void
        // eslint-disable-next-line jsdoc/require-jsdoc
        onActionClick?: (e?: SyntheticEvent) => void
        // eslint-disable-next-line jsdoc/require-jsdoc
        actionText?: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        actionIconName?: string
    }
/**
 * PageHeaderSearch Reusable Header with Search component.
 *
 * @param props Containing {open, handleClose} to the AddCustomerPopup.
 * @param props.headerTitle Text that represents the header title.
 * @param props.headerIconName Name of the icon placed in the header title.
 * @param props.onSearchClick Function to be called when submit search.
 * @param props.onActionClick Callback function when Clicking on the Action button of the header.
 * @param props.actionText Text of the Button representing ActionButton in the header.
 * @param props.actionIconName Represent the name of the icon that will replace the actionText when it's mobile.
 * @returns AddCustomerPopup component.
 */
function PageHeaderSearch(props: PageHeaderSearchProps) {
    const mainTheme = selectTheme()
    const { headerTitle, headerIconName, onSearchClick, onActionClick, actionIconName, actionText } = props
    const { formatMessage } = useIntl()
    const [searchInputValue, setSearchInputValue] = useState('')
    return (
        <>
            <ThemeProvider theme={mainTheme}>
                <div className="flex flex-1 w-full items-center justify-between p-24">
                    <div className="flex items-center">
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-24 md:text-32"
                        >
                            {headerIconName}
                        </Icon>
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
                        >
                            {formatMessage({
                                id: headerTitle,
                                defaultMessage: headerTitle,
                            })}
                        </Typography>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-12">
                        <Paper
                            component={motion.div}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                            className="flex items-center w-full max-w-512 px-8 py-8 rounded-16 shadow"
                        >
                            <IconButton
                                onClick={() => {
                                    onSearchClick({ search: searchInputValue })
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
                                        onSearchClick({ search: searchInputValue })
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
                    {onActionClick && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                        >
                            <Button
                                className="whitespace-nowrap"
                                variant="contained"
                                color="secondary"
                                onClick={onActionClick}
                            >
                                <span className="hidden sm:flex">
                                    {formatMessage({
                                        id: actionText,
                                        defaultMessage: actionText,
                                    })}
                                </span>
                                <span className="flex sm:hidden">
                                    <Icon>{actionIconName}</Icon>
                                </span>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </ThemeProvider>
        </>
    )
}

export default PageHeaderSearch
