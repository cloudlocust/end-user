import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { fireEvent, act, waitFor } from '@testing-library/react'
import MultiTab from './MultiTab'

/*
 * We will test This component if he render and switch content correctly.
 */

// Text variables.
const TITLE_TAB_1 = 'Title one'
const TITLE_TAB_2 = 'Title two'
const TITLE_TAB_3 = 'Title three'
const CLASS_TAB_1 = '.Tab-1'
const CLASS_TAB_2 = '.Tab-2'
const CLASS_TAB_3 = '.Tab-3'
let mockPathname = 'tabs/slug-tab1'
/**
 * Mocking the useLocation used based on url /customers/:customerId/;tab {id, tab} params.
 */
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    /**
     * Mock the react-router useLocation hooks.
     *
     * @returns The react-router useLocation hook.
     */
    useLocation: () => ({
        pathname: mockPathname,
    }),
}))

/**
 * Mocking Header.
 *
 * @returns H1 tag.
 */
const Header = () => {
    return <h1>This is my header</h1>
}

/**
 * Mocking Tab1 component.
 *
 * @returns H1 tag.
 */
const Tab1 = () => {
    return (
        <div className={CLASS_TAB_1}>
            <h1>This is content of tab number one</h1>
        </div>
    )
}

/**
 * Mocking Tab2 component.
 *
 * @returns H1 tag.
 */
const Tab2 = () => {
    return (
        <div className={CLASS_TAB_2}>
            <h1>This is content of tab number two</h1>
        </div>
    )
}

/**
 * Mocking Tab3 component.
 *
 * @returns H1 tag.
 */
const Tab3 = () => {
    return (
        <div className={CLASS_TAB_3}>
            <h1>This is content of tab number three</h1>
        </div>
    )
}

const content = [
    {
        tabTitle: TITLE_TAB_1,
        tabSlug: 'slug-tab1',
        tabContent: <Tab1 />,
    },
    {
        tabTitle: TITLE_TAB_2,
        tabSlug: 'slug-tab2',
        tabContent: <Tab2 />,
    },
    {
        tabTitle: TITLE_TAB_3,
        tabSlug: 'slug-tab3',
        tabContent: <Tab3 />,
    },
]
const propsMultiTab = {
    header: <Header />,
    content,
}

describe('IMultiTab Test', () => {
    describe('load IMultiTab', () => {
        test('on success loading the element, IMultiTab should be loaded, tabs titles shown, first tab opened', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <MultiTab {...propsMultiTab} />
                </Router>,
            )

            // Header showing.
            expect(getByText('This is my header')).toBeTruthy()
            // Tabs titles showing.
            expect(getByText(TITLE_TAB_1)).toBeTruthy()
            expect(getByText(TITLE_TAB_2)).toBeTruthy()
            expect(getByText(TITLE_TAB_3)).toBeTruthy()
            // First Tab open (specified in props or number 1 by default) and other hidden.
            expect(getByText('This is content of tab number one')).toBeTruthy()
        })
    })
    describe('Tabs test', () => {
        test('When clicking on tab one title, the tab should change content tab 1 and other 2 other tabs hidden', async () => {
            const { container, getByText } = reduxedRender(
                <Router>
                    <MultiTab {...propsMultiTab} />
                </Router>,
            )
            // Click on Tab 1.
            act(() => {
                fireEvent.click(getByText(TITLE_TAB_1))
            })
            await waitFor(() => {
                // TEST that tab 1 Tab is not hidden.
                expect(getByText('This is content of tab number one')).toBeTruthy()
            })
            // TEST that tab 2 and 3 are hidden.
            expect(container.querySelector(CLASS_TAB_2)).toBeNull()
            expect(container.querySelector(CLASS_TAB_3)).toBeNull()
        })
        test('When clicking on tab two title, the tab should change content tab 2 and other 2 other tabs hidden', async () => {
            const { container, getByText } = reduxedRender(
                <Router>
                    <MultiTab {...propsMultiTab} />
                </Router>,
            )
            // Click on Tab 2.
            act(() => {
                fireEvent.click(getByText(TITLE_TAB_2))
            })
            await waitFor(() => {
                // TEST that Tab 2 is not hidden.
                expect(getByText('This is content of tab number two')).toBeTruthy()
            })
            // TEST that tab 2 and 3 are hidden.
            expect(container.querySelector(CLASS_TAB_1)).toBeNull()
            expect(container.querySelector(CLASS_TAB_3)).toBeNull()
        })
        test('When clicking on tab three title, the tab should change content tab 3 and other 2 other tabs hidden', async () => {
            const { container, getByText } = reduxedRender(
                <Router>
                    <MultiTab {...propsMultiTab} />
                </Router>,
            )
            // Click on Tab 3.
            act(() => {
                fireEvent.click(getByText(TITLE_TAB_3))
            })
            await waitFor(() => {
                // TEST that Tab 3 is not hidden.
                expect(getByText('This is content of tab number three')).toBeTruthy()
            })
            // TEST that tab 2 and 3 are hidden.
            expect(container.querySelector(CLASS_TAB_2)).toBeNull()
            expect(container.querySelector(CLASS_TAB_1)).toBeNull()
        })
    })
    describe('after 1st loading show 1st tab', () => {
        test('change ":tab" on 1st existing tab', async () => {
            mockPathname = 'tabs/:tab'
            const { getByText } = reduxedRender(
                <Router>
                    <MultiTab {...propsMultiTab} />
                </Router>,
            )
            expect(getByText(TITLE_TAB_1)).toBeTruthy()
        })
    })
})
