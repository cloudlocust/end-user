import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { INumberFieldForm, NumberFieldForm } from './NumberFieldForm'

export default {
    title: 'NumberField',
    component: NumberFieldForm,
    argTypes: {},
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    },
} as Meta

/**
 * NumberFieldForm template.
 *
 * @param args NumberFieldForm props.
 * @returns NumberFieldForm.
 */
const Template: Story<INumberFieldForm> = (args: INumberFieldForm) => <NumberFieldForm {...args} />
/**
 * NumberFieldFormExample template.
 */
export const NumberFieldFormExample = Template.bind({})
NumberFieldFormExample.args = {
    labelTitle: 'PC de bureau',
    iconLabel: 'computer',
    disableDecrement: true,
    wrapperClasses: 'flex w-2/6',
}
