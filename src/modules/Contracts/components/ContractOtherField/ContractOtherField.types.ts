import { UiTextFieldProps } from 'src/common/ui-kit'

/**
 * Contract other field props.
 */
export interface ContractOtherFieldProps<T> extends UiTextFieldProps {
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
    buttonAction: (data: T) => Promise<void>
    /**
     * Button loading state.
     */
    buttonLoading: boolean
}
