import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const CaptureForm: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "capture") return null

  return (
    <div id="capture-app" style="margin-top: 1.5rem">
      <div id="capture-status-bar" style="display:none; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.95rem; font-weight: 500"></div>

      <div id="config-section" style="display:none; margin-bottom:1.5rem; padding:1rem; border:1px solid var(--lightgray); border-radius:8px; background:var(--lightgray)">
        <p style="margin:0 0 0.5rem; font-size:0.85rem; color:var(--gray)">API endpoint (override default)</p>
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
          <textarea id="note-body" placeholder="Raw thoughts, fragments, bullet points — anything goes..." required rows={12}
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
        </div>
      </form>
    </div>
  )
}

CaptureForm.afterDOMLoaded = `
const API_URL = "https://thakur-ro-github-io.vercel.app/api/capture"

function initCaptureForm() {
  const form = document.getElementById("capture-form")
  if (!form) return

  const statusBar = document.getElementById("capture-status-bar")
  const toggleBtn = document.getElementById("toggle-config-btn")
  const saveConfigBtn = document.getElementById("save-config-btn")
  const configSection = document.getElementById("config-section")
  const apiUrlInput = document.getElementById("api-url")

  function showStatus(msg, type) {
    statusBar.textContent = msg
    statusBar.style.display = "block"
    if (type === "success") {
      statusBar.style.background = "color-mix(in srgb, #5aaa5a 12%, transparent)"
      statusBar.style.border = "1px solid #5aaa5a"
      statusBar.style.color = "#2d7a2d"
    } else if (type === "error") {
      statusBar.style.background = "color-mix(in srgb, #cc6666 12%, transparent)"
      statusBar.style.border = "1px solid #cc6666"
      statusBar.style.color = "#993333"
    } else {
      statusBar.style.background = "var(--lightgray)"
      statusBar.style.border = "1px solid var(--lightgray)"
      statusBar.style.color = "var(--gray)"
    }
  }

  toggleBtn.addEventListener("click", function() {
    const visible = configSection.style.display !== "none"
    configSection.style.display = visible ? "none" : "block"
    if (!visible) apiUrlInput.value = localStorage.getItem("capture_api_url") || ""
  })

  saveConfigBtn.addEventListener("click", function() {
    const url = apiUrlInput.value.trim()
    if (url) localStorage.setItem("capture_api_url", url)
    configSection.style.display = "none"
    showStatus("API endpoint saved", "success")
  })

  form.addEventListener("submit", async function(e) {
    e.preventDefault()
    const apiUrl = localStorage.getItem("capture_api_url") || API_URL
    const title = document.getElementById("note-title").value.trim()
    const body = document.getElementById("note-body").value.trim()
    const btn = document.getElementById("submit-btn")

    btn.disabled = true
    showStatus("Saving...", "info")

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      })
      const data = await res.json()
      if (res.ok) {
        showStatus("✓ Saved to raw-notes/" + data.path.split("/").pop(), "success")
        document.getElementById("note-title").value = ""
        document.getElementById("note-body").value = ""
      } else {
        showStatus("✗ " + data.error, "error")
      }
    } catch(err) {
      showStatus("✗ Network error — check console", "error")
      console.error(err)
    }

    btn.disabled = false
  })
}

document.addEventListener("nav", initCaptureForm)
initCaptureForm()
`

export default (() => CaptureForm) satisfies QuartzComponentConstructor
