import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'

/**
 * Message when table empty.
 *
 * @param props N/A.
 * @param props.message The message to show when empty table.
 * @returns Message when table empty.
 */
function EmptyTableMessage({
    message,
}: /**
 *
 */
{
    /**
     *
     */
    message: string | JSX.Element
}) {
    return (
        <motion.div
            className="flex flex-1 items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
        >
            <Typography color="textSecondary" variant="h5">
                {message}
            </Typography>
        </motion.div>
    )
}

export default EmptyTableMessage
