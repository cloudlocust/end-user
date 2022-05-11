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
 * MultiTab template.
 *
 * @param args Multitab props.
 * @returns MultiTab.
 */
const Template: Story<INumberField> = (args: INumberField) => <NumberField {...args} />
/**
 * Mobile template.
 */
export const Mobile = Template.bind({})
Mobile.args = { title: 'PC de bureau', iconLabel: 'computer', disableDecrement: true }

Mobile.parameters = {
    viewport: {
        defaultViewport: 'iphonex',
    },
}
