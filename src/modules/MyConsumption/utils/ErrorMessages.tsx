import { Link } from 'react-router-dom'
import { Typography, Icon } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useIntl } from 'react-intl'
import { useTheme } from '@mui/material'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

/**
 * MissingHousingMeterErrorMessage Component.
 *
 * @returns MissingHousingMeterErrorMessage.
 */
export const MissingHousingMeterErrorMessage = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { formatMessage } = useIntl()
    const theme = useTheme()

    return (
        <div className="container relative h-200 sm:h-256 p-16 sm:p-24 flex-col text-center flex items-center justify-center">
            <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: theme.palette.secondary.main }}>
                error_outline_outlined
            </Icon>
            <Typography>
                {formatMessage({
                    id: "Pour voir votre consommation vous devez d'abord ",
                    defaultMessage: "Pour voir votre consommation vous devez d'abord ",
                })}
                <Link
                    to={`/nrlink-connection-steps/${currentHousing?.id}`}
                    className="underline"
                    style={{
                        color: linksColor || theme.palette.primary.main,
                    }}
                >
                    {formatMessage({
                        id: 'enregistrer votre compteur et votre nrLINK',
                        defaultMessage: 'enregistrer votre compteur et votre nrLINK',
                    })}
                </Link>
            </Typography>
        </div>
    )
}
