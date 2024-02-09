import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { EcogesteCategories } from 'src/modules/Ecogestes/components/ecogesteCategories'

const TXT_NO_ECOGESTS_AVAILABLE = "Aucune catégorie d'écogeste n'est disponible pour le moment"

const TEST_ECOGESTES_CATEGORIES: IEcogestCategory[] = [
    {
        id: 0,
        name: 'first',
        icon: 'firstIcon',
        nbEcogeste: 42,
    },
    {
        id: 1,
        name: 'second',
        icon: 'secondIcon',
        nbEcogeste: 7,
    },
]

describe('Test EcogesteCategory Components', () => {
    describe('should render component properly', () => {
        test('When loading, should show a Loading Spinner', async () => {
            const { queryByText, queryByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCategories
                        categoryType={IEcogesteCategoryTypes.CONSUMPTION}
                        loadingInProgress={true}
                        categories={[]}
                    />
                </BrowserRouter>,
            )
            expect(queryByRole('progressbar')).toBeInTheDocument()
            expect(queryByText(TXT_NO_ECOGESTS_AVAILABLE)).not.toBeTruthy()
        })
        test('When loading fail, should show an error message', async () => {
            const { getByText, queryAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCategories
                        categoryType={IEcogesteCategoryTypes.CONSUMPTION}
                        loadingInProgress={false}
                        categories={[]}
                    />
                </BrowserRouter>,
            )
            expect(queryAllByLabelText('ecogest-category-card')).toHaveLength(0)
            expect(getByText(TXT_NO_ECOGESTS_AVAILABLE)).toBeDefined()
        })

        test('When loading correctly, should show categories of a type', async () => {
            const { getAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCategories
                        categoryType={IEcogesteCategoryTypes.CONSUMPTION}
                        loadingInProgress={false}
                        categories={TEST_ECOGESTES_CATEGORIES}
                    />
                </BrowserRouter>,
            )
            expect(getAllByLabelText('ecogestCategoryCard')).toHaveLength(2)
        })
    })
})
