import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import {
    GET_SHOW_NRLINK_POPUP_ENDPOINT,
    SET_SHOW_NRLINK_POPUP_ENDPOINT,
} from 'src/modules/nrLinkConnection/NrLinkConnection'
// eslint-disable-next-line jsdoc/require-jsdoc
export const showNrLinkPopupTrue = 'showNrLinkPopupTrue'
// eslint-disable-next-line jsdoc/require-jsdoc
export const showNrLinkPopupFalse = 'showNrLinkPopupFalse'

// eslint-disable-next-line jsdoc/require-jsdoc
export const nrlinkEndpoints = [
    // Get Show nrlink popup.
    rest.get(`${GET_SHOW_NRLINK_POPUP_ENDPOINT}`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === showNrLinkPopupTrue || authorization === showNrLinkPopupFalse)
            return res(
                ctx.status(200),
                ctx.delay(1000),
                ctx.json({ show_nrlink_popup: authorization === showNrLinkPopupFalse ? false : true }),
            )
        else return res(ctx.status(404), ctx.delay(1000))
    }),

    // Authorize nrLINK
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.patch<{ show_nrlink_popup: boolean }>(`${SET_SHOW_NRLINK_POPUP_ENDPOINT}`, (req, res, ctx) => {
        if (req.body.show_nrlink_popup === false)
            // Success
            return res(ctx.status(200), ctx.delay(1000))
    }),

    // Authorize nrLINK
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post<{ nrlink_guid: string; meter_guid: string }>(`${API_RESOURCES_URL}/nrlink/authorize`, (req, res, ctx) => {
        // No Data received in NrLink
        if (req.body.nrlink_guid === 'error1')
            return res(
                ctx.status(400),
                ctx.delay(1000),
                ctx.json({ detail: "Votre nrLINK ne reçoit pas de données vérifier qu'il est connecté au Wifi" }),
            )
        // Already connected nrLINK
        if (req.body.nrlink_guid === 'error2')
            return res(
                ctx.status(400),
                ctx.delay(1000),
                ctx.json({
                    detail: 'Votre nrLINK est déjà connecté à un autre compteur, veuillez réessayer ou contacter votre Boucle Locale',
                }),
            )
        // Other error
        if (req.body.nrlink_guid === 'error3') return res(ctx.status(400), ctx.delay(1000))
        // Success
        return res(ctx.status(200), ctx.delay(1000))
    }),
]
