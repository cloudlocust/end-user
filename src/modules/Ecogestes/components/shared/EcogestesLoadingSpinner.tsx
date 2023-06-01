import CircularProgress from '@mui/material/CircularProgress'

/**
 * Just a spinner to indicate that we're loading some datas.
 *
 * @returns JSX.Element - SpinningLoader.
 */
export const EcogestesLoadingSpinner = () => {
    return (
        <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        </div>
    )
}
