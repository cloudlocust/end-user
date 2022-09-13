import React, { useEffect } from 'react'
import { useFAQ } from 'src/modules/FAQ/FAQHook/FAQhook'
import { FAQField } from 'src/modules/FAQ/components/FAQFileld/FAQField'
/**
 * FAQContent component.
 *
 * @returns FAQContent component.
 */
export const FAQContent = () => {
    const { dataFAQ, loadFAQ } = useFAQ()
    useEffect(() => {
        if (!dataFAQ) {
            loadFAQ()
        }
    }, [dataFAQ, loadFAQ])
    return (
        <>
            {dataFAQ?.map((item) => (
                <FAQField content={item.content} title={item.title} />
            ))}
        </>
    )
}
