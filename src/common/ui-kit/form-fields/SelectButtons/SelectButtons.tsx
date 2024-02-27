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
 * @param root0.initialValue Initial value.
 * @param root0.isDisabled Is disabled button.
 * @returns Select Buttons.
 */
export const SelectButtons = ({
    formOptions,
    wrapperStyles,
    titleLabel,
    name,
    initialValue,
    isDisabled,
}: ISelectButtons) => {
    const { formatMessage } = useIntl()
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={initialValue}
            render={({ field }) => (
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
                        {formOptions.map((option) => {
                            return (
                                <Button
                                    variant={(field.value || initialValue) === option.value ? 'contained' : 'outlined'}
                                    color="primary"
                                    className={option.buttonStyle}
                                    onClick={() => field.onChange(option.value)}
                                    type="button"
                                    name={name}
                                    disabled={isDisabled}
                                    value={option.value}
                                >
                                    {option.iconPath || option.iconLabel ? (
                                        <div>
                                            {option.iconLabel ? (
                                                <Icon color="inherit" className={option.iconStyles}>
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
                                    ) : (
                                        <>{option.icon}</>
                                    )}
                                    {formatMessage({
                                        id: option.label,
                                        defaultMessage: option.label,
                                    })}
                                </Button>
                            )
                        })}
                    </div>
                </>
            )}
        />
    )
}
