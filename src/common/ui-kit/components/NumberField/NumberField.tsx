import { Button, Icon, useTheme } from '@mui/material'
import 'src/common/ui-kit/components/NumberField/NumberFieldForm.scss'
import { INumberField } from './NumberFieldTypes'

/**
 * Number Field Form component.
 *
 * @param param0 N/A.
 * @param param0.value Value to counting.
 * @param param0.labelTitle  Label title.
 * @param param0.iconLabel Icon name if taken from fuse mui.
 * @param param0.iconPath Icon path if it is svg image.
 * @param param0.disabled Is field disabled.
 * @param param0.disableDecrement Is decrement disabled when value === 0.
 * @param param0.wrapperClasses  Wraper className.
 * @returns NumberField
 * .
 */
export const NumberField = ({ ...props }: INumberField) => {
    const {
        value = 0,
        labelTitle,
        disableDecrement,
        iconLabel,
        iconPath,
        disabled,
        wrapperClasses = 'flex mr-8 mb-10',
        onChange,
        iconComponent,
    } = props
    const theme = useTheme()
    const disabledField = disableDecrement && value <= 0

    if (!iconPath && !iconLabel && !iconComponent) {
        throw new Error(`iconPath or iconLabel or iconComponent prop must be provided`)
    }

    return (
        <div className={wrapperClasses}>
            <div
                className="flex items-center px-4 Mui-disabled"
                style={{
                    backgroundColor: disabled ? theme.palette.common.white : '',
                    borderBottom: `1px solid ${disabled ? theme.palette.common.white : theme.palette.primary.main}`,
                }}
            >
                {iconLabel ? (
                    <Icon
                        color="action"
                        sx={{
                            color: theme.palette.background.paper,
                        }}
                    >
                        {iconLabel}
                    </Icon>
                ) : iconComponent ? (
                    <>{iconComponent(theme, disabled)}</>
                ) : (
                    <img src={iconPath} alt="icon" className="w-28" />
                )}
            </div>

            <div
                className="flex flex-col items-center w-full"
                style={{
                    borderBottom: `1px solid ${disabled ? theme.palette.grey[300] : theme.palette.primary.main}`,
                }}
            >
                <div
                    className="title"
                    style={{
                        color: disabled ? theme.palette.grey[300] : theme.palette.primary.main,
                    }}
                >
                    {labelTitle}
                </div>
                <div className="flex buttons w-full justify-between items-center px-4 mb-4">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            onChange && onChange(value - 1)
                        }}
                        disabled={disabled || disabledField}
                    >
                        <Icon color={disabled || disabledField ? 'disabled' : 'primary'}>remove</Icon>
                    </Button>
                    <span style={disabled ? { color: theme.palette.grey[300] } : {}}>{value}</span>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            onChange && onChange(value + 1)
                        }}
                        disabled={disabled}
                    >
                        <Icon color={disabled ? 'disabled' : 'primary'}>add</Icon>
                    </Button>
                </div>
            </div>
        </div>
    )
}
