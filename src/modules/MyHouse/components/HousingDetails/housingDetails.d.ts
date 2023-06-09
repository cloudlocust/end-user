/**
 * This is the Type of an element passed to the details card.
 */
export type HouseDetailsElementType =
    //eslint-disable-next-line
    {
        /**
         * Icon displayed in the card for this element.
         */
        icon: React.ReactNode
        /**
         * What to display under the Icon.
         */
        label: string
    }

/**
 * Housing card types.
 */
export type HousingCardTypeOfDetails = 'accomodation' | 'equipments' | 'connectedPlugs'

/**
 * Housing details card props.
 */
export type HousingDetailsCardProps =
    //eslint-disable-next-line
    {
        /**
         * Title of the card.
         */
        title: string
        /**
         * Elements to display (element is a icon and a label).
         */
        elements: HouseDetailsElementType[]
        /**
         * Title of the card.
         */
        typeOfDetails: HousingCardTypeOfDetails
        /**
         * Are the elements configured.
         */
        isConfigured: boolean
        /**
         * Are the elements loaded or not.
         */
        loadingInProgress: boolean
    }
