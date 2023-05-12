import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple/PageSimple'
import { MyConsumptionContainer } from 'src/modules/MyConsumption/MyConsumptionContainer'

/**
 * MyConsumption page.
 *
 * @returns MyConsumptionContainer.
 */
export const MyConsumption = () => {
    return <PageSimple content={<MyConsumptionContainer />} />
}
