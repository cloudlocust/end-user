import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { INumberField, NumberField } from './NumberField'

export default {
    title: 'NumberField',
    component: NumberField,
    argTypes: {},
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    },
} as Meta

/**
 * NumberField template.
 *
 * @param args NumberField props.
 * @returns NumberField.
 */
const Template: Story<INumberField> = (args: INumberField) => <NumberField {...args} />
/**
 * NumberFieldExample template.
 */
export const NumberFieldExample = Template.bind({})
NumberFieldExample.args = {
    title: 'PC de bureau',
    iconLabel: 'computer',
    disableDecrement: true,
    wrapperClasses: 'flex w-2/6',
}
