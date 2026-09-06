"""Assemble the offline HTML from editable sources; Python 3 stdlib only."""
from pathlib import Path
import json,base64
r=Path(__file__).resolve().parents[1]
assets={k:'data:image/png;base64,'+base64.b64encode((r/'assets'/f'{v}.png').read_bytes()).decode() for k,v in [('earth','earth'),('regions','regions'),('height','height')]}
data=json.loads((r/'assets/data.json').read_text(encoding='utf-8'))
s=(r/'src/index.template.html').read_text(encoding='utf-8').replace('/*STYLE*/',(r/'src/style.css').read_text(encoding='utf-8')).replace('/*SCRIPT*/',(r/'src/app.js').read_text(encoding='utf-8')).replace('/*DATA*/',json.dumps(data,ensure_ascii=False,separators=(',',':'))).replace('/*ASSETS*/',json.dumps(assets,separators=(',',':')))
(r/'dist').mkdir(exist_ok=True)
(r/'dist/index.html').write_text(s,encoding='utf-8')
print('Built',len(s),'characters')
