import { Typography, Chip } from '@mui/material'
import {
    IConnectedPlug,
    connectedPlugConsentStateEnum,
    connectedPlugLinkTypeEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import Icon from '@mui/material/Icon'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import dayjs from 'dayjs'

/**
 * ConnectedPlugsMobileRowContent Component display on Mobile View.
 *
 * @param props N/A.
 * @param props.row Row Element.
 * @returns ConnectedPlugsMobileRowContent component.
 */
const ConnectedPlugsMobileRowContent =
    // eslint-disable-next-line jsdoc/require-jsdoc
    ({ row }: { row: IConnectedPlug }) => {
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
                            electrical_services
                        </Icon>
                        <Typography>{row.deviceName}</Typography>
                    </Typography>
                    {row.linkType === connectedPlugLinkTypeEnum.production && (
                        <Chip color="warning" label={'production'} />
                    )}
                </div>
                <div>
                    {row.consentState === connectedPlugConsentStateEnum.APPROVED ? (
                        <div className="flex gap-2">
                            <TypographyFormatMessage className="text-sm">Connectée le</TypographyFormatMessage>
                            <Typography className="text-sm">
                                : {dayjs.utc(row.createdAt).local().format('DD/MM/YYYY')}
                            </Typography>
                        </div>
                    ) : (
                        <TypographyFormatMessage color="error" className="text-sm">
                            Non Connectée
                        </TypographyFormatMessage>
                    )}
                </div>
            </div>
        )
    }

export default ConnectedPlugsMobileRowContent
