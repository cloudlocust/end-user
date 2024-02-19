import { FC, useState, SyntheticEvent } from 'react'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import { FAQProps } from 'src/modules/shared/FAQ/FAQ.types'

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:first-child': {
            borderTop: 0,
        },
        '&::before': {
            display: 'none',
        },
    }),
)

/**
 * FAQ Component used an accordion style.
 *
 * @param root0 Props.
 * @param root0.items The items of the FAQ (question, answer).
 * @param root0.title The title of the FAQ.
 * @param root0.style The style of the FAQ item.
 * @returns React Component.
 */
export const FAQ: FC<FAQProps> = ({ items, title, style }) => {
    const [expanded, setExpanded] = useState<string | false>(false)

    /**
     * Function used to handle the select of accordion item for we can switch between them.
     *
     * @param panel The id of the accordion item.
     * @returns N/A.
     */
    const handleChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <div className="w-full" data-testid="faq">
            <Card className="w-full rounded-20 shadow sm:m-4 pb-8 px-12" variant="outlined" style={style}>
                <div className="p-16 h-full">
                    <Typography className="text-13 font-medium md:text-17 flex items-center">{title}</Typography>
                </div>
                <div className="w-full">
                    {items.map((item, index) => (
                        <Accordion
                            expanded={expanded === `panel-${index}`}
                            onChange={handleChange(`panel-${index}`)}
                            key={index}
                            elevation={0}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="text-13 font-medium">{item.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{item.content}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </Card>
        </div>
    )
}
