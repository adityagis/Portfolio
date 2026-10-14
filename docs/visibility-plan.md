# Search and AI discovery plan for Aditya Kumar Jha

Prepared: 14 October 2026. Primary URL: https://adityagis.github.io/Portfolio/

## Outcome and measurement

Build a recognisable professional identity around demonstrated GNSS, geodesy and geoinformatics work. Start with searches for the name and specialised project topics, then earn visibility for broader searches through original technical material and relevant references. Rankings, indexing and citations remain decisions made by each search service. Website changes cannot make every AI model mention a person or update a model's existing training.

Track Google Search Console and Bing Webmaster Tools impressions, clicks, indexed canonical pages, query relevance and contact enquiries. Record a baseline after the first data becomes available. Search-result spot checks vary by location, history and time and should not be reported as universal rankings.

## Audit baseline

- Public site returns HTTP 200; repository default branch is main, and GitHub Pages publishes from its root.
- Existing site already has canonical URLs, descriptions, social cards, structured data, robots files, a sitemap and optional AI text summaries.
- Root robots.txt correctly advertises the portfolio sitemap. A robots.txt beneath /Portfolio/ alone would not control crawling of the host.
- A small web-search sample did not surface the target portfolio and did surface several people with the same name. This is a discovery observation, not proof that Google or Bing has no indexed URLs.
- Existing project and profile content supplies the professional facts used in the changes. No publications, awards, endorsements or third-party profiles have been inferred from name matches.

## Implementation

- Add a substantive expertise guide linking GNSS CORS, levelling, Python GIS, LiDAR, remote sensing and GeoAI work.
- Link the guide from Home and Research and include it and existing technical notes in site search.
- Make the homepage title explicitly identify geoinformatics, GNSS and geodesy.
- Keep one stable Person identity and consistent portfolio, GitHub and LinkedIn references.
- Regenerate the sitemap from actual canonical HTML pages, preserving old modification dates on unchanged content.
- Add SEO validation for canonical URLs, unique titles, descriptions, one H1, JSON-LD, sitemap coverage, local resources and fragment links.
- Run those checks on GitHub pushes and pull requests.
- Set up a public IndexNow ownership key and submission script that checks the deployed key, sitemap and pages before notifying participating search engines. Run it after successful GitHub Pages deployments and allow manual reruns.
- Verify the URL-prefix property in Google Search Console and submit the sitemap. Set up Bing Webmaster Tools when account access and any required terms acceptance are available.

AI text summaries are optional reader conveniences. They are not guaranteed ranking signals, AI inclusion mechanisms or replacements for crawlable HTML. Allowing a training crawler is permission to crawl; it does not prove training or future recommendations.

## Query map

| Priority | Search intent | Primary destination |
| --- | --- | --- |
| 1 | Aditya Kumar Jha geoinformatics; Aditya Jha GIS; adityagis | Home and About |
| 1 | Aditya Kumar Jha GNSS geodesy | Expertise guide |
| 2 | GNSS CORS processing Python; GAMIT GLOBK workflow | GNSS CORS project |
| 2 | PRIDE PPP-AR RINEX processing | GNSS CORS project |
| 2 | high precision levelling adjustment Python | HPL project and technical note |
| 2 | Helmert orthometric heights; geopotential number computation | HPL project |
| 3 | LiDAR hyperspectral Python geoinformatics | LiDAR project |
| 3 | flood risk mapping QGIS India | Flood-risk and Kosi projects |
| 3 | EuroSAT PyTorch LULC QGIS | UGD LULC project |
| 3 | GIS Python automation consultant India | Research, Skills and Contact |

These are initial content targets, not researched search-volume estimates. Refine them from actual query data. Broad terms such as “geodesy” or “GIS” may be dominated by universities, documentation and reference sites; informative pages need to answer a specific intent to compete usefully.

## Days 1–14: identity and indexing

1. Publish and verify the changes and ownership tags.
2. Submit the canonical sitemap to Google and Bing; inspect Home, the expertise guide and the HPL note. Request indexing only where the service offers it.
3. Use the same professional name, role, portfolio URL and topic description across GitHub and LinkedIn. Do not create unrelated accounts merely to multiply links.
4. Keep the public project evidence reachable. Add explicit metric context to future case studies: dataset, date, validation split, comparison method and limitations.
5. Use Search Console to diagnose indexing exclusions; do not assume a sitemap submission means pages have been indexed.

## Weeks 3–6: original technical work

Publish one substantial article each week, using reproducible public examples and an author byline. The following are briefs for future work, not completed experiments:

| Week | Article | Evidence needed |
| --- | --- | --- |
| 3 | RINEX preparation and QA before GNSS processing | Public or synthetic sample, checks, logs and explained failures |
| 4 | Levelling loop closure and network adjustment | Synthetic network, reproducible calculations, diagnostics |
| 5 | Processing a LiDAR point cloud with Python | Public licensed dataset, script, before/after visualisation |
| 6 | EuroSAT validation and generalisation limits | Dataset split, leakage controls, confusion matrix, error examples |

Expand the existing project pages when results are available. Avoid publishing multiple near-identical keyword pages. A useful article should supply information beyond the topic hub.

## Weeks 7–12: relevant distribution and iteration

| Week | Focus |
| --- | --- |
| 7 | Publish a reproducible QGIS flood-scenario walkthrough with data provenance |
| 8 | Document a geospatial Python repository: installation, example input, expected output, licence |
| 9 | Publish a comparison based on actual GNSS processing runs and clearly stated conditions |
| 10 | Improve the page with the highest relevant impressions but weak click-through, using its real queries |
| 11 | Address recurring technical questions with worked examples and links to related projects |
| 12 | Review indexed pages, impressions, enquiries and repository engagement; revise next-quarter priorities |

For each finished article: create one LinkedIn summary, one short visual explanation and one link from the related repository README. Adapt the message to each channel and link to the original article. Publish videos only when a useful demonstration exists. Reddit, GIS Stack Exchange and professional communities should receive helpful, context-appropriate contributions with affiliation disclosed; do not mass-post promotional links.

Seek independent references through legitimate work: open-source contributions, project collaborations, conference demos, university club activity and original datasets. Any outreach message or social post should be prepared for review before sending unless publishing that specific communication is authorised. Do not manufacture reviews, citations or endorsements.

## Weekly review

Record the review date, Google/Bing indexed counts, relevant query impressions and clicks, top landing pages, contact enquiries and any indexing issues. Compare against the previous four weeks once enough data exists. For AI search, test a fixed small prompt set with web search enabled, record the model/date, and retain the actual source links; distinguish correct mentions from unrelated people with the same name.

## Official references

- Google AI search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Console verification: https://support.google.com/webmasters/answer/9008080
- Bing webmaster guidelines: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a
- Bing sitemaps: https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed
- IndexNow documentation: https://www.indexnow.org/documentation

## Commands for maintenance

Run `python scripts/check_seo.py` before publishing. The “Notify IndexNow after deployment” workflow runs after successful GitHub Pages deployments; for a manual rerun, start that workflow or run `python scripts/submit_indexnow.py`. Keep the verification tags and public key file in place. Check the deployment and submission status rather than treating a push as proof of successful publication.
