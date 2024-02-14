import { Button } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { Add as AddIcon } from '@mui/icons-material'
import { RefObject, useState } from 'react'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import ReactECharts from 'echarts-for-react'

/**
 * Button to add a label.
 *
 * @param props Props.
 * @param props.color Color of the button.
 * @param props.chartRef Ref of the chart.
 * @param props.inputPeriodTime Input Period Time.
 * @returns JSX Element.
 */
const AddLabelButtonForm = ({
    color,
    chartRef,
    inputPeriodTime,
}: /**
 */
{
    /**
     * Color of the button.
     */
    color: string
    /**
     * Ref of the chart.
     */
    chartRef: RefObject<ReactECharts>
    /**
     * Input Period Time.
     */
    inputPeriodTime: IPeriodTime
}) => {
    const [isSelectLabelActive, setIsSelectLabelActive] = useState(false)

    /**
     *  Handle the click on the button.
     */
    const handleBrushSelection = () => {
        if (!chartRef.current) return
        if (isSelectLabelActive) {
            setIsSelectLabelActive(false)
            // To Deactivate the cursor
            chartRef.current.getEchartsInstance().dispatchAction({
                type: 'takeGlobalCursor',
            })
            // To clean the brush selected area
            chartRef.current.getEchartsInstance().dispatchAction({
                type: 'brush',
                areas: [],
            })
        } else {
            setIsSelectLabelActive(true)
            // Activate the cursor with a brush selection on lineX
            chartRef.current.getEchartsInstance().dispatchAction({
                type: 'takeGlobalCursor',
                key: 'brush',
                brushOption: {
                    brushType: 'lineX',
                },
            })
        }
    }
    return (
        <div className="flex flex-row justify-end items-center">
            {isSelectLabelActive && (
                <div className="flex flex-row justify-center items-center">
                    <input placeholder="De" value={inputPeriodTime?.startTime} />
                    <input placeholder="À" value={inputPeriodTime?.endTime} />
                </div>
            )}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
                <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBrushSelection()}
                    sx={{
                        '&:hover': {
                            backgroundColor: color,
                            opacity: '.7',
                        },
                    }}
                >
                    <span className="hidden sm:flex">
                        <TypographyFormatMessage>
                            {isSelectLabelActive ? 'Annuler' : 'Ajouter un label'}
                        </TypographyFormatMessage>
                    </span>
                    <span className="flex sm:hidden">
                        <AddIcon />
                    </span>
                </Button>
            </motion.div>
        </div>
    )
}

export default AddLabelButtonForm
