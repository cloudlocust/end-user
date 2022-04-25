import { DefaultRequestBody, RequestParams, RestRequest } from 'msw'

/**
 * Function that is repeated for mocking GET ALL with pagination.
 *
 * @param req Req given by msw.
 * @param elementList The Mocked List in the specific handler.
 * @param searchFields So that we can handle pagination with search queries, by indicating the searchFields.
 * @returns Pagination in the format {items: [PaginatedList], total: [TotalElementList], size: [SizeOfRequest], page: [PageOfRequest]}.
 */
export function getPaginationFromElementList<
    // eslint-disable-next-line jsdoc/require-jsdoc
    elementType,
>(
    req: RestRequest<DefaultRequestBody, RequestParams>,
    elementList: elementType[],
    // eslint-disable-next-line jsdoc/require-jsdoc
    searchFields?: string[],
) {
    const pageParam = req.url.searchParams.get('page')
    const sizeParam = req.url.searchParams.get('size')
    const searchParam = req.url.searchParams.get('search')
    let page = 1
    let size = 500
    if (pageParam && parseInt(pageParam)) page = parseInt(pageParam)
    if (sizeParam && parseInt(sizeParam)) {
        // Use SizeParam to fake error case when fetching data.
        size = parseInt(sizeParam)
        if (size < 0) return null
    }

    let total = elementList.length
    let TEST_LIST_RESPONSE = elementList
    if (searchParam && searchFields) {
        // Filter only the searched elements.
        const searchRegex = new RegExp(searchParam, 'i')
        TEST_LIST_RESPONSE = TEST_LIST_RESPONSE.filter((element: elementType) => {
            for (const field of searchFields) {
                if (`${element[field as keyof elementType] as unknown}`.match(searchRegex)) return true
            }
            return false
        })
        total = TEST_LIST_RESPONSE.length
    }
    TEST_LIST_RESPONSE = TEST_LIST_RESPONSE.slice((page - 1) * size, page * size)
    return {
        items: TEST_LIST_RESPONSE,
        total: total,
        page: page,
        size: size,
    }
}
