import React, { useEffect } from 'react'
import { useFAQ } from 'src/modules/FAQ/FAQHook/FAQhook'
import { FAQField } from 'src/modules/FAQ/components/FAQFileld/FAQField'
import { Button, CircularProgress } from '@mui/material'
import { useIntl } from 'react-intl'
/**
 * FAQContent component.
 *
 * @returns FAQContent component.
 */
export const FAQContent = () => {
    const { dataFAQ, loadFAQ, isLoadingInProgress } = useFAQ()
    const { formatMessage } = useIntl()
    // useEffect(() => {
    //     if (!dataFAQ?.length) {
    //         loadFAQ()
    //     }
    // }, [dataFAQ, isLoadingInProgress, loadFAQ])
    console.log(isLoadingInProgress)
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
                <Button variant="contained">
                    {formatMessage({
                        id: 'Contacter le Support Technique',
                        defaultMessage: 'Contacter le Support Technique',
                    })}
                </Button>
            </div>
        </>
    )
}
