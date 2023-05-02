import 'src/common/ui-kit/components/MapElementList/components/ElementListGrid/ElementListGrid.scss'
import { elementConstraintType } from 'src/common/ui-kit/components/MapElementList'

/**
 *
 */
interface CustomersGridProps<elementType extends elementConstraintType> {
    /**
     *
     */
    data: elementType[] | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    ElementCard: ({ element }: { element: elementType }) => JSX.Element
    /**
     *
     */
    placeholder?: JSX.Element
    /**
     *
     */
    loadingData?: boolean
    /**
     *
     */
    shrink?: boolean
}
/**.
 * Component responsible for rendering the customers in a Grid
 *
 * @param props N/A.
 * @param props.data Represent our customers Data.
 * @param props.ElementCard The Element Card UI.
 * @param props.placeholder Component that's going to be rendered as customers placeholder meanwhile the real customers are being loaded.
 * @param props.loadingData Boolean indicating if there is a loadingData item happening.
 * @param props.shrink Boolean indicating if we want to reduce the width of the gri.
 * @returns A Grid showing the customers
 */
export default function SectionGrid<elementType extends elementConstraintType>({
    data = [],
    placeholder,
    loadingData,
    shrink,
    ElementCard,
}: CustomersGridProps<elementType>) {
    // Number of placeholder when loading the data. (set to 10 for now).
    const limits = Array(10).fill(0)
    let columnClassName = `BoxColumn ${shrink && 'BoxColumnShrink'}`

    return (
        <>
            <div className="BoxRow">
                {!loadingData && data && data.length
                    ? data.map((element: elementType) => (
                          <div className={columnClassName} key={element.id}>
                              <ElementCard element={element} />
                          </div>
                      ))
                    : null}

                {loadingData &&
                    limits.map((_, index) => (
                        <div className={columnClassName} key={index}>
                            {placeholder}
                        </div>
                    ))}
            </div>
        </>
    )
}
