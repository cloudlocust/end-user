import { useIntl } from 'react-intl'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { InstallationRequestDetailsPopupProps } from 'src/modules/InstallatinRequests/components/InstallationRequestDetailsPopup/installationRequestDetailsPopup.d'
import { ThemeProvider } from '@mui/material/styles'
import { AppBar, Dialog, Icon, IconButton, Toolbar, Typography } from '@mui/material'

/**
 * Installation request details popup component that shows the details of one installation request.
 *
 * @param props Props relevant to Installation request details popup.
 * @returns JSX for installation request details.
 */
export const InstallationRequestDetailsPopup = (props: InstallationRequestDetailsPopupProps) => {
    const { handleClosePopup, open } = props

    const theme = selectTheme()
    const { formatMessage } = useIntl()

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={open}
                classes={{
                    paper: 'm-24',
                }}
                fullWidth
                maxWidth="md"
                onClose={handleClosePopup}
            >
                <AppBar position="static" elevation={0}>
                    <Toolbar className="flex w-full justify-between">
                        <Typography variant="h5" color="inherit" className="flex items-center justify-center p-32">
                            {formatMessage({
                                id: "Détail d'une demande",
                                defaultMessage: "Détail d'une demande",
                            })}
                        </Typography>
                        <IconButton
                            color="inherit"
                            data-testid="InstallationsRequestsPopupCloseIcon"
                            onClick={() => handleClosePopup()}
                        >
                            <Icon>close</Icon>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Dialog Content here */}
            </Dialog>
        </ThemeProvider>
    )
}
