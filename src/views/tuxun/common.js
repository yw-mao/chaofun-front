export function tuxunJump(uri) {
    if (uri.includes(".") || uri.includes("://")) {
        window.location.href = uri;
    } if (location.host.includes('tuxun.fun')) {
        window.location.href = uri.replace('/tuxun', '');
    } else {
        window.location.href = uri;
    }
}

export function tuxunOpen(uri) {
    if (uri.includes(".") || uri.includes("://")) {
        window.open(uri,"_blank");
    } if (location.host.includes('tuxun.fun')) {
        window.open(uri.replace('/tuxun', ''),"_blank");
    } else {
        window.open(uri,"_blank");
    }
}

