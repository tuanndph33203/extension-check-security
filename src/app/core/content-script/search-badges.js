const api = globalThis.chrome || globalThis.browser;
let enableTags = true;

function isSearchPage() {
    const host = window.location.hostname;
    return (
        (host.includes('google.') && (location.pathname.includes('/search') || location.search.includes('q='))) ||
        host.includes('bing.com')
    );
}

function addBadgesToResults() {
    if (!isSearchPage()) return;
    const results = document.querySelector('.MjjYud, .b_algo, .WwiC3b, .s3v9rd, [data-sncf]');

    results.forEach((result) => {
        const el = result;
        const old = el.querySelector('.my-warning-tag');
        if (old) old.remove();

        if (!enableTags) return;

        const link = el.querySelector('a[href]')
        if (!link) return;

        el.style.position = 'relative';
        const tag = document.createElement('div');
        tag.className = 'my-warning-tag';
        tag.innerText = 'Cảnh báo';
        Object.assign(tag.style, {
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'red',
            color: 'white',
            fontSize: '12px',
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: '999'
        });

        const url = link.href;
        if (url.includes('wikipedia.org')) {
            tag.innerText = 'Tin cậy';
            tag.style.background = 'green';
        } else if (url.includes('thegioididong.com')) {
            tag.innerText = 'Đối tác';
            tag.style.background = 'blue';
        }

        el.appendChild(tag);
    });
}

function observeResults() {
    const observer = new MutationObserver(() => {
        clearTimeout((observer)._timeout);
        (observer)._timeout = setTimeout(addBadgesToResults, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// api.storage.local.get(['enableTags'], (res) => {
//     enableTags = res.enableTags ?? true;
addBadgesToResults();
observeResults();
// });

api.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enableTags) {
        enableTags = changes.enableTags.newValue;
        addBadgesToResults();
    }
});
