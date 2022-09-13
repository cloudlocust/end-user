import React, { useEffect, useState } from 'react'
import { Icon } from 'src/common/ui-kit'
import { IFAQField } from 'src/modules/FAQ/components/FAQFileld/FAQField.d'
import { useFAQ } from '../../FAQHook/FAQhook'
/**
 * FAQField component.
 *
 * @param root0 N/A.
 * @param root0.title FAQ title.
 * @param root0.content FAQ content.
 * @returns FAQField component.
 */
export const FAQContent = () => {
    const { dataFAQ, loadFAQ } = useFAQ()
    useEffect(() => {
        if (!dataFAQ) {
            loadFAQ()
        }
    }, [dataFAQ, loadFAQ])

    console.log(dataFAQ)
    return <div className="border rounded m-16 md:ml-36 border-gray-400 p-16 max-w-screen-sm">faq</div>
}
