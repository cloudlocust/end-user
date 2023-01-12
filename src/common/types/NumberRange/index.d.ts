// eslint-disable-next-line jsdoc/require-jsdoc
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

/**
 * Range number type.
 *
 * @see https://stackoverflow.com/a/70307091/14005627
 * @example Range<0, 24> // 1 | 2 | 3 | 4 | ... | 23
 */
export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
