import React from 'react'
import { CircularProgress } from '@mui/material'
import { useIntl } from 'react-intl'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { IMeter } from 'src/modules/Meters/Meters'

/**
 *  Loading Spinner NrLinkConnection Component.
 *
 * @param meter The selectedMeter.
 * @returns LoadingNrLinkConnectionSteps.
 */
const LoadingNrLinkConnectionSteps = (meter: IMeter | null) => {
    const { formatMessage } = useIntl()

    return (
        <>
            <div className="flex justify-center items-center h-full">
                <Box
                    sx={{
                        maxWidth: '320px',
                    }}
                >
                    <Box
                        sx={{
                            margin: '0 auto',
                            marginBottom: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress
                            style={{
                                height: '80px',
                                width: '80px',
                            }}
                        />
                    </Box>
                    <Typography variant="body1" className="w-full text-center text-14">
                        {formatMessage({
                            id: 'Merci de patienter quelques instants afin que l’appairage de votre appareil termine de se synchroniser. Ceci ne devrait pas dépasser 1 minute.',
                            defaultMessage:
                                'Merci de patienter quelques instants afin que l’appairage de votre appareil termine de se synchroniser. Ceci ne devrait pas dépasser 1 minute.',
                        })}
                    </Typography>
                </Box>
            </div>
        </>
    )
}

export default LoadingNrLinkConnectionSteps
