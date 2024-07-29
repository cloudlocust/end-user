import { UiTextFieldProps } from 'src/common/ui-kit'

/**
 * Contract other field props.
 */
export interface ContractOtherFieldProps<T, R> extends UiTextFieldProps {
    /**
     * Field name.
     */
    name: string
    /**
     * Field label.
     */
    label: string
    /**
     * Button label.
     */
    buttonLabel: string
    /**
     * Button action.
     *
     * @param data It an object with a name and networkIdentifier property.
     */
    onButtonClick: (data: T) => Promise<R>
    /**
     * Button loading state.
     */
    isButtonLoading: boolean
    /**
     * Boolean state to check if the field is submitted.
     */
    isOtherFieldSubmitted: boolean
    /**
     * Rest of params for ButtonClick data.
     */
    onButtonClickParams?: /**
     *
     */
    { [key: string]: any }
    /**
     * Disabled.
     */
    disabled?: boolean
}
