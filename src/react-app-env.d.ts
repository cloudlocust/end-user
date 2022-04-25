/// <reference types="react-scripts" />
declare module '*.scss' {
    const content: { readonly [className: string]: string }
    export default content
}
