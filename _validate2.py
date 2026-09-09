"""Validacao final Frotamais producao."""
import json, os
from playwright.sync_api import sync_playwright

BASE = "https://frotamais.expostacker.com.br"
WIDTHS = [360, 375, 390, 430, 768, 1024, 1366, 1440, 1920]
OUT = r"C:\PROJETOS\EXPOSTACKER\frotamais\_shots"
os.makedirs(OUT, exist_ok=True)
res = {"bp": {}, "console": [], "login": None, "routes": {}}

with sync_playwright() as p:
    try:
        b = p.chromium.launch(headless=True)
    except Exception:
        b = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
    ctx = b.new_context()
    page = ctx.new_page()
    page.on("console", lambda m: res["console"].append(m.text[:150]) if m.type == "error" else None)
    page.on("pageerror", lambda e: res["console"].append(str(e)[:150]))

    for w in WIDTHS:
        page.set_viewport_size({"width": w, "height": 800})
        page.goto(BASE, wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(1000)
        ov = page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
        res["bp"][w] = "overflow" if ov else "ok"

    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(BASE, wait_until="networkidle", timeout=45000)
    page.wait_for_timeout(1200)
    page.screenshot(path=f"{OUT}\\after_home.png")

    page.goto(BASE + "/sign-in", wait_until="networkidle", timeout=45000)
    btn = page.locator('button:has-text("demonstra")').first
    if btn.count():
        btn.click(); page.wait_for_timeout(6000)
        res["login"] = page.url
        page.screenshot(path=f"{OUT}\\after_dash.png")
        for r in ["/app/vehicles","/app/drivers","/app/routes","/app/fuel","/app/maintenance","/app/alerts","/app/inspections","/app/geofences","/app/reports","/app/users"]:
            try:
                page.goto(BASE + r, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(900)
                ov = page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
                res["routes"][r] = "overflow" if ov else "ok"
            except Exception as e:
                res["routes"][r] = str(e)[:80]
    else:
        res["login"] = "botao demo nao encontrado"
    b.close()

print(json.dumps(res, indent=1, ensure_ascii=False))
