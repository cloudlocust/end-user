/**
 * Props type for EnedisDistributorClientDialog component.
 */
export type EnedisDistributorClientDialogProps =
    /**
     * EnedisDistributorClientDialog Props.
     */
    {
        /**
         * Is dialog opening.
         */
        isOpening: boolean
        /**
         * Callback to cancel the operation & close the dialog.
         *
         * @returns Void.
         */
        onCancel: () => void
        /**
         *  Callback to confirm if the user is client of Enedis.
         *
         * @param value True if the user is client of Enedis distributor or else.
         * @returns Void.
         */
        onConfirmationOfUsageOfEnedisDistributor: (value: boolean) => void
    }
