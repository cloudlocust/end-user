import React from 'react'
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
 * @param param0.disableDecrement Is decrement disabled when value === 0.
 * @param param0.wrapperClasses  Wraper className.
 * @returns NumberField
 * .
 */
export const NumberField = ({ ...props }: INumberField) => {
    const {
        value = 0,
        labelTitle,
        iconLabel,
        iconPath,
        disableDecrement,
        wrapperClasses = 'flex mr-8 mb-10',
        onChange,
    } = props
    const disabledField = disableDecrement && value <= 0
    const theme = useTheme()

    return (
        <div className={wrapperClasses}>
            {(iconPath || iconLabel) && (
                <div
                    className="flex items-center px-4"
                    style={{
                        backgroundColor: theme.palette.primary.main,
                        borderBottom: `1px solid ${theme.palette.primary.main}`,
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
                    ) : (
                        <img src={iconPath} alt="icon" className="w-28" />
                    )}
                </div>
            )}
            <div
                className="flex flex-col items-center w-full"
                style={{
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                }}
            >
                <div
                    className="title"
                    style={{
                        color: theme.palette.primary.main,
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
                        disabled={disabledField}
                    >
                        <Icon color={disabledField ? 'disabled' : 'primary'}>remove</Icon>
                    </Button>
                    {value}
                    <Button
                        variant="outlined"
                        onClick={() => {
                            onChange && onChange(value + 1)
                        }}
                    >
                        <Icon color="primary">add</Icon>
                    </Button>
                </div>
            </div>
        </div>
    )
}
