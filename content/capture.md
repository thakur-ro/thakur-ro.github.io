---
title: Capture Note
tags: []
---

# Capture Note

Dump raw thoughts here — lecture notes, ideas, fragments. Lands in `raw-notes/` and gets refined into a proper note later with Claude Code.

<div id="capture-app" style="margin-top:1.5rem">

<div id="config-section" style="display:none; margin-bottom:1.5rem; padding:1rem; border:1px solid var(--lightgray); border-radius:8px; background:var(--lightgray)">
  <p style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--gray)">API endpoint (Vercel deployment URL)</p>
  <div style="display:flex; gap:0.5rem">
    <input id="api-url" type="text" placeholder="https://your-project.vercel.app/api/capture"
      style="flex:1; padding:0.5rem 0.75rem; border:1px solid var(--lightgray); border-radius:6px; font-size:0.9rem; background:var(--light); color:var(--darkgray); font-family:var(--codeFont)" />
    <button id="save-config-btn" style="padding:0.5rem 1rem; background:var(--secondary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.85rem; font-weight:600">Save</button>
  </div>
</div>

<form id="capture-form">
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
    <button type="button" id="toggle-config-btn"
      style="padding:0.6rem 1rem; background:transparent; color:var(--gray); border:1px solid var(--lightgray); border-radius:6px; cursor:pointer; font-size:0.85rem">
      ⚙ Settings
    </button>
    <span id="submit-status" style="font-size:0.85rem; color:var(--gray)"></span>
  </div>
</form>

</div>

<script>
(function() {
  const API_URL = "https://thakur-ro-github-io.vercel.app/api/capture"

  function init() {
    const form = document.getElementById("capture-form")
    const toggleBtn = document.getElementById("toggle-config-btn")
    const saveConfigBtn = document.getElementById("save-config-btn")
    const configSection = document.getElementById("config-section")
    const apiUrlInput = document.getElementById("api-url")

    if (!form) return

    toggleBtn.addEventListener("click", function() {
      const visible = configSection.style.display !== "none"
      configSection.style.display = visible ? "none" : "block"
      if (!visible) apiUrlInput.value = localStorage.getItem("capture_api_url") || ""
    })

    saveConfigBtn.addEventListener("click", function() {
      const url = apiUrlInput.value.trim()
      if (url) localStorage.setItem("capture_api_url", url)
      configSection.style.display = "none"
    })

    form.addEventListener("submit", async function(e) {
      e.preventDefault()
      const apiUrl = localStorage.getItem("capture_api_url") || API_URL
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
          status.textContent = "✓ Saved"
          status.style.color = "#5aaa5a"
          document.getElementById("note-title").value = ""
          document.getElementById("note-body").value = ""
        } else {
          status.textContent = "✗ " + data.error
          status.style.color = "#cc6666"
        }
      } catch(err) {
        status.textContent = "✗ Network error"
        status.style.color = "#cc6666"
      }

      btn.disabled = false
    })
  }

  document.addEventListener("DOMContentLoaded", init)
  document.addEventListener("nav", init)
})()
</script>
