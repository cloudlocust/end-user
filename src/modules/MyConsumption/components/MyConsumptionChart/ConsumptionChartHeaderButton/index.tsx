import { FC } from 'react'
import { alpha } from '@mui/material/styles'
import { Button } from '@mui/material'
import { ConsumptionChartHeaderButtonProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartHeaderButton/ConsumptionChartHeaderButton.types'

/**
 * Button component to use in the header of the consumption chart.
 *
 * @param root0 N/A.
 * @param root0.icon Icon to display in the button.
 * @param root0.text Text to display in the button.
 * @param root0.buttonColor Button background color in hex format.
 * @param root0.textColor Button text color in hex format.
 * @param root0.hasBorder Whether the button has a border.
 * @param root0.borderColor Border color in hex format.
 * @param root0.clickHandler Function to call when the button is clicked.
 * @returns The ConsumptionChartHeaderButton component.
 */
export const ConsumptionChartHeaderButton: FC<ConsumptionChartHeaderButtonProps> = ({
    icon,
    text,
    buttonColor,
    textColor,
    hasBorder,
    borderColor,
    clickHandler,
    ...muiButtonProps
}) => {
    return (
        <Button
            variant="contained"
            sx={(theme) => ({
                padding: '2px 16px',
                borderRadius: '8px',
                backgroundColor: buttonColor ?? alpha(theme.palette.primary.main, 0.3),
                color: textColor ?? alpha(theme.palette.primary.main, 0.75),
                '&:hover': {
                    backgroundColor: buttonColor ? alpha(buttonColor, 0.8) : alpha(theme.palette.primary.main, 0.2),
                },
                fontFamily: 'Poppins',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                ...(hasBorder
                    ? {
                          border: '1px solid',
                          borderColor: borderColor ?? alpha(theme.palette.primary.main, 0.1),
                      }
                    : {}),
            })}
            onClick={clickHandler}
            disableElevation
            disableRipple
            {...muiButtonProps}
        >
            {icon && (
                <>
                    <span>{icon}</span>&nbsp;
                </>
            )}
            {text}
        </Button>
    )
}
