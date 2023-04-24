import { useFAQ } from 'src/modules/FAQ/FAQHook/FAQhook'
import { FAQField } from 'src/modules/FAQ/components/FAQFileld/FAQField'
import { Button, CircularProgress } from '@mui/material'
import { useIntl } from 'react-intl'
import { techSupportAddress } from 'src/modules/FAQ/FAQConfig'

/**
 * Convert the Contact tech support email address to Url.
 * That's should be a function to avoid a problem of `accesses to a variable before initialisation`.
 *
 * @returns Email-Url.
 */
export const mailtoUrl = () => `mailto:${techSupportAddress}`

/**
 * FAQContent component.
 *
 * @returns FAQContent component.
 */
export const FAQContent = () => {
    const { dataFAQ, isLoadingInProgress } = useFAQ()
    const { formatMessage } = useIntl()

    if (isLoadingInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    return (
        <>
            {dataFAQ?.map((item) => (
                <FAQField content={item.content} title={item.title} key={item.id} />
            ))}
            <div className="m-16 md:ml-36">
                <Button variant="contained" href={mailtoUrl()}>
                    {formatMessage({
                        id: 'Contacter le Support Technique',
                        defaultMessage: 'Contacter le Support Technique',
                    })}
                </Button>
            </div>
        </>
    )
}
