import { Button, Icon, styled } from '@mui/material'
import React from 'react'

const Root = styled('div')(({ theme }) => ({
    '& .icon-background': {
        backgroundColor: theme.palette.primary.main,
        '& .icon': {
            color: theme.palette.background.paper,
        },
    },
    '& .border-wrapper': {
        borderBottom: `1px solid ${theme.palette.primary.main}`,
    },
    '& .title': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
    },
    '& .buttons': {
        '& button': {
            borderRadius: '8px',
            minWidth: '27px',
            padding: '5px',
        },
    },
}))

/**
 * NumberField
 *  interface.
 */
export interface INumberField {
    /**
     * Value to counting.
     */
    value?: number
    /**
     * Label title.
     */
    labelTitle: string
    /**
     * Icon name if taken from fuse mui.
     */
    iconLabel?: string
    /**
     * Icon path if it is svg image.
     */
    iconPath?: string
    /**
     * Is decrement disabled when value === 0.
     */
    disableDecrement?: boolean
    /**
     * Wraper className.
     */
    wrapperClasses?: string
    /**
     *
     */
    onChange?: (value: number) => void
}
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

    return (
        <Root className={wrapperClasses}>
            {(iconPath || iconLabel) && (
                <div className="icon-background flex items-center px-4 border-wrapper">
                    {iconLabel ? (
                        <Icon color="action" className="icon ">
                            {iconLabel}
                        </Icon>
                    ) : (
                        <img src={iconPath} alt="icon" className="w-28" />
                    )}
                </div>
            )}
            <div className="flex flex-col items-center w-full border-wrapper">
                <div className="title">{labelTitle}</div>
                <div className="flex buttons w-full justify-between items-center px-4 mb-4">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            !disabledField && onChange && onChange(value - 1)
                        }}
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
        </Root>
    )
}
