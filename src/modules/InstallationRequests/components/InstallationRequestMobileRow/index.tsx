import { Typography, Chip } from '@mui/material'
import { equipmentsTypeList, statusList } from 'src/modules/InstallationRequests'
import { IInstallationRequest } from 'src/modules/InstallationRequests/installationRequests'
import dayjs from 'dayjs'
import { VariantType } from 'notistack'

/**
 * InstallationRequestMobileRowContent Component display on Mobile View.
 *
 * @param props N/A.
 * @param props.row Row Element.
 * @returns InstallationRequestMobileRowContent component.
 */
export const InstallationRequestMobileRowContent =
    // eslint-disable-next-line jsdoc/require-jsdoc
    ({ row }: { row: IInstallationRequest }) => {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex justify-between">
                    <Typography className="font-medium text-sm">
                        {equipmentsTypeList[row.equipmentType as keyof typeof equipmentsTypeList].label}
                    </Typography>
                    <Typography className="text-sm">
                        <Chip
                            color={statusList[row.status as keyof typeof statusList].color as VariantType}
                            label={statusList[row.status as keyof typeof statusList].label}
                        />
                    </Typography>
                </div>
                <div className="flex justify-between">
                    <Typography className="text-sm">
                        {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(row.budget)}
                    </Typography>
                    <Typography className="text-sm">{dayjs.utc(row.createdAt).local().format('DD/MM/YYYY')}</Typography>{' '}
                </div>
            </div>
        )
    }
