import { Card, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { StepProps } from 'src/modules/Onboarding/components/Step/Step.types'

/**
 * Step component.
 *
 * @param {StepProps} props - The component props.
 * @returns The Step component.
 */
export const Step = ({ content, title }: StepProps) => {
    return (
        <motion.div
            // layout
            // initial={{ opacity: 0, scale: 0.2 }}
            // animate={{ opacity: 1, scale: 1 }}
            initial={{ x: 'calc(50%)', opacity: 0.2 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className="w-full md:w-md lg:w-lg md:mt-64"
                elevation={0}
                style={{ background: '#b5dbde', minHeight: 600 }}
            >
                <div className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32 md:px-136">
                    {title && (
                        <Typography variant="subtitle1" className="self-start" sx={{ color: 'grey.500' }}>
                            {title}
                        </Typography>
                    )}
                    {content}
                </div>
            </Card>
        </motion.div>
    )
}
