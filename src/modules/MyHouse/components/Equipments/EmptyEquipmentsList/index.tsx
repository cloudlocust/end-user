import { motion } from 'framer-motion'
import { useIntl } from 'react-intl'
import { ReactComponent as NoEquipmentsIcon } from 'src/assets/images/content/housing/no-equipments.svg'
import { ButtonLoader, Typography } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * EmptyEquipmentsList component.
 *
 * This component should only be rendred when equipmentsList is falsy.
 *
 * @param root0 N/A.
 * @param root0.handleOpenPopup Function to open.
 * @returns EmptyEquipmentsList jsx.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const EmptyEquipmentsList = ({ handleOpenPopup }: { handleOpenPopup: () => void }) => {
    const { formatMessage } = useIntl()

    return (
        <div className="flex justify-center items-center flex-col">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-col p-16 items-center justify-center h-full gap-16 text-justify mb-48"
            >
                <div className="mb-12">
                    <NoEquipmentsIcon />
                </div>
                <Typography className="text-center text-base mb-12">
                    {formatMessage({
                        id: "Aucun appareil n'a encore été configuré, cliquez sur",
                        defaultMessage: "Aucun appareil n'a encore été configuré, cliquez sur",
                    })}{' '}
                    <u>
                        {formatMessage({
                            id: 'Ajout Rapide',
                            defaultMessage: 'Ajout Rapide',
                        })}
                    </u>{' '}
                    {formatMessage({
                        id: 'pour commencer à configurer votre',
                        defaultMessage: 'pour commencer à configurer votre',
                    })}
                </Typography>
                <ButtonLoader className="whitespace-nowrap" variant="contained" onClick={handleOpenPopup}>
                    <TypographyFormatMessage>Ajout Rapide</TypographyFormatMessage>
                </ButtonLoader>
            </motion.div>
        </div>
    )
}
