import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple/PageSimple'
import { EchartsMyConsumptionContainer } from 'src/modules/MyConsumption/components/EchartsConsumptionChart/EchartsMyConsumptionContainer'

/**
 * EchartsMyConsumption page.
 *
 * @returns EchartsMyConsumptionContainer.
 */
export const EchartsMyConsumption = () => {
    return <PageSimple content={<EchartsMyConsumptionContainer />} />
}
