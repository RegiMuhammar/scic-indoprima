import subprocess
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MMD_PATH = os.path.join(BASE_DIR, "docs", "scic_unified_erd.mmd")
DIAGRAMS_DIR = os.path.join(BASE_DIR, "docs", "diagrams")
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

with open(MMD_PATH, "r", encoding="utf-8") as f:
    mmd_code = f.read()

html_template = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SCIC Unified ERD</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            background-color: #0b0f19;
            margin: 0;
            padding: 40px;
            display: inline-block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #diagram {
            background-color: #0f172a;
            padding: 40px;
            border-radius: 12px;
            border: 1px solid #1e293b;
        }
    </style>
</head>
<body>
    <div id="diagram" class="mermaid">
""" + mmd_code + """
    </div>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            themeVariables: {
                fontFamily: 'Segoe UI, sans-serif',
                primaryColor: '#1e293b',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#3b82f6',
                lineColor: '#60a5fa',
                secondaryColor: '#0f172a',
                tertiaryColor: '#1e1b4b'
            },
            er: {
                useMaxWidth: false
            }
        });
    </script>
</body>
</html>
"""

html_path = os.path.join(DIAGRAMS_DIR, "render_erd.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_template)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

out_png = os.path.join(DIAGRAMS_DIR, "scic_unified_data_model.png")

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=4200,3200",
    "--virtual-time-budget=6000",
    f"--screenshot={out_png}",
    f"file:///{html_path.replace(chr(92), '/')}"
]

print("Rendering ERD PNG using headless browser...")
res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Browser return code: {res.returncode}")

if os.path.exists(out_png):
    size = os.path.getsize(out_png)
    print(f"Successfully generated: {out_png} ({size:,} bytes)")
else:
    print("Failed to generate PNG.")
