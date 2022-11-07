export default function rewriteUrl(config) {

    const port = process.env.MOCKER_PORT;
    let host = process.env.MOCKER_HOST;

    if(!port && !host) {
        return config;
    }

    try {
        host = new URL(config.url).host;
    } catch {

        if(!host) {
            host = window.location.hostname;
        }
    }

    let url;

    try {
        url = new URL(config.url).pathname;
    } catch {
        url = config.url
    }

    let protocol = process.env.MOCKER_PROTOCOL;

    if(!protocol) {
        try {
            protocol = new URL(config.url).protocol;
        } catch {
            protocol = window.location.protocol;
        }
    }

    if (port !== "80"
        && port !== "443") {
        url = `${protocol}//${host}:${port}${url}`;
    } else {
        url = `${protocol}//${host}${url}`;
    }

    config.url = url;
    return config;
}
