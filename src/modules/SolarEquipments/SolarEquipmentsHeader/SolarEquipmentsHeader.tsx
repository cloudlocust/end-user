import { Button, Icon, ThemeProvider, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'

/**
 * Equipment Requests header element.
 *
 * @param root0 N/A.
 * @param root0.setIsSolarEquipmentCreateUpdatePopupOpen Setter function to open popup for adding equipment request.
 * @returns EquipmentRequestsHeader component.
 */
export const SolarEquipmentHeader = ({
    setIsSolarEquipmentCreateUpdatePopupOpen,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    setIsSolarEquipmentCreateUpdatePopupOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const mainTheme = selectTheme()
    const { formatMessage } = useIntl()

    return (
        <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex items-center">
                <Icon
                    component={motion.span}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.2 } }}
                    className="text-24 md:text-32"
                >
                    list_alt
                </Icon>
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    className="text-16 md:text-24 mx-12 font-semibold"
                >
                    <span className="hidden sm:flex">
                        {formatMessage({
                            id: 'Mes équipements',
                            defaultMessage: 'Mes équipements',
                        })}
                    </span>
                    <span className="flex sm:hidden">
                        {formatMessage({
                            id: 'Equipements',
                            defaultMessage: 'Equipements',
                        })}
                    </span>
                </Typography>
            </div>

            <div className="flex flex-1 items-center justify-end px-12">
                <ThemeProvider theme={mainTheme}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    >
                        <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setIsSolarEquipmentCreateUpdatePopupOpen(true)
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'secondary.main',
                                    opacity: '.7',
                                },
                            }}
                        >
                            <span className="hidden sm:flex">
                                {formatMessage({
                                    id: 'Ajouter un équipement',
                                    defaultMessage: 'Ajouter un équipement',
                                })}
                            </span>
                            <span className="flex sm:hidden">
                                <Icon>add</Icon>
                            </span>
                        </Button>
                    </motion.div>
                </ThemeProvider>
            </div>
        </div>
    )
}
