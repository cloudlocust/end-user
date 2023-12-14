import { useTheme, useMediaQuery } from '@mui/material'
import { Savings as SavingIcon } from '@mui/icons-material'
import { SavingPercentageProps } from 'src/modules/Dashboard/AdviceContainer/components/SavingPercentage/savingPercentage'

const maxPercentage = 30 // Maximum percentage represented by icon
const iconStep = 10 // Each icon represents 10%

/**
 *  Saving percentage component.
 *
 * @param props Saving percentage props.
 * @returns Saving percentage component.
 */
export const SavingPercentage = (props: SavingPercentageProps) => {
    const { percentageSaved } = props
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))

    // Extract the number from the percentageSaved string
    const number = parseInt(percentageSaved.replace('%', ''))

    // Calculate the number of icons to display
    const numberOfIcons = Math.ceil((number / maxPercentage) * (maxPercentage / iconStep))

    return (
        <div className="flex space-x-2">
            {Array.from({ length: numberOfIcons }, (_, index) => (
                <SavingIcon
                    data-testid="saving-icon"
                    key={index}
                    color="primary"
                    fontSize={smDown ? 'small' : 'medium'}
                />
            ))}
        </div>
    )
}
