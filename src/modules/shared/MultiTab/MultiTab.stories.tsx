import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import MultiTab from './MultiTab'
import { MemoryRouter, Route } from 'react-router'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { IMultiTab } from 'src/common/ui-kit/components/MultiTab/multiTab.d'

export default {
    title: 'MultiTab',
    component: MultiTab,
    argTypes: {},
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    },
} as Meta
/**
 * Interface Multitab.
 */
interface ITemplate {
    //eslint-disable-next-line jsdoc/require-jsdoc
    header?: JSX.Element
    //eslint-disable-next-line jsdoc/require-jsdoc
    content: Array<IMultiTab>
    //eslint-disable-next-line jsdoc/require-jsdoc
    innerScroll?: boolean
}
/**
 * MultiTab template.
 *
 * @param args Multitab props.
 * @returns MultiTab.
 */
const Template: Story<ITemplate> = (args: ITemplate) => (
    <MemoryRouter initialEntries={['/profil/accomodation']}>
        <Route component={(routerProps: any) => <MultiTab {...routerProps} {...args} />} path="/profil/:tab" />
    </MemoryRouter>
)
/**
 * Mobile template.
 */
export const Mobile = Template.bind({})
Mobile.args = {
    content: [
        {
            tabTitle: 'Logement',
            tabSlug: 'accomodation',
            tabContent: <div className="Tab-Accomodation">Accomodation</div>,
        },
        {
            tabTitle: 'Equipement',
            tabSlug: 'equipment',
            tabContent: <div className="Tab-Equipment">Equipement</div>,
        },
    ],
}
Mobile.parameters = {
    viewport: {
        defaultViewport: 'iphonex',
    },
}
