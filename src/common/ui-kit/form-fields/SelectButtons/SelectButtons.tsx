import React from 'react'
import Button from '@mui/material/Button'
import { useIntl } from 'src/common/react-platform-translation'
import { Icon } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { ISelectButtons } from './SelectButtonsTypes'

/**
 * Select Button is a component that allows to select one of the buttons.
 *
 * @param root0 SelectButtons props.
 * @param root0.formOptions Options for buttons in form.
 * @param root0.wrapperStyles Styles for wrapper.
 * @param root0.titleLabel Buttons title.
 * @param root0.name Section name.
 * @param root0.value Initial value.
 * @returns Select Buttons.
 */
export const SelectButtons = ({ formOptions, wrapperStyles, titleLabel, name, value }: ISelectButtons) => {
    const { formatMessage } = useIntl()
    const { control, setValue, getValues } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={value}
            render={() => (
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
                            (option: /**
                            Button options.
                             */
                            {
                                /**
                                 * Label  name.
                                 */
                                label: string
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
                                /**
                                 * Icon path if it is svg image.
                                 */
                                iconPath?: string
                                /**
                                 * Icon name if taken from fuse mui.
                                 */
                                iconLabel?: string
                            }) => {
                                return (
                                    <Button
                                        variant={(getValues(name) || value) === option.label ? 'contained' : 'outlined'}
                                        color="primary"
                                        className={option.buttonStyle}
                                        onClick={() => setValue(name, option.label)}
                                        type="button"
                                        name={name}
                                        disabled={option.isDisabled}
                                        value={option.label}
                                    >
                                        {(option.iconPath || option.iconLabel) && (
                                            <div>
                                                {option.iconLabel ? (
                                                    <Icon color="action" className={option.iconStyles}>
                                                        {option.iconLabel}
                                                    </Icon>
                                                ) : (
                                                    <img
                                                        className={option.iconStyles}
                                                        src={option.iconPath}
                                                        alt={option.iconPath}
                                                    />
                                                )}
                                            </div>
                                        )}
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
            )}
        />
    )
}
