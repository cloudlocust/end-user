import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import MultiTab, { IMultiTab } from './MultiTab'
import { MemoryRouter, Route } from 'react-router'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

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

const Template: Story<{
    //eslint-disable-next-line jsdoc/require-jsdoc
    header?: JSX.Element
    //eslint-disable-next-line jsdoc/require-jsdoc
    content: Array<IMultiTab>
    //eslint-disable-next-line jsdoc/require-jsdoc
    innerScroll?: boolean
}> = (args: {
    //eslint-disable-next-line jsdoc/require-jsdoc
    header?: JSX.Element
    //eslint-disable-next-line jsdoc/require-jsdoc
    content: Array<IMultiTab>
    //eslint-disable-next-line jsdoc/require-jsdoc
    innerScroll?: boolean
}) => (
    <MemoryRouter initialEntries={['/profil/accomodation']}>
        <Route component={(routerProps: any) => <MultiTab {...routerProps} {...args} />} path="/profil/:tab" />
    </MemoryRouter>
)
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
