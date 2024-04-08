/**
 * FAQ item contain question and answer.
 */
export type FAQItem =
    /**
     * FAQ item contain question and answer.
     */
    {
        /**
         * The title of FAQ item.
         */
        title: string | JSX.Element
        /**
         * The content of the FAQ item.
         */
        content: string | JSX.Element
    }

/**
 * FAQ Props.
 */
export type FAQProps =
    /**
     * FAQ Props.
     */
    {
        /**
         * The title of the FAQ.
         */
        title: string | JSX.Element
        /**
         * The items of the FAQ (question, answer).
         */
        items: Array<FAQItem>
        /**
         * The style of the FAQ item.
         */
        style?: React.CSSProperties
    }
