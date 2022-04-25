import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { useIntl } from 'src/common/react-platform-translation'
import clsx from 'clsx'

/**
 *Loading component.
 *
 * @returns Loading component.
 */
function FuseLoading() {
    const { formatMessage } = useIntl()

    return (
        <div className={clsx('flex flex-1 flex-col items-center justify-center p-24')}>
            <Typography className="text-13 sm:text-20 mb-16" color="textSecondary">
                {formatMessage({ id: 'Chargement...', defaultMessage: 'Chargement...' })}
            </Typography>
            <LinearProgress className="w-192 sm:w-320 max-w-full rounded-2" color="secondary" />
        </div>
    )
}

export default FuseLoading
