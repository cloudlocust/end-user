import { ReportHandler } from 'web-vitals'

/**
 * @param onPerfEntry ????
 * Not sure what this function is
 */
const reportWebVitals = function (onPerfEntry?: ReportHandler): void {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry)
            getFID(onPerfEntry)
            getFCP(onPerfEntry)
            getLCP(onPerfEntry)
            getTTFB(onPerfEntry)
        })
    }
}

export default reportWebVitals
