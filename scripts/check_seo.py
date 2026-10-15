"""Validate crawlable HTML, structured data, local resources and sitemap coverage."""
import json
import sys
from datetime import date, datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://adityagis.github.io/Portfolio/'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.canonicals, self.links, self.schemas, self.ids = [], [], [], set()
        self.title, self.description, self.h1 = '', '', 0
        self.in_title = self.in_schema = False
        self.schema = ''
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'title':
            self.in_title = True
        if tag == 'h1':
            self.h1 += 1
        if tag == 'meta' and a.get('name') == 'description':
            self.description = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonicals.append(a.get('href', ''))
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.in_schema, self.schema = True, ''
        for key in ('href', 'src'):
            if a.get(key):
                self.links.append(a[key])

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema += data

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script' and self.in_schema:
            self.schemas.append(self.schema)
            self.in_schema = False


def check_profile_dates(value, rel, errors):
    if isinstance(value, list):
        for item in value:
            check_profile_dates(item, rel, errors)
    elif isinstance(value, dict):
        types = value.get('@type', [])
        if isinstance(types, str):
            types = [types]
        if 'ProfilePage' in types:
            for field in ('dateCreated', 'dateModified'):
                if field not in value:
                    continue
                stamp = value[field]
                try:
                    parsed = datetime.fromisoformat(stamp.replace('Z', '+00:00'))
                    if 'T' not in stamp or parsed.utcoffset() is None:
                        raise ValueError('needs time and timezone')
                except (ValueError, TypeError, AttributeError):
                    errors.append(f'{rel}: ProfilePage {field} must be an ISO 8601 datetime with timezone')
        for item in value.values():
            check_profile_dates(item, rel, errors)


def main():
    errors = []
    pages = {p: Page(p.read_text(encoding='utf-8')) for p in ROOT.rglob('*.html')}
    titles, canonicals = set(), set()
    for path, page in pages.items():
        rel = path.relative_to(ROOT).as_posix()
        if rel == '404.html':
            continue
        expected = BASE + ('' if rel == 'index.html' else rel)
        if page.canonicals != [expected]:
            errors.append(f'{rel}: canonical must be {expected}')
        if not page.title or page.title in titles:
            errors.append(f'{rel}: missing or duplicate title')
        titles.add(page.title)
        canonicals.add(expected)
        if not page.description or page.h1 != 1:
            errors.append(f'{rel}: needs description and exactly one H1')
        if not page.schemas:
            errors.append(f'{rel}: missing structured data')
        for schema in page.schemas:
            try:
                check_profile_dates(json.loads(schema), rel, errors)
            except ValueError as exc:
                errors.append(f'{rel}: invalid JSON-LD: {exc}')
        for link in page.links:
            resolved = urlsplit(urljoin(BASE + rel, link))
            if resolved.scheme not in ('http', 'https') or resolved.netloc != 'adityagis.github.io':
                continue
            if not resolved.path.startswith('/Portfolio/'):
                continue
            target = ROOT / unquote(resolved.path[len('/Portfolio/'):])
            if target.is_dir():
                target = target / 'index.html'
            if not target.is_file():
                errors.append(f'{rel}: missing local resource {link}')
            elif resolved.fragment and target in pages and unquote(resolved.fragment) not in pages[target].ids:
                errors.append(f'{rel}: missing fragment {link}')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    entries = ET.parse(ROOT / 'sitemap.xml').findall('s:url', ns)
    urls = [entry.findtext('s:loc', namespaces=ns) for entry in entries]
    if len(urls) != len(set(urls)) or set(urls) != canonicals:
        errors.append(f'Sitemap mismatch: missing {canonicals-set(urls)}, extra {set(urls)-canonicals}')
    for entry in entries:
        modified = entry.findtext('s:lastmod', namespaces=ns)
        if modified and date.fromisoformat(modified) > date.today():
            errors.append(f'Sitemap future date: {modified}')
    if errors:
        print('\n'.join(errors))
        return 1
    print(f'PASS: {len(canonicals)} canonical pages, sitemap, JSON-LD, resources and fragments.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
