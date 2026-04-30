---
title: Capture Note
tags: []
---

# Capture Note

Dump raw thoughts here — lecture notes, ideas, fragments. Lands in `raw-notes/` and gets refined into a proper note later with Claude Code.

<div id="capture-app">

<div id="config-section" style="display:none; margin-bottom:1.5rem; padding:1rem; border:1px solid var(--lightgray); border-radius:8px; background:var(--lightgray)">
  <p style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--gray)">API endpoint (your Vercel deployment URL)</p>
  <div style="display:flex; gap:0.5rem">
    <input id="api-url" type="text" placeholder="https://your-project.vercel.app/api/capture"
      style="flex:1; padding:0.5rem 0.75rem; border:1px solid var(--lightgray); border-radius:6px; font-size:0.9rem; background:var(--light); color:var(--darkgray); font-family:var(--codeFont)" />
    <button onclick="saveConfig()" style="padding:0.5rem 1rem; background:var(--secondary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.85rem; font-weight:600">Save</button>
  </div>
</div>

<form id="capture-form" onsubmit="submitNote(event)">
  <div style="margin-bottom:1rem">
    <input id="note-title" type="text" placeholder="Title / topic (e.g. ODSC talk on GraphRAG)" required
      style="width:100%; box-sizing:border-box; padding:0.6rem 0.75rem; border:1px solid var(--lightgray); border-radius:6px; font-size:1rem; background:var(--light); color:var(--darkgray); font-family:var(--bodyFont)" />
  </div>
  <div style="margin-bottom:1rem">
    <textarea id="note-body" placeholder="Raw thoughts, fragments, bullet points — anything goes..." required rows="12"
      style="width:100%; box-sizing:border-box; padding:0.75rem; border:1px solid var(--lightgray); border-radius:6px; font-size:0.95rem; line-height:1.6; background:var(--light); color:var(--darkgray); font-family:var(--bodyFont); resize:vertical"></textarea>
  </div>
  <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap">
    <button type="submit" id="submit-btn"
      style="padding:0.6rem 1.5rem; background:var(--secondary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.95rem; font-weight:600">
      Save Note
    </button>
    <button type="button" onclick="toggleConfig()"
      style="padding:0.6rem 1rem; background:transparent; color:var(--gray); border:1px solid var(--lightgray); border-radius:6px; cursor:pointer; font-size:0.85rem">
      ⚙ Settings
    </button>
    <span id="submit-status" style="font-size:0.85rem; color:var(--gray)"></span>
  </div>
</form>

</div>

<script>
function toggleConfig() {
  const s = document.getElementById("config-section")
  s.style.display = s.style.display === "none" ? "block" : "none"
  const saved = localStorage.getItem("capture_api_url") || ""
  document.getElementById("api-url").value = saved
}

function saveConfig() {
  const url = document.getElementById("api-url").value.trim()
  if (url) localStorage.setItem("capture_api_url", url)
  document.getElementById("config-section").style.display = "none"
}

async function submitNote(e) {
  e.preventDefault()
  const apiUrl = localStorage.getItem("capture_api_url")
  if (!apiUrl) {
    document.getElementById("submit-status").textContent = "⚠ Set the API URL in ⚙ Settings first"
    return
  }

  const title = document.getElementById("note-title").value.trim()
  const body = document.getElementById("note-body").value.trim()
  const btn = document.getElementById("submit-btn")
  const status = document.getElementById("submit-status")

  btn.disabled = true
  status.textContent = "Saving..."
  status.style.color = "var(--gray)"

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    })
    const data = await res.json()
    if (res.ok) {
      status.textContent = `✓ Saved`
      status.style.color = "#5aaa5a"
      document.getElementById("note-title").value = ""
      document.getElementById("note-body").value = ""
    } else {
      status.textContent = `✗ ${data.error}`
      status.style.color = "#cc6666"
    }
  } catch {
    status.textContent = "✗ Network error"
    status.style.color = "#cc6666"
  }

  btn.disabled = false
}
</script>
