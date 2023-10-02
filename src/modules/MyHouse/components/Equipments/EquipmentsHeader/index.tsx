import { Button, ThemeProvider, Icon, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { ButtonLoader } from 'src/common/ui-kit'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { useIntl } from 'react-intl'
import { EquipmentHeaderProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsHeader/equipmentsHeader'

/**
 * EquipmentsHeader compoonent.
 *
 * @param root0 N/A.
 * @param root0.isEquipmentMeterListEmpty N/A.
 * @returns EquipmentsHeader JSX.
 */
export const EquipmentsHeader = ({ isEquipmentMeterListEmpty }: EquipmentHeaderProps) => {
    const theme = selectTheme()
    const history = useHistory()
    const { formatMessage } = useIntl()

    return (
        <ThemeProvider theme={theme}>
            <div className="flex flex-1 w-full items-center justify-between">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    >
                        <Button sx={{ color: 'primary.contrastText' }} onClick={history.goBack} className="text-16">
                            <Icon
                                component={motion.span}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { delay: 0.2 } }}
                                className="text-16 md:text-24 mr-2 text"
                            >
                                arrow_back
                            </Icon>
                            {formatMessage({ id: 'Retour', defaultMessage: 'Retour' })}
                        </Button>
                    </motion.div>
                    <div className="flex items-center gap-4 my-4 md:my-8">
                        <Icon className="text-24 md:text-32">table_rows</Icon>
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 font-semibold"
                        >
                            {formatMessage({
                                id: 'Mes équipements',
                                defaultMessage: 'Mes équipements',
                            })}
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end px-12">
                    {!isEquipmentMeterListEmpty && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                        >
                            <ButtonLoader
                                className="whitespace-nowrap"
                                variant="contained"
                                color="secondary"
                                // TODO: Handle this iN MYEM-4630 story.
                                // inProgress={}
                                // onClick={}
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
                            </ButtonLoader>
                        </motion.div>
                    )}
                </div>
            </div>
        </ThemeProvider>
    )
}
