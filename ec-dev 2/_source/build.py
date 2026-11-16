import re, pathlib, shutil
HERE=pathlib.Path(__file__).resolve().parent; S=HERE; D=HERE.parent; D.mkdir(exist_ok=True)
MOD=S/'mod'
def mod(n,ext):
    p=MOD/f'{n}.{ext}'; return p.read_text() if p.exists() else ''
for p in sorted((S/'pages').glob('*.html')):
    t=p.read_text()
    title=re.search(r'<!--\s*title:\s*(.*?)\s*-->',t).group(1)
    m=re.search(r'<!--\s*use:\s*(.*?)\s*-->',t); use=['icons','core']+([x.strip() for x in m.group(1).split(',')] if m else [])
    css='\n'.join(mod(u,'css') for u in use); js='\n'.join(mod(u,'js') for u in use)
    styles='\n'.join(re.findall(r'<style>(.*?)</style>',t,re.S)); scripts='\n'.join(re.findall(r'<script>(.*?)</script>',t,re.S))
    body=re.sub(r'<!--\s*(title|use):.*?-->|<style>.*?</style>|<script>.*?</script>','',t,flags=re.S).strip()
    (D/p.name).write_text(f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
{css}
/* ===== このページ ===== */
{styles}
</style>
</head>
<body>
<div id="pg"><main id="app">
{body}
</main></div>
<script>
{js}
</script>
<script>
/* ===== このページの処理 ===== */
{scripts}
</script>
</body>
</html>
''')
icons=(S/'mod'/'icons.js').read_text()
(D/'main.html').write_text((S/'main.html').read_text().replace('/*ICONS*/',icons))
for f in ['index.html','icon.png']:
    if (S/f).exists(): shutil.copy(S/f,D/f)
print('built',len(list(D.glob('*.html'))))
