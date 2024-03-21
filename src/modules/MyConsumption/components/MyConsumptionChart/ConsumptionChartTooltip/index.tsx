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
 * @param param0.totalConsumption Total consumption.
 * @param param0.totalEuroCost Total cost.
 * @param param0.displayTooltipLabelCondition Callback to determines whether to display the tooltip label.
 * @returns React Component.
 */
export const ConsumptionChartTooltip = ({
    params,
    totalConsumption,
    totalEuroCost,
    valueFormatter,
    displayTooltipLabelCondition = () => true,
}: ConsumptionChartTooltipProps) => {
    const labels = useMemo(() => {
        const items: JSX.Element[] = []
        params.forEach((item, index: number) => {
            if (displayTooltipLabelCondition(item)) {
                const value = valueFormatter ? valueFormatter(item.seriesIndex)(item.value) : item.value
                items.push(
                    <div className="label" key={index}>
                        <Typography>
                            <span dangerouslySetInnerHTML={{ __html: item.marker }} /> {item.seriesName}
                        </Typography>
                        <Typography className="value">{value}</Typography>
                    </div>,
                )
            }
        })
        return items
    }, [params, valueFormatter, displayTooltipLabelCondition])

    if (!labels.length) return null

    return (
        <Container>
            <div className="title">
                <Typography>{params[0].name}</Typography>
            </div>
            {totalConsumption && totalEuroCost && (
                <div className="consumption-summary">
                    <Typography className="total-cost">
                        {totalEuroCost.value} {totalEuroCost.unit}
                    </Typography>
                    <div className="vertical-divider" />
                    <Typography className="total-consumption">
                        {totalConsumption.value} {totalConsumption.unit}
                    </Typography>
                </div>
            )}
            <div className="horizontal-divider" />
            <div className="labels-container">{labels}</div>
        </Container>
    )
}
