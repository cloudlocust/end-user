import { Tooltip, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar as MuiToolbar } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcowattConsumptionLevelListType } from 'src/modules/Ecowatt/ecowatt'
import { InfoOutlined, Circle, Close } from '@mui/icons-material/'
import { ECOWATT_TITLE } from 'src/modules/Ecowatt/EcowattWidget'

const consumptionLevelList: EcowattConsumptionLevelListType = [
    {
        text: 'Consommation normale',
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
 * EcoowattTooltip component.
 *
 * @param param0 N/A.
 * @param param0.onOpen Open state of tooltip.
 * @param param0.onClose Callback function that close tooltip.
 * @param param0.openState Open state of tooltip.
 * @returns EcoowattTooltipJSX.
 */
export const EcowattTooltip = ({
    onOpen,
    onClose,
    openState,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    openState: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    onOpen: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClose: () => void
}) => {
    return (
        <Tooltip
            open={openState}
            disableHoverListener
            title={
                <div className="p-6">
                    <div className="flex-grow mb-64">
                        <AppBar elevation={0} color="secondary">
                            <MuiToolbar className="flex justify-between">
                                <TypographyFormatMessage>{ECOWATT_TITLE}</TypographyFormatMessage>
                                <Close className="cursor-pointer" onClick={() => onClose()} />
                            </MuiToolbar>
                        </AppBar>
                    </div>
                    <TypographyFormatMessage>
                        Mis en place par RTE (entreprise publique qui gère le réseau de transport d'électricité),
                        EcoWatt indique le niveau de consommation électrique en France
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
                onClick={() => onOpen()}
            />
        </Tooltip>
    )
}
