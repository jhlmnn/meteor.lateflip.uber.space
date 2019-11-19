window.onXS2AReady = (XS2A) => {
    // configure once for all flows (optional)
    window.XS2A.configure({
        autoClose: true,
        hideTransitionOnFlowEnd: true,
        onLoad: () => {
            console.log('onLoad called')
        },
        onReady: () => {
            console.log('onReady called')
        },
        onAbort: () => {
            console.log('onAbort called')
        },
        onError: (error) => {
            console.log('onError called', error)
        },
        onFinished: () => {
            console.log('onFinished called')
        },
        onClose: () => {
            console.log('onClose called')
        }
    })
};
