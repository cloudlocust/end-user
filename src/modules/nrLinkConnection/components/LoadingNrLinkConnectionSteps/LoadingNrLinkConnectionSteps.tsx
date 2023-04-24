import { CircularProgress } from '@mui/material'
import { useIntl } from 'react-intl'
import Typography from '@mui/material/Typography'

/**
 *  Loading Spinner NrLinkConnection Component.
 *
 * @returns LoadingNrLinkConnectionSteps.
 */
const LoadingNrLinkConnectionSteps = () => {
    const { formatMessage } = useIntl()

    return (
        <>
            <div className="flex justify-center items-center h-full">
                <div
                    style={{
                        maxWidth: '320px',
                    }}
                >
                    <div
                        style={{
                            margin: '0 auto',
                            marginBottom: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress
                            className="w-[80px] h-[80px]"
                            style={{
                                height: '80px',
                                width: '80px',
                            }}
                        />
                    </div>
                    <Typography variant="body1" className="w-full text-center text-14">
                        {formatMessage({
                            id: 'Merci de patienter quelques instants afin que l’appairage de votre appareil termine de se synchroniser. Ceci ne devrait pas dépasser 1 minute.',
                            defaultMessage:
                                'Merci de patienter quelques instants afin que l’appairage de votre appareil termine de se synchroniser. Ceci ne devrait pas dépasser 1 minute.',
                        })}
                    </Typography>
                </div>
            </div>
        </>
    )
}

export default LoadingNrLinkConnectionSteps
