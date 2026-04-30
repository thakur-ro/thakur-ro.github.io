---
title: Capture Note
tags: []
---

# Capture Note

Dump raw thoughts here — lecture notes, ideas, fragments. They'll land in `raw-notes/` and get refined into proper notes later with Claude Code.

<div id="capture-app">

<div id="token-section" style="margin-bottom:1.5rem; padding:1rem; border:1px solid var(--lightgray); border-radius:8px; background:var(--lightgray)">
  <p style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--gray)">
    GitHub token (stored locally, never sent anywhere except GitHub API)
  </p>
  <div style="display:flex; gap:0.5rem; align-items:center">
    <input id="gh-token" type="password" placeholder="github_pat_..." style="flex:1; padding:0.5rem 0.75rem; border:1px solid var(--lightgray); border-radius:6px; font-size:0.9rem; background:var(--light); color:var(--darkgray); font-family:var(--codeFont)" />
    <button onclick="saveToken()" style="padding:0.5rem 1rem; background:var(--secondary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.85rem; font-weight:600">Save</button>
  </div>
  <p id="token-status" style="margin:0.4rem 0 0; font-size:0.8rem; color:var(--gray)"></p>
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
  <div style="display:flex; gap:0.75rem; align-items:center">
    <button type="submit" id="submit-btn"
      style="padding:0.6rem 1.5rem; background:var(--secondary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.95rem; font-weight:600">
      Save Note
    </button>
    <span id="submit-status" style="font-size:0.85rem; color:var(--gray)"></span>
  </div>
</form>

</div>

<script>
const REPO = "thakur-ro/thakur-ro.github.io"
const BRANCH = "main"

function saveToken() {
  const t = document.getElementById("gh-token").value.trim()
  if (!t) return
  localStorage.setItem("gh_pat", t)
  document.getElementById("gh-token").value = ""
  document.getElementById("token-status").textContent = "✓ Token saved"
  document.getElementById("token-status").style.color = "#5aaa5a"
}

function loadToken() {
  const t = localStorage.getItem("gh_pat")
  if (t) {
    document.getElementById("token-status").textContent = "✓ Token loaded from storage"
    document.getElementById("token-status").style.color = "#5aaa5a"
  }
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)
}

async function submitNote(e) {
  e.preventDefault()
  const token = localStorage.getItem("gh_pat")
  if (!token) {
    document.getElementById("submit-status").textContent = "⚠ Save a GitHub token first"
    return
  }

  const title = document.getElementById("note-title").value.trim()
  const body = document.getElementById("note-body").value.trim()
  const btn = document.getElementById("submit-btn")
  const status = document.getElementById("submit-status")

  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 5).replace(":", "-")
  const filename = `raw-notes/${date}-${time}-${slugify(title)}.md`
  const content = `---\ntitle: "${title}"\ndate: ${date}\nstatus: raw\n---\n\n${body}\n`
  const encoded = btoa(unescape(encodeURIComponent(content)))

  btn.disabled = true
  status.textContent = "Saving..."

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: `raw note: ${title}`, content: encoded, branch: BRANCH }),
    })

    if (res.ok) {
      status.textContent = `✓ Saved as ${filename}`
      status.style.color = "#5aaa5a"
      document.getElementById("note-title").value = ""
      document.getElementById("note-body").value = ""
    } else {
      const err = await res.json()
      status.textContent = `✗ ${err.message}`
      status.style.color = "#cc6666"
    }
  } catch (err) {
    status.textContent = `✗ Network error`
    status.style.color = "#cc6666"
  }

  btn.disabled = false
}

document.addEventListener("DOMContentLoaded", loadToken)
</script>
