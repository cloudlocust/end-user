/**
 * Props for the RoutePrompt component.
 */
export interface RoutePromptProps {
    /**
     * When the prompt should be shown.
     */
    when: boolean
    /**
     * Called when the user click on confirm button.
     *
     */
    onOK?: (args?: any) => any
    /**
     * Called when the user clicks on cancek button.
     *
     */
    onCancel?: () => any
    /**
     * The content of the prompt.
     */
    content: string | React.ReactNode
    /**
     * The title of the prompt.
     */
    title?: string
    /**
     * The text of the confirm button.
     */
    okText?: string
    /**
     * The text of the cancel button.
     */
    cancelText?: string
}
