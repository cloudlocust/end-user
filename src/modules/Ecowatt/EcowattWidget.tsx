import { Card, Tooltip, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar as MuiToolbar } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { InfoOutlined, Circle, Close } from '@mui/icons-material/'
import 'dayjs/locale/fr'
import { useState } from 'react'
import { EcowattConsumptionLevelListType } from 'src/modules/Ecowatt/ecowatt'

const consumptionLevelList: EcowattConsumptionLevelListType = [
    {
        text: 'Consommation Normal',
        bulletColor: 'success',
    },
    {
        text: 'Système électrique tendu. Les écogestes sont les bienvenus.',
        bulletColor: 'warning',
    },
    {
        text: 'Système électrique très tendu. Coupure inévitable si nous ne baissons pas notre consommation.',
        bulletColor: 'error',
    },
]

/**
 * Ecowatt widget title.
 */
export const ECOWATT_TITLE = "Ecowatt : La météo de l'électricité"

/**
 * Component for Ecowatt Widget.
 *
 * @returns EcowattWidget JSX.
 */
export const EcowattWidget = () => {
    const [openTooltip, setOpenTooltip] = useState(false)

    return (
        <div className="w-full">
            <Card className="w-full rounded-20 shadow sm:m-4" variant="outlined">
                <div className="p-16 flex flex-row justify-center h-full">
                    <TypographyFormatMessage className="text-16 font-medium md:text-17 flex items-center">
                        {ECOWATT_TITLE}
                    </TypographyFormatMessage>
                    <Tooltip
                        open={openTooltip}
                        disableHoverListener
                        title={
                            <div className="p-6">
                                <div className="flex-grow mb-64">
                                    <AppBar elevation={0} color="secondary">
                                        <MuiToolbar className="flex justify-between">
                                            <TypographyFormatMessage>{ECOWATT_TITLE}</TypographyFormatMessage>
                                            <Close className="cursor-pointer" onClick={() => setOpenTooltip(false)} />
                                        </MuiToolbar>
                                    </AppBar>
                                </div>
                                <TypographyFormatMessage>
                                    Mis en place par RTE (entreprise public qui gère le réseau de transport
                                    d'électricité), EcoWatt indique le niveau de consommation électrique en France
                                </TypographyFormatMessage>
                                <List>
                                    {consumptionLevelList.map((element) => (
                                        <ListItem className="p-0">
                                            <ListItemIcon>
                                                <Circle fontSize="small" className="p-0" color={element.bulletColor} />
                                            </ListItemIcon>
                                            <ListItemText primary={element.text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        }
                        placement="top-start"
                        arrow
                    >
                        <InfoOutlined
                            sx={(theme) => ({
                                color: theme.palette.primary.main,
                                marginLeft: 'auto',
                                cursor: 'pointer',
                            })}
                            fontSize="large"
                            onClick={() => setOpenTooltip(true)}
                        />
                    </Tooltip>
                </div>
                <div className="py-16 px-8 w-full flex justify-between items-center">{/* TODO: MYEM-3492 */}</div>
            </Card>
        </div>
    )
}
