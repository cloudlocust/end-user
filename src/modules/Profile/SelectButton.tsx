import React, { useReducer, useState } from 'react'
import Button from '@mui/material/Button'
import { useIntl } from 'src/common/react-platform-translation'
import { Icon } from '@mui/material'

/**
 * Interface for Select Button.
 */
interface ISelectButton {
    /**
     * Button state.
     */
    state: string
    /**
     * Set button state.
     */
    setState: (value: React.SetStateAction<string>) => void
    /**
     * Options for buttons in form.
     */
    formOptions: any
    /**
     * Wrapper styles.
     */
    wrapperStyles?: string
    /**
     * Buttons title.
     */
    titleLabel?: string
    /**
     *
     */
    name?: string
    onBlur?: (event: any) => void
}

/**
 * Desctiption.
 *
 * @param root0
 * @param root0.state Button state.
 * @param root0.setState Set button state.
 * @param root0.formOptions Options for buttons in form.
 * @param root0.wrapperStyles styles for wrapper
 * @param root0.titleLabel
 * @returns Select Buttons.
 */
export const SelectButton = ({
    state,
    setState,
    formOptions,
    wrapperStyles,
    titleLabel,
    name,
    onBlur,
}: ISelectButton) => {
    const { formatMessage } = useIntl()

    return (
        <>
            {titleLabel && (
                <div className="mt-16">
                    {formatMessage({
                        id: titleLabel,
                        defaultMessage: titleLabel,
                    })}
                </div>
            )}
            <div className={wrapperStyles}>
                {formOptions.map(
                    /**
                     * \.
                     *
                     * @param option .
                     * @param option.label
                     * @param option.icon
                     * @param option.iconStyles
                     * @param option.buttonStyle styles for buttons
                     * @returns .
                     */
                    (option: {
                        /**
                         *
                         */
                        label: string
                        /**
                         *
                         */
                        icon?: string
                        /**
                         *
                         */
                        iconStyles?: string
                        /**
                         *
                         */
                        buttonStyle?: string

                        /**
                         *
                         */
                        isDisabled: boolean
                    }) => {
                        const isIconUrl = option.icon?.includes('/assets')
                        return (
                            <Button
                                variant={state === option.label ? 'contained' : 'outlined'}
                                color="primary"
                                className={option.buttonStyle}
                                onClick={() => setState(option.label)}
                                // inProgress={isRegisterInProgress}
                                type="submit"
                                name={name}
                                disabled={option.isDisabled}
                                onBlur={(event) => {
                                    return onBlur && onBlur(event)
                                }}
                                value={option.label}
                            >
                                {option.icon &&
                                    (isIconUrl ? (
                                        <img className={option.iconStyles} src={option.icon} alt={option.icon} />
                                    ) : (
                                        <Icon className={option.iconStyles} color="inherit">
                                            {option.icon}
                                        </Icon>
                                    ))}
                                {formatMessage({
                                    id: option.label,
                                    defaultMessage: option.label,
                                })}
                            </Button>
                        )
                    },
                )}
            </div>
        </>
    )
}
