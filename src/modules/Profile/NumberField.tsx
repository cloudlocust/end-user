import { Button, Icon, styled } from '@mui/material'
import React, { useReducer } from 'react'

const Root = styled('div')(({ theme }) => ({
    '& .icon-background': {
        backgroundColor: theme.palette.primary.main,
        '& .icon': {
            color: 'white',
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
const init = (initialCount: number) => {
    return { count: initialCount }
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 }
        case 'decrement':
            return { count: state.count - 1 }
        default:
            throw new Error()
    }
}

export const NumberField = ({ initialCount, title, iconLabel }: any) => {
    const [state, dispatch] = useReducer(reducer, initialCount, init)
    const disabledDecrement = state.count <= 0
    console.log(state)
    return (
        <Root className="flex w-3/6 ">
            <div className="icon-background flex items-center px-4 border-wrapper">
                <Icon color="action" className="icon ">
                    {iconLabel}
                </Icon>
            </div>
            <div className="flex flex-col items-center w-full border-wrapper">
                <div className="title ">{title}</div>
                <div className="flex buttons w-full justify-between items-center px-4 mb-4">
                    <Button
                        variant="outlined"
                        onClick={() => dispatch({ type: 'decrement' })}
                        disabled={disabledDecrement}
                    >
                        <Icon color={disabledDecrement ? 'disabled' : 'primary'}>remove</Icon>
                    </Button>
                    {state.count}
                    <Button variant="outlined" onClick={() => dispatch({ type: 'increment' })}>
                        <Icon color="primary">add</Icon>
                    </Button>
                </div>
            </div>

            {/* <button onClick={() => dispatch({ type: 'reset', payload: initialCount })}>Réinitialiser</button> */}
        </Root>
    )
}
