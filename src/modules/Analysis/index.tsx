import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import AnalysisSummary from 'src/modules/Analysis/tabs/AnalysisSummary'
import AnalysisComparison from 'src/modules/Analysis/tabs/AnalysisComparison'
import { ReactComponent as AnalyzeSummaryIcon } from 'src/assets/images/summary.svg'
import { ReactComponent as AnalyzeComparisonIcon } from 'src/assets/images/comparison.svg'

const tabsContent = [
    {
        tabTitle: 'Bilan',
        tabSlug: 'summary',
        tabContent: <AnalysisSummary />,
        icon: <AnalyzeSummaryIcon />,
    },
    {
        tabTitle: 'Comparaison',
        tabSlug: 'comparison',
        tabContent: <AnalysisComparison />,
        icon: <AnalyzeComparisonIcon />,
    },
]

/**
 * Analysis component.
 *
 * @returns Analysis JSX.
 */
export default function Analysis() {
    return <MultiTab header={<>Header</>} content={tabsContent} innerScroll TabsProps={{ variant: 'fullWidth' }} />
}
