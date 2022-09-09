import React, { useState } from 'react'
import { Icon } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IFAQField } from 'src/modules/FAQ/components/FAQFileld/FAQField.d'
/**
 * FAQField.
 *
 * @returns FAQField component.
 */
export const FAQField = ({ title, content }: IFAQField) => {
    const [isExpanded, setIsExpanded] = useState(false)
    return (
        <div className="border rounded m-16 md:ml-36 border-gray-400 p-16 max-w-screen-md">
            <div className="flex flex-row justify-between">
                <TypographyFormatMessage className="self-center" sx={{ color: 'text.primary' }}>
                    {title}
                </TypographyFormatMessage>
                <Icon
                    className={`${isExpanded && 'transform rotate-45 transition-transform'}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                    sx={{ color: 'primary.dark' }}
                >
                    add
                </Icon>
            </div>
            {isExpanded && (
                <TypographyFormatMessage className="self-center mt-16" sx={{ color: 'text.primary' }}>
                    {content}
                </TypographyFormatMessage>
            )}
        </div>
    )
}
