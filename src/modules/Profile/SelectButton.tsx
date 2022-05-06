import React from 'react'
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
     * Section name.
     */
    name?: string
    /**
     * Saving data when the user leaves a form field.
     */
    onBlur: (event: any) => void
}

/**
 * Select Button is a component that allows to select one of the buttons.
 *
 * @param root0 SelectButton props.
 * @param root0.state Button state.
 * @param root0.setState Set button state.
 * @param root0.formOptions Options for buttons in form.
 * @param root0.wrapperStyles Styles for wrapper.
 * @param root0.titleLabel Buttons title.
 * @param root0.name Section name.
 * @param root0.onBlur Saving data when the user leaves a form field.
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
                     * Button options.
                     *
                     * @param option Button options.
                     * @param option.label Label  name.
                     * @param option.icon Icon url.
                     * @param option.iconStyles Styles for icon.
                     * @param option.buttonStyle Styles for button.
                     * @param option.isDisabled Is disabled button.
                     * @returns  Select Buttons.
                     */

                    (option: {
                        /**
                         * Label  name.
                         */
                        label: string
                        /**
                         * Icon url.
                         */
                        icon?: string
                        /**
                         * Styles for icon.
                         */
                        iconStyles?: string
                        /**
                         * Styles for button.
                         */
                        buttonStyle?: string

                        /**
                         *  Is disabled button.
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
                                type="button"
                                name={name}
                                disabled={option.isDisabled}
                                onBlur={onBlur}
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
