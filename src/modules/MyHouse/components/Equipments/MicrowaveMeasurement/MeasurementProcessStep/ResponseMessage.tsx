import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ResponseMessageProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'

/**
 * Component for showing the response message of the measurement.
 *
 * @param root0 N/A.
 * @param root0.theme The MUI Theme object.
 * @param root0.title The title of the message.
 * @param root0.content The content of the message.
 * @param root0.success True if it's a success response.
 * @returns The ResponseMessage component.
 */
export const ResponseMessage = ({ theme, title, content, success }: ResponseMessageProps) => (
    <div className="text-center mb-20">
        <TypographyFormatMessage
            fontWeight="500"
            fontSize="15px"
            marginBottom="5px"
            color={success ? theme.palette.success.main : theme.palette.error.main}
        >
            {title}
        </TypographyFormatMessage>
        <TypographyFormatMessage fontSize="14px">{content}</TypographyFormatMessage>
    </div>
)
