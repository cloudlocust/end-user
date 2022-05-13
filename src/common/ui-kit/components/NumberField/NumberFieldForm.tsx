import { Button, Icon, styled } from '@mui/material'
import React, { useReducer } from 'react'
import { useIntl } from 'react-intl'

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
 * Initial state function.
 *
 * @param value Initial number to start counting.
 * @returns Value with key count.
 */
const init = (value: number) => {
    return { count: value }
}
/**
 * Reducer for counting.
 *
 * @param state State stores counter changes.
 * @param state.count Count state.
 * @param action Action stores type of changes.
 * @param action.type Action type. Is a decrement or an increment.
 * @returns Changed state in reducer.
 */
const reducer = (
    state: /**
     State stores counter changes.
     */
    {
        /**
         * Count state.
         */ count: number
    },
    action: /**
    Action stores type of changes.
     */
    {
        /**
         * Action type. Is a decrement or an increment.
         */
        type: string
    },
) => {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 }
        case 'decrement':
            return { count: state.count - 1 }
        default:
            throw new Error()
    }
}

/**
 * NumberFieldForm interface.
 */
export interface INumberFieldForm {
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
 * @returns NumberFieldForm.
 */
export const NumberFieldForm = ({ ...props }) => {
    const { value = 0, labelTitle, iconLabel, iconPath, disableDecrement, wrapperClasses = 'flex mr-8 mb-10' } = props
    const [state, dispatch] = useReducer(reducer, value, init)
    const disabledField = disableDecrement && state.count <= 0
    console.log(state)
    const { formatMessage } = useIntl()

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
                <div className="title">
                    {labelTitle}
                    {/* {formatMessage({
                        id: labelTitle,
                        defaultMessage: labelTitle,
                    })} */}
                </div>
                <div className="flex buttons w-full justify-between items-center px-4 mb-4">
                    <Button
                        variant="outlined"
                        onBlur={() => props.onBlur(state.count)}
                        onClick={() => {
                            dispatch({ type: 'decrement' })
                        }}
                        disabled={disabledField}
                    >
                        <Icon color={disabledField ? 'disabled' : 'primary'}>remove</Icon>
                    </Button>
                    {state.count}
                    {/* {formatMessage({
                        id: 'value',
                        defaultMessage: ` ${state.count}`,
                    })} */}
                    <Button
                        variant="outlined"
                        onBlur={() => props.onBlur(state.count)}
                        onClick={() => {
                            dispatch({ type: 'increment' })
                        }}
                    >
                        <Icon color="primary">add</Icon>
                    </Button>
                </div>
            </div>
        </Root>
    )
}
