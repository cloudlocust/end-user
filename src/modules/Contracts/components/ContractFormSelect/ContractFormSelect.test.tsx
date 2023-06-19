import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { ContractFormSelectProps } from 'src/modules/Contracts/contractsTypes'
import { waitFor } from '@testing-library/react'
import ContractFormSelect from 'src/modules/Contracts/components/ContractFormSelect'
import { Form } from 'src/common/react-platform-components'

const NAME_SELECT_TEXT = 'myNameIsName'
const LABEL_SELECT_TEXT = 'label'
const DEFAULT_VALUE_SELECT_TEXT = 'defaultAndDisabledValue'
const LoadingIndicatorClass = '.MuiCircularProgress-root'
let mockManualContractFillingIsEnabled = true

/**
 * Mock FNs.
 */

const mockGetValueFn = jest.fn()
const mockSetValueFn = jest.fn()

/**
 * Mock for ContractForm props.
 */
const mockContractFormSelectProps: ContractFormSelectProps<string> = {
    name: NAME_SELECT_TEXT,
    // Mock ContractFormSelect formatOptionLabel.
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatOptionLabel(option) {
        return option
    },
    // Mock ContractFormSelect formatOptionLabel.
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatOptionValue(option) {
        return option
    },
    loadOptions: jest.fn(),
    optionList: ['opt1', 'opt2', 'opt3', 'opt4'],
    isOptionsInProgress: false,
    label: LABEL_SELECT_TEXT,
}

// eslint-disable-next-line jsdoc/require-jsdoc
type IContractFormMockedDisabledProps = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    id: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    name: string
}

const mockContractFormSelectPropsWithDefaultOption: ContractFormSelectProps<IContractFormMockedDisabledProps> = {
    name: NAME_SELECT_TEXT,
    // Mock ContractFormSelect formatOptionLabel.
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatOptionLabel(option) {
        return option.id
    },
    // Mock ContractFormSelect formatOptionLabel.
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatOptionValue(option) {
        return option.name
    },
    loadOptions: jest.fn(),
    optionList: [
        {
            id: 'optIdentifier',
            name: DEFAULT_VALUE_SELECT_TEXT,
        },
    ],
    isOptionsInProgress: false,
    label: LABEL_SELECT_TEXT,
}

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    /**
     * Mock the react-hook-form hooks.
     *
     * @returns The react-hook-form hook.
     */
    useFormContext: () => ({
        getValues: mockGetValueFn.mockReturnValue(undefined),
        setValue: mockSetValueFn,
    }),
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },
}))

describe('Test ContractFormSelect Component', () => {
    test('When component mount', async () => {
        const mockLoadOptions = jest.fn()
        mockContractFormSelectProps.loadOptions = mockLoadOptions
        const { getByText, getByLabelText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <ContractFormSelect {...mockContractFormSelectProps} />,
            </Form>,
        )

        // Initially only Type is shown
        expect(getByLabelText(LABEL_SELECT_TEXT)).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOptions).toHaveBeenCalled()
        })
        // Opening the selection menu.
        userEvent.click(getByLabelText(LABEL_SELECT_TEXT, { exact: false }))
        mockContractFormSelectProps.optionList?.forEach((option) => {
            expect(getByText(option)).toBeTruthy()
        })
    }, 10000)

    test('When isOptionsInProgress spinner should be shown', async () => {
        mockContractFormSelectProps.isOptionsInProgress = true
        const { container, getByLabelText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <ContractFormSelect {...mockContractFormSelectProps} />
            </Form>,
        )
        expect(container.querySelector(LoadingIndicatorClass)).toBeInTheDocument()
        expect(() => getByLabelText(LABEL_SELECT_TEXT)).toThrow()
    })

    test('When he has only one option should be used as default and field should be disabled', async () => {
        const mockLoadOptions = jest.fn()
        const mockChangeEvent = jest.fn()
        mockContractFormSelectPropsWithDefaultOption.loadOptions = mockLoadOptions
        mockContractFormSelectPropsWithDefaultOption.onChange = mockChangeEvent
        const { getByLabelText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <ContractFormSelect {...mockContractFormSelectPropsWithDefaultOption} />,
            </Form>,
        )

        expect(getByLabelText(LABEL_SELECT_TEXT)).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOptions).toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(mockGetValueFn).toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(mockSetValueFn).toHaveBeenCalledWith(
                mockContractFormSelectPropsWithDefaultOption.name,
                DEFAULT_VALUE_SELECT_TEXT,
            )
        })
    }, 10000)

    test('When manual contract filling is disabled, the field should be disabled', async () => {
        mockManualContractFillingIsEnabled = false
        mockContractFormSelectProps.isOptionsInProgress = false
        const { getByLabelText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <ContractFormSelect {...mockContractFormSelectProps} />,
            </Form>,
        )

        expect(getByLabelText(LABEL_SELECT_TEXT)).toBeTruthy()
        expect(getByLabelText(LABEL_SELECT_TEXT)).toHaveClass('Mui-disabled')
    })
})
