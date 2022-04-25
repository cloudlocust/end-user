import { IntlProvider, IntlConfig } from 'react-intl'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import dayjs from 'dayjs'

/**
 * Use strictParseDatePlugin to for the parse the date with strict mode by default
 * because we have a problem in the validation of date when we using AdapterDayjs
 * and we waiting of.
 *
 * @param o Dayjs object.
 * @param c Dayjs class.
 * @param d N/A.
 */
const strictParseDatePlugin = (o: any, c: any, d: any) => {
    const proto = c.prototype
    const oldParse = proto.parse
    /**
     * Override the parse method for use stric mode.
     *
     * @param cfg Configuration of dayjs.
     */
    proto.parse = function (cfg: any) {
        /**
         * We specify a boolean for the last argument to use strict parsing.
         * Strict parsing requires that the format and input match exactly, including delimiters.
         */
        cfg.args[cfg.args.length] = true
        oldParse.call(this, cfg)
    }
}

// use strictParseDatePlugin to for the parse the date with strict mode by default
dayjs.extend(strictParseDatePlugin)

/**
 * TODO Document.
 */
export interface ITranslatitonProviderProps extends Omit<IntlConfig, 'locale' | 'messages'> {
    /**
     * Chidren components of react component.
     */
    children: ReactNode
}

/**
 *  TODO Document.
 *
 * @param props TODO Document.
 * @returns TODO Document.
 */
export const TranslatitonProvider: FC<ITranslatitonProviderProps> = (props): JSX.Element => {
    const { locale, translations } = useSelector(({ translationModel }: any) => translationModel)

    useEffect(() => {
        // load the locale of dayjs for use it to parse the datetime
        // https://github.com/iamkun/dayjs/issues/792#issuecomment-639961997
        // Error when not giving the .js because wbepack will try all files including .d.ts and gives issued error.
        require(`dayjs/locale/${locale}.js`)
        dayjs.locale(locale)
    }, [locale])

    return (
        <IntlProvider locale={locale} messages={translations} {...props}>
            {/* We use this provide for date time calendar of mui */}
            <LocalizationProvider dateAdapter={AdapterDayjs} locale={locale}>
                {props.children}
            </LocalizationProvider>
        </IntlProvider>
    )
}
