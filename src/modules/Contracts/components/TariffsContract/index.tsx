import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useWatch } from 'react-hook-form'
import { useCommercialOffer } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { contractFormValuesType } from 'src/modules/Contracts/contractsTypes'
import { getTariffContractUnit, isValidDate } from 'src/modules/Contracts/utils/contractsFunctions'
import { isEmpty, isNull } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Tariffs Contract Component.
 *
 * @returns Tariffs Contract Component.
 */
const TariffsContract = () => {
    const { formatMessage } = useIntl()
    const formData = useWatch<contractFormValuesType>({})
    const { tariffs, loadTariffsHousingContract, setTariffs, isTariffsLoading } = useCommercialOffer()

    useEffect(() => {
        /**
         * When the user set the start subscription date then we retrieve the tariffs from the back.
         * We check if the date is valid to avoid problem of invalid date, when the user set the date by the keyboard instead of using the picker.
         * We also check when the end subscription exist, it should be valid, if it doesn't exist we still load the tariff normally.
         */
        if (
            isValidDate(formData.startSubscription) &&
            (!formData.endSubscription || isValidDate(formData.endSubscription))
        ) {
            loadTariffsHousingContract(
                formData.offerId!,
                formData.tariffTypeId!,
                formData.contractTypeId!,
                formData.power!,
                formData.startSubscription!,
                formData.endSubscription,
            )
        } else if (!isValidDate(formData.startSubscription)) setTariffs(null)
        /**
         * We should add this eslint-disable to avoid adding the other fields of the formData,
         * because, we need to load tariffs only if the startSub is valid and (the endSub is not exist or it's exist and it's valid.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.startSubscription, formData.endSubscription, loadTariffsHousingContract, setTariffs])

    if (isNull(tariffs)) return null

    if (isTariffsLoading)
        return (
            <div className="flex justify-center p-16">
                <CircularProgress size={32} />
            </div>
        )

    if (isEmpty(tariffs))
        return (
            <TypographyFormatMessage
                className="pt-16 text-13 font-medium text-center md:text-14"
                sx={{ color: 'grey.600' }}
            >
                {formatMessage({
                    id: 'Aucun tarif disponible',
                    defaultMessage: 'Aucun tarif disponible',
                })}
            </TypographyFormatMessage>
        )

    return (
        <div className="flex flex-col justify-center w-full p-8 pt-16">
            {tariffs
                // Sort the tariffs to show it alphabetically by label.
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((tariff) => (
                    <div className="flex flex-col justify-center items-center w-full py-4" key={tariff.label}>
                        <TypographyFormatMessage
                            className="text-13 font-medium text-center md:text-14"
                            sx={{ color: 'grey.600' }}
                        >
                            {`${tariff.label}: ${tariff.price} ${getTariffContractUnit(tariff)}`}
                        </TypographyFormatMessage>
                    </div>
                ))}
        </div>
    )
}

export default TariffsContract
