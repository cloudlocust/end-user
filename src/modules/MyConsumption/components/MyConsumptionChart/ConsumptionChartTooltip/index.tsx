import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import { styled, alpha } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { ConsumptionChartTooltipProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip/ConsumptionChartTooltip.types'
import { useMemo } from 'react'

const Container = styled('div')(() => ({
    background: '#F6F7F9',
    minWidth: 350,
    padding: '12px 16px',
    '& p': {
        color: '#7D8B94',
        fontSize: 14,
    },
    '& .title p': {
        fontSize: 18,
        paddingBottom: 4,
    },
    '& .consumption-summary': {
        display: 'flex',
        gap: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .total-cost': {
            color: '#FCC014',
            fontWeight: 'bold',
            fontSize: '22px',
        },
        '& .vertical-divider': {
            borderLeft: `1px solid ${alpha('#7D8B94', 0.3)}`,
            height: 20,
        },
        '& .total-consumption': {
            fontSize: '20px',
        },
    },
    '& .horizontal-divider': {
        borderTop: `1px dashed ${alpha('#7D8B94', 0.3)}`,
        marginTop: 6,
        marginBottom: 9,
    },
    '& .labels-container': {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        '& .label': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 64,
            '& .value': {
                fontWeight: 'bold',
            },
        },
    },
}))

/**
 * A component used to override the echart tooltip.
 *
 * @param param0 Props.
 * @param param0.params Params echart tooltip params.
 * @param param0.valueFormatter The formatter of the data value.
 * @param param0.getTotalConsumption Callback to return the total consumption of hovered element.
 * @param param0.getTotalEuroCost Callback to return the total cost of hovered element.
 * @param param0.onDisplayTooltipLabel Callback to determines whether to display the tooltip label.
 * @param param0.renderComponentOnMissingLabels Callback to render component when there are no labels.
 * @returns React Component.
 */
export const ConsumptionChartTooltip = ({
    params,
    getTotalConsumption,
    getTotalEuroCost,
    valueFormatter,
    onDisplayTooltipLabel = () => true,
    renderComponentOnMissingLabels = () => null,
}: ConsumptionChartTooltipProps) => {
    const labels = useMemo(() => {
        const items: JSX.Element[] = []
        // Remove the duplicated seriesName and sort by axisIndex.
        sortBy(uniqBy(params, 'seriesName'), 'axisIndex').forEach((item, index: number) => {
            if (onDisplayTooltipLabel(item)) {
                const value = valueFormatter ? valueFormatter(item.seriesIndex)(item.value) : item.value
                items.push(
                    <div className="label" key={index} role="listitem" data-testid={item.seriesName}>
                        <Typography>
                            <span dangerouslySetInnerHTML={{ __html: item.marker }} /> {item.seriesName}
                        </Typography>
                        <Typography className="value">{value}</Typography>
                    </div>,
                )
            }
        })
        return items
    }, [params, valueFormatter, onDisplayTooltipLabel])

    /**
     * Renders the totals cost & total consumption.
     *
     * @returns The rendered JSX element or null.
     */
    const renderTotals = () => {
        const index = params[0].dataIndex
        const totalEuroCost = getTotalEuroCost && getTotalEuroCost(index)
        const totalConsumption = getTotalConsumption && getTotalConsumption(index)
        if (totalEuroCost && totalConsumption) {
            return (
                <div className="consumption-summary">
                    <Typography className="total-cost">
                        {totalEuroCost.value} {totalEuroCost.unit}
                    </Typography>
                    <div className="vertical-divider" />
                    <Typography className="total-consumption">
                        {totalConsumption.value} {totalConsumption.unit}
                    </Typography>
                </div>
            )
        }
        return null
    }

    return (
        <Container>
            <div className="title">
                <Typography>{params[0].name}</Typography>
            </div>
            {labels.length ? (
                <>
                    {renderTotals()}
                    <div className="horizontal-divider" />
                    <div className="labels-container">{labels}</div>
                </>
            ) : (
                renderComponentOnMissingLabels(params)
            )}
        </Container>
    )
}
