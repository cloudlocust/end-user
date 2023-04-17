import { useMemo } from 'react'
import { AnalysisMaxPowerProps } from 'src/modules/Analysis/components/AnalysisMaxPower/props.d'
import { ReactComponent as AdvicesIcon } from 'src/assets/images/pmax.svg'
import { Avatar, Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import dayjs from 'dayjs'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import { computePMaxWithTimestamp } from 'src/modules/Analysis/components/AnalysisMaxPower/utils'

/**
 * AnalysisMaxPower.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @param param0.housingId Current housing id.
 * @returns AnalysisMaxPower JSX.
 */
export const AnalysisMaxPower = ({ data, housingId }: AnalysisMaxPowerProps) => {
    // const [pmaxValue, setPmaxValue] = useState<number>()
    // const [pmaxTimestamp, setPmaxTimestamp] = useState<number>()
    // const [pmaxUnit, setPmaxUnit] = useState<string>()
    const { elementList: contractList } = useContractList(housingId)

    const inProgressContract = contractList?.find((contract) => contract.endSubscription)

    const { pmaxValue, pmaxValueTimestamp, pmaxUnit } = useMemo(() => computePMaxWithTimestamp(data), [data])

    return (
        <div className="w-full flex flex-col md:items-center">
            <div className="flex flex-row mb-16" style={{ width: '280px' }}>
                <Avatar style={{ width: 64, height: 64, backgroundColor: '#F6C327' }}>
                    <AdvicesIcon data-testid="pmax-svg" />
                </Avatar>
                <div className="ml-8 flex flex-col h-full w-full">
                    <TypographyFormatMessage className="sm:text-13 font-bold md:text-16">
                        Pmax :
                    </TypographyFormatMessage>
                    {inProgressContract && (
                        <span>
                            <TypographyFormatMessage className="sm:text-13 text-grey-600 font-bold md:text-16">
                                {`Souscrite :`}
                            </TypographyFormatMessage>
                            <Typography className="sm:text-13 font-medium md:text-16 ml-3">
                                {`${inProgressContract.power} kVa`}
                            </Typography>
                        </span>
                    )}
                    <span>
                        <TypographyFormatMessage className="sm:text-13 text-grey-600 font-bold md:text-16">{`Max atteinte :`}</TypographyFormatMessage>
                        <Typography className="sm:text-13 font-medium md:text-16">{`${pmaxValue} ${pmaxUnit} le ${dayjs(
                            pmaxValueTimestamp,
                        ).format('dddd D')}`}</Typography>
                    </span>
                </div>
            </div>
        </div>
    )
}
