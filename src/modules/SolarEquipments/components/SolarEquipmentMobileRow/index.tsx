import { Typography } from '@mui/material'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments.d'
import { equipmentsTypeList } from 'src/modules/InstallationRequests'
import Icon from '@mui/material/Icon'
import dayjs from 'dayjs'

/**
 * SolarEquipmentMobileRowContent Component display on Mobile View.
 *
 * @param props N/A.
 * @param props.row Row Element.
 * @returns SolarEquipmentMobileRowContent component.
 */
export const SolarEquipmentMobileRowContent =
    // eslint-disable-next-line jsdoc/require-jsdoc
    ({ row }: { row: ISolarEquipment }) => {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex justify-between">
                    <Typography className="font-medium text-sm flex items-center">
                        <Icon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginRight: '5px',
                                color: 'text.primary',
                            }}
                        >
                            {equipmentsTypeList[row.type as keyof typeof equipmentsTypeList].icon}
                        </Icon>
                        {equipmentsTypeList[row.type as keyof typeof equipmentsTypeList].label}
                    </Typography>
                    <Typography className="text-sm">{row.reference}</Typography>
                </div>
                <div className="flex justify-between">
                    <Typography className="text-sm">{row.brand}</Typography>
                    <Typography className="text-sm">
                        {dayjs.utc(row.installedAt).local().format('DD/MM/YYYY')}
                    </Typography>
                </div>
            </div>
        )
    }
