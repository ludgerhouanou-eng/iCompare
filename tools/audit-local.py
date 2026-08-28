#!/usr/bin/env python3
"""Audit du site servi : les pages du build, leurs liens, leurs ancres, et les
formulations que le règlement d'affiliation et notre politique « zéro montant »
interdisent. Usage : python3 tools/audit-local.py [base]
"""
import pathlib
import re
import sys
import urllib.parse
import urllib.request
import urllib.error
import concurrent.futures as cf

A = pathlib.Path(__file__).resolve().parent.parent / ".next/server/app"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"


def urls_du_build():
    out = []
    for f in A.rglob("*.html"):
        rel = str(f.relative_to(A)).replace("\\", "/")[: -len(".html")]
        if rel == "_not-found":
            continue
        out.append("/" if rel == "index" else "/" + rel)
    return sorted(set(out))


def get(u):
    try:
        r = urllib.request.urlopen(BASE + u, timeout=25)
        return u, r.status, r.read().decode("utf8", "replace")
    except urllib.error.HTTPError as e:
        return u, e.code, ""
    except Exception:
        return u, 0, ""


def texte(h):
    corps = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", "", h)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", corps.replace("&#x27;", "'").replace("&amp;", "&")))


INTERDITS = [
    "en promo", "en ce moment", "meilleur prix", "prix les plus bas",
    "plus grosses économies", "meilleures économies", "iCompare.fr",
    "à moindre prix", "le plus abordable", "fois moins cher",
]

urls = urls_du_build()
with cf.ThreadPoolExecutor(8) as ex:
    res = list(ex.map(get, urls))
corpus = {u: b for u, c, b in res if b}
rat = [(u, c) for u, c, b in res if c != 200]

ids = {u: set(re.findall(r'\bid="([^"]+)"', h)) for u, h in corpus.items()}
casses = []
ancres = []
ressources = []
for u, h in corpus.items():
    for m in re.finditer(r'href="(?!https?://|mailto:)([^"]*)"', h):
        href = m.group(1)
        path, _, frag = href.partition("#")
        if re.match(r"^/(_next|phones|favicon|icon\.svg|robots\.txt|sitemap\.xml)", path):
            ressources.append((u, path.split("?")[0]))
        elif path.startswith("/"):
            cle = re.sub(r"^/\?", "", path.split("?")[0]).rstrip("/") or "/"
            if cle not in corpus:
                casses.append((u, href))
            if frag and frag not in ids.get(cle, set()):
                ancres.append((u, href))
        elif frag and frag not in ids.get(u, set()):
            ancres.append((u, href + " (même page)"))

tirs = []
for u, h in corpus.items():
    t = texte(h).lower()
    tirs += [(u, m) for m in INTERDITS if m in t]

euro = sum(len(re.findall(r"\d[,.]?\d*\s?\u20ac", texte(h))) for h in corpus.values())
instock = sum("InStock" in h for h in corpus.values())
offers = sum('"offers"' in h for h in corpus.values())
canonicals = []
for u, h in corpus.items():
    c = re.search(r'<link rel="canonical" href="([^"]+)"', h)
    if not c or not urllib.parse.urlparse(c.group(1)).path.rstrip("/") == u.rstrip("/"):
        canonicals.append((u, c and c.group(1)))
mots = sum(len(texte(h).split()) for h in corpus.values())

print(f"base testée      : {BASE}")
print(f"pages du build   : {len(corpus)} · hors 200 : {rat or 'aucun'}")
print(f"liens internes   : {casses or 'aucun cassé ✓'}")
print(f"ancres           : {ancres or 'aucune morte ✓'}")
print(f"canonical        : {canonicals or 'les 30 correspondent au chemin servi ✓'}")
print(f"montants servis  : {euro} €  · InStock : {instock}  · offers : {offers}")
print(f"formulations     : {tirs or 'aucune formulation interdite ✓'}")
print(f"mots visibles    : {mots}")
public = pathlib.Path(__file__).resolve().parent.parent / "public"
# Seuls les fichiers de public/ sont vérifiables ici : /_next/* est émis par le
# build, et icon.svg est fourni par app/icon.svg (géré par Next, pas par public/).
verifiables = [r for _, r in ressources if not r.startswith(("/_next", "/icon.svg", "/favicon"))]
absentes = sorted({r for r in verifiables if not (public / r.lstrip("/")).exists()})
print(f"ressources locales : {len(set(verifiables))} à fournir par public/ · absentes de public/ : {absentes or 'aucune ✓'}")
sys.exit(1 if (rat or absentes or casses or ancres or canonicals or tirs or euro or instock or offers) else 0)
