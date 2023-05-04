import { useHistory } from 'react-router-dom'
import { Icon } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcogestHeaderProps } from '../ecogeste'
import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'

/**
 * EcogestList Header Component.
 *
 * @param root0 Props (extend default component Props).
 * @param root0.isLoading Loading State of @useEcogestPoles Hooks.
 * @param root0.currentCategory Current Ecogest Category.
 * @returns HeaderComponent.
 */
const EcogestesListPageHeader = ({ isLoading, currentCategory }: IEcogestHeaderProps): JSX.Element => {
    const theme = useTheme()
    const history = useHistory()

    return (
        <div className="w-full h-full p-10 flex flex-nowrap flex-col gap-1 justify-around">
            {!isLoading && currentCategory && currentCategory.name && currentCategory.icon ? (
                <>
                    <IconButton
                        aria-label="Previous"
                        onClick={() => history.goBack()}
                        size="large"
                        style={{ color: theme.palette.secondary.light, position: 'absolute' }}
                    >
                        <Icon>chevron_left </Icon>
                    </IconButton>
                    <Icon
                        sx={{ color: theme.palette.secondary.light }}
                        aria-hidden="true"
                        color="inherit"
                        style={{ height: '75%', alignSelf: 'center', width: '100%', margin: 'auto' }}
                    >
                        <img
                            style={{
                                filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light})`,
                                height: '100%',
                                margin: 'auto',
                            }}
                            src={currentCategory!.icon}
                            alt={currentCategory.name}
                        ></img>
                    </Icon>

                    <TypographyFormatMessage className="text-center text-20 font-semibold">
                        {currentCategory!.name}
                    </TypographyFormatMessage>
                </>
            ) : (
                <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                        <CircularProgress size={32} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default EcogestesListPageHeader
