import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import BoltIcon from '@mui/icons-material/Bolt'
import EuroIcon from '@mui/icons-material/Euro'
import { getDataUriOfIcon } from 'src/modules/utils'

/**
 * Component to switch between the eurosConsumption when its consumptionChart, and consumption when it's eurosConsumption Chart.
 *
 * @param props N/A.
 * @returns EurosConsumptionButtonToggler Component.
 */
export const EurosConsumptionButtonToggler = styled(Switch)(({ theme }) => ({
    width: 'auto',
    height: 'inherit',
    padding: 5,
    margin: 0,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(0px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(20px)',
            '& .MuiSwitch-thumb': {
                backgroundColor: theme.palette.primary.light,
            },
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('${getDataUriOfIcon(
                    <EuroIcon xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="white" />,
                )}')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.secondary.main,
        width: 24,
        height: 24,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('${getDataUriOfIcon(
                <BoltIcon xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="white" />,
            )}')`,
        },
    },
    '& .MuiSwitch-track': {
        height: 16,
        width: 38,
        opacity: 1,
        backgroundColor: '#aab4be',
        borderRadius: 20 / 2,
    },
    '& .MuiSwitch-track:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: 25,
        left: 7,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left',
        backgroundImage: `url('${getDataUriOfIcon(
            <BoltIcon xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="white" />,
        )}')`,
    },
    '& .MuiSwitch-track:after': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: 25,
        left: 26,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left',
        backgroundImage: `url('${getDataUriOfIcon(
            <EuroIcon xmlns="http://www.w3.org/2000/svg" height="14" width="14" fill="white" />,
        )}')`,
    },
}))

export default EurosConsumptionButtonToggler
