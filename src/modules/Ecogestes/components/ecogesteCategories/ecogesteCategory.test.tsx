import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EcogesteCategoriesList } from './EcogesteCategoriesList'
import { IEcogesteCategoryTypes } from '../../EcogestesConfig'
import { IEcogestCategory } from '../ecogeste'

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
        test('When loading fail, should show an error message', async () => {
            const { getByText, queryAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCategoriesList categoryType={IEcogesteCategoryTypes.CONSUMPTION} categories={[]} />
                </BrowserRouter>,
            )
            expect(queryAllByLabelText('ecogest-category-card')).toHaveLength(0)
            expect(getByText("Aucune categorie d'écogeste n'est disponible pour le moment")).toBeDefined()
        })

        test('When loading correctly, should show categories of a type', async () => {
            const { getAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCategoriesList
                        categoryType={IEcogesteCategoryTypes.CONSUMPTION}
                        categories={TEST_ECOGESTES_CATEGORIES}
                    />
                </BrowserRouter>,
            )
            expect(getAllByLabelText('ecogestCategoryCard')).toHaveLength(2)
        })
    })
})
