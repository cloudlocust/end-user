/**
 * Here we find reusable functions for tables with pagination and sorting.
 */
/**
 *
 */
type orderByType = string
/**
 * Descending Comparator function responsible for sorting descendling values of the table column, by comparing each value.
 *
 * @param a First value.
 * @param b Second value.
 * @param orderBy Column of comparaison.
 * @returns Indicator if a>b, a<b or a==b.
 */
export function descendingComparator<genericType>(a: genericType, b: genericType, orderBy: orderByType) {
    if (b[orderBy as keyof genericType] < a[orderBy as keyof genericType]) {
        return -1
    }
    if (b[orderBy as keyof genericType] > a[orderBy as keyof genericType]) {
        return 1
    }
    return 0
}

/**
 * Get Comparator function for sorting columns values used by Material UI.
 *
 * @param order Order props ("desc" or "asc").
 * @param orderBy OrderBy the column cell id (example: "Date") Props.
 * @returns GetComparator in TableSort by Material UI.
 */
export function getComparator<genericType>(order: string, orderBy: orderByType) {
    return order === 'desc'
        ? (a: genericType, b: genericType) => descendingComparator(a, b, orderBy)
        : (a: genericType, b: genericType) => -descendingComparator(a, b, orderBy)
}

/**
 * StableSort by Material UI, used for sorting rows of the Table Component.
 *
 * @param array Array of values to be sorted.
 * @param comparator Comparator.
 * @returns Columns sorted according to comparator and orderBy (desc or asc).
 */
export function stableSort<genericType>(array: genericType[], comparator: Function) {
    const stabilizedThis = array.map((el: genericType, index: number) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return (a[1] as number) - (b[1] as number)
    })
    return stabilizedThis.map((el) => el[0]) as genericType[]
}
