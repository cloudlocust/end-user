import { Meta, Story } from '@storybook/react/types-6-0'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { SelectButtons } from './SelectButtons'
import { ISelectButtons } from './SelectButtonsTypes'
import { Form } from 'src/common/react-platform-components'

export default {
    title: 'SelectButtons',
    component: SelectButtons,
    argTypes: {},
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    },
} as Meta

/**
 * SelectButtons template.
 *
 * @param args SelectButtons props.
 * @returns SelectButtons.
 */
const Template: Story<ISelectButtons> = (args: ISelectButtons) => (
    <Form onSubmit={() => {}}>
        <SelectButtons {...args} />
    </Form>
)
/**
 * Select Buttons With Initial Value .
 */
export const SelectButtonsWithInitialValue = Template.bind({})
SelectButtonsWithInitialValue.args = {
    titleLabel: 'Type de plaques de cuisson:',
    name: 'hotplates',
    initialValue: 'electricity',
    isDisabled: false,
    formOptions: [
        {
            label: 'electricity',
            value: 'electricity',
            buttonStyle: 'mt-16 flex flex-col mr-10',
        },
        {
            label: 'induction',
            value: 'induction',
            buttonStyle: 'mt-16 flex flex-col mr-10',
        },
        {
            label: 'other',
            value: 'other',
            buttonStyle: 'mt-16 flex flex-col',
        },
    ],
}
/**
 * Select Buttons Without Initial Value .
 */
export const SelectButtonsWithoutInitialValue = Template.bind({})
SelectButtonsWithoutInitialValue.args = {
    titleLabel: 'Type de plaques de cuisson:',
    name: 'hotplates',
    isDisabled: false,
    formOptions: [
        {
            label: 'electricity',
            value: 'electricity',
            buttonStyle: 'mt-16 flex flex-col mr-8',
        },
        {
            label: 'induction',
            value: 'induction',
            buttonStyle: 'mt-16 flex flex-col mr-8',
        },
        {
            label: 'other',
            value: 'other',
            buttonStyle: 'mt-16 flex flex-col',
        },
    ],
}
