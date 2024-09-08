type DomListener = {
    dom: HTMLElement
    callback: (width: number, height: number) => void
}
let domListeners: DomListener[] = []
const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(entry => {
        domListeners.forEach(item => {
            if (item.dom === entry.target) {
                const {width, height} = entry.contentRect
                item.callback(width, height)
            }
        })
    })
})

type WindowListener = {
    callback: (width: number, height: number) => void
}
let windowListeners: WindowListener[] = []
window.addEventListener('resize', () => {
    windowListeners.forEach(item => {
        item.callback(window.innerWidth, window.innerHeight)
    })
})

export const UI = {
    onWindowResize(callback: (width: number, height: number) => void) {
        windowListeners.push({callback})
    },
    offWindowResize(callback: (width: number, height: number) => void) {
        windowListeners = windowListeners.filter(item => item.callback !== callback)
    },
    onResize(dom: HTMLElement | null, callback: (width: number, height: number) => void) {
        if (!dom) return
        domListeners.push({dom, callback})
        resizeObserver.observe(dom)
    },
    offResize(dom: HTMLElement | null) {
        if (!dom) return
        domListeners = domListeners.filter(item => item.dom !== dom)
        resizeObserver.unobserve(dom)
    }
}
