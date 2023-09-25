import { Card, CardContent, useTheme, Typography, Icon } from '@mui/material'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { ReactSVG } from 'react-svg'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * Equipment Card component.
 *
 * @param root0 N/A.
 * @param root0.number How many equipments are there of that type.
 * @param root0.label Equipment label.
 * @param root0.name Equipment backend name.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({ number, label, name }: EquipmentCardProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const svgUrl = require(`src/assets/images/content/housing/equipments/${name}.svg`).default

    return (
        <Card className="rounded-16 border border-slate-600 w-full" data-testid="equipment-item">
            <CardContent className="flex flex-row space-x-14">
                <div
                    className="flex justify-center items-center rounded-16 border-2"
                    style={{ borderColor: theme.palette.primary.main, width: '75px', height: '75px' }}
                >
                    <ReactSVG
                        src={svgUrl}
                        beforeInjection={(svg) => {
                            const paths = svg.querySelectorAll('path')
                            paths.forEach((p) => {
                                p.style.fill = theme.palette.primary.main
                            })
                            svg.setAttribute('width', '35')
                            svg.setAttribute('height', '35')
                        }}
                        className="flex justify-center w-full"
                    />
                </div>
                <div className="flex flex-row w-full justify-between">
                    <Typography className="text-16 md:text-17 font-medium">
                        {formatMessage({
                            id: label,
                            defaultMessage: label,
                        })}
                    </Typography>
                    {/* TODO: add deboucing component here */}
                    <div className="flex flex-row justify-center items-start">
                        <div className="flex flex-row items-center space-x-8">
                            <Icon color="disabled" className="cursor-pointer">
                                add_circle_outlined
                            </Icon>
                            <div className="text-14 font-medium">{number}</div>
                            <Icon color="disabled" className="cursor-pointer">
                                remove_circle_outlined
                            </Icon>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
