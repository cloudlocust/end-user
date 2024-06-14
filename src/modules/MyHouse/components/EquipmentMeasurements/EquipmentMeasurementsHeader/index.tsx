import { Button, ThemeProvider, Icon, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { useIntl } from 'react-intl'
import { equipmentsOptions } from 'src/modules/MyHouse/components/Equipments/EquipmentsVariables'
import { EquipmentMeasurementsHeaderProps } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementsHeader/EquipmentMeasurementsHeader.types'

/**
 * EquipmentDetailsHeader compoonent.
 *
 * @param root0 N/A.
 * @param root0.equipmentName The equipment name.
 * @returns EquipmentDetailsHeader JSX.
 */
export const EquipmentMeasurementsHeader = ({ equipmentName }: EquipmentMeasurementsHeaderProps) => {
    const theme = selectTheme()
    const history = useHistory()
    const { formatMessage } = useIntl()

    const { iconComponent: equipmentIcon, labelTitle: equipmentLabel } =
        equipmentsOptions.find((element) => element.name === equipmentName) || {}

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
                        {equipmentIcon && equipmentIcon(theme, false, theme.palette.common.white)}
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 font-semibold"
                        >
                            {formatMessage({
                                id: equipmentLabel || equipmentName,
                                defaultMessage: equipmentLabel || equipmentName,
                            })}
                        </Typography>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}
