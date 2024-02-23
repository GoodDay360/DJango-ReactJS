global.setInterval = (callback, delay) => {
    const handle = {
        id: null,
        state: true,
    }

    function run() {
        callback();
        if (handle.state) handle.id  = setTimeout(run, delay);
    }
    handle.id = setTimeout(run, delay);
    return handle;
}

global.clearInterval = (handle) => {
    if (!handle) return
    clearTimeout(handle.id);
    handle.state = false
}