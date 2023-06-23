import { Typography } from '@mui/material'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments.d'
import { equipmentsTypeList } from 'src/modules/InstallationRequests'

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
                    <Typography className="font-medium text-sm">
                        {equipmentsTypeList[row.type as keyof typeof equipmentsTypeList].label}
                    </Typography>
                    <Typography className="text-sm">{row.reference}</Typography>{' '}
                </div>
                <div className="flex justify-between">
                    <Typography className="text-sm">{row.brand}</Typography>
                    <Typography className="text-sm">{row.installedAt}</Typography>
                </div>
            </div>
        )
    }
