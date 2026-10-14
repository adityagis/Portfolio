"""Notify IndexNow only after the sitemap and public ownership key are live."""
import json
from pathlib import Path
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://adityagis.github.io/Portfolio/'


def main():
    keys = list(ROOT.glob('indexnow-*.txt'))
    if len(keys) != 1:
        raise RuntimeError('Expected exactly one public IndexNow key file')
    key = keys[0].read_text(encoding='utf-8').strip()
    location = BASE + keys[0].name
    with urlopen(location, timeout=30) as response:
        if response.read().decode('utf-8').strip() != key:
            raise RuntimeError('Live ownership key does not match; deploy first')
    with urlopen(BASE + 'sitemap.xml', timeout=30) as response:
        live_sitemap = response.read()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    def urls(xml):
        return [e.text for e in ET.fromstring(xml).findall('s:url/s:loc', ns)]
    expected = urls((ROOT / 'sitemap.xml').read_bytes())
    if set(urls(live_sitemap)) != set(expected):
        raise RuntimeError('Live sitemap differs from local sitemap; wait for deployment')
    for url in expected:
        if not url.startswith(BASE):
            raise RuntimeError('Sitemap contains URL outside owned portfolio')
        with urlopen(url, timeout=30) as response:
            if response.status != 200:
                raise RuntimeError(f'Page not live: {url}')
    request = Request('https://api.indexnow.org/indexnow', data=json.dumps({
        'host': 'adityagis.github.io', 'key': key, 'keyLocation': location,
        'urlList': expected,
    }).encode(), headers={'Content-Type': 'application/json; charset=utf-8'})
    with urlopen(request, timeout=30) as response:
        print(f'IndexNow HTTP {response.status}: notified {len(expected)} URLs. This is a notification, not proof of indexing or ranking.')


if __name__ == '__main__':
    main()
