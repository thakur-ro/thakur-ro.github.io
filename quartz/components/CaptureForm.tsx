import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const CaptureForm: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "capture") return null

  return (
    <div id="capture-app">
      <div id="capture-status-bar"></div>

      <form id="capture-form">
        <div class="capture-field">
          <label class="capture-label" for="note-title">📌 Topic</label>
          <input
            id="note-title"
            type="text"
            placeholder="e.g. ODSC talk on GraphRAG, quick idea about memory compression..."
            required
            autocomplete="off"
          />
        </div>

        <div class="capture-field">
          <label class="capture-label" for="note-body">🧠 Raw thoughts</label>
          <textarea
            id="note-body"
            placeholder={"Fragments, bullet points, half-formed ideas — anything goes.\nYou'll refine this later with Claude Code."}
            required
            rows={14}
          ></textarea>
        </div>

        <div class="capture-actions">
          <button type="submit" id="submit-btn" class="capture-btn-primary">
            💾 Save to raw-notes
          </button>
          <button type="button" id="toggle-config-btn" class="capture-btn-ghost">
            ⚙
          </button>
        </div>
      </form>

      <div id="config-section">
        <p class="capture-label">API endpoint (override default)</p>
        <div class="capture-config-row">
          <input id="api-url" type="text" placeholder="https://your-project.vercel.app/api/capture" />
          <button id="save-config-btn" class="capture-btn-primary" style="white-space:nowrap">Save</button>
        </div>
        <p class="capture-label" style="margin-top:0.75rem">Secret key</p>
        <div class="capture-config-row">
          <input id="capture-secret" type="password" placeholder="Same value as CAPTURE_SECRET in Vercel" />
          <button id="save-secret-btn" class="capture-btn-primary" style="white-space:nowrap">Save</button>
        </div>
      </div>
    </div>
  )
}

CaptureForm.css = `
#capture-app {
  margin-top: 2rem;
}

#capture-status-bar {
  display: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid transparent;
}

#capture-status-bar.success {
  background: color-mix(in srgb, #5aaa5a 10%, transparent);
  border-color: #5aaa5a;
  color: #2d7a2d;
}

#capture-status-bar.error {
  background: color-mix(in srgb, #cc6666 10%, transparent);
  border-color: #cc6666;
  color: #993333;
}

#capture-status-bar.loading {
  background: var(--lightgray);
  border-color: var(--lightgray);
  color: var(--gray);
}

.capture-field {
  margin-bottom: 1.25rem;
}

.capture-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gray);
  margin-bottom: 0.4rem;
}

#capture-form input[type="text"],
#capture-form textarea,
#config-section input[type="text"] {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--lightgray);
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.6;
  background: var(--light);
  color: var(--darkgray);
  font-family: var(--bodyFont);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  resize: vertical;
}

#capture-form input[type="text"]:focus,
#capture-form textarea:focus,
#config-section input[type="text"]:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--secondary) 15%, transparent);
}

.capture-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-top: 0.25rem;
}

.capture-btn-primary {
  padding: 0.6rem 1.4rem;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--bodyFont);
  transition: opacity 0.15s ease;
}

.capture-btn-primary:hover { opacity: 0.85; }
.capture-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.capture-btn-ghost {
  padding: 0.6rem 0.85rem;
  background: transparent;
  color: var(--gray);
  border: 1.5px solid var(--lightgray);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: var(--bodyFont);
  transition: border-color 0.15s ease, color 0.15s ease;
}

.capture-btn-ghost:hover {
  border-color: var(--gray);
  color: var(--darkgray);
}

#config-section {
  display: none;
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border: 1.5px solid var(--lightgray);
  border-radius: 10px;
  background: var(--lightgray);
}

.capture-config-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
`

CaptureForm.afterDOMLoaded = `
const API_URL = "https://thakur-ro-github-io.vercel.app/api/capture"
let _captureAbort = null

function initCaptureForm() {
  const form = document.getElementById("capture-form")
  if (!form) return

  // Cancel any previously attached listeners before re-attaching
  if (_captureAbort) _captureAbort.abort()
  _captureAbort = new AbortController()
  const sig = { signal: _captureAbort.signal }

  const statusBar = document.getElementById("capture-status-bar")
  const toggleBtn = document.getElementById("toggle-config-btn")
  const saveConfigBtn = document.getElementById("save-config-btn")
  const saveSecretBtn = document.getElementById("save-secret-btn")
  const configSection = document.getElementById("config-section")
  const apiUrlInput = document.getElementById("api-url")
  const secretInput = document.getElementById("capture-secret")

  function showStatus(msg, type) {
    statusBar.textContent = msg
    statusBar.className = type
    statusBar.style.display = "block"
  }

  function hideStatus() {
    statusBar.style.display = "none"
    statusBar.className = ""
  }

  toggleBtn.addEventListener("click", function() {
    const visible = configSection.style.display === "block"
    configSection.style.display = visible ? "none" : "block"
    if (!visible) {
      apiUrlInput.value = localStorage.getItem("capture_api_url") || ""
      secretInput.value = ""
    }
  }, sig)

  saveConfigBtn.addEventListener("click", function() {
    const url = apiUrlInput.value.trim()
    if (url) localStorage.setItem("capture_api_url", url)
    configSection.style.display = "none"
    showStatus("✓ Settings saved", "success")
    setTimeout(hideStatus, 2000)
  }, sig)

  saveSecretBtn.addEventListener("click", function() {
    const secret = secretInput.value.trim()
    if (secret) localStorage.setItem("capture_secret", secret)
    secretInput.value = ""
    configSection.style.display = "none"
    showStatus("✓ Secret saved", "success")
    setTimeout(hideStatus, 2000)
  }, sig)

  form.addEventListener("submit", async function(e) {
    e.preventDefault()
    const apiUrl = localStorage.getItem("capture_api_url") || API_URL
    const secret = localStorage.getItem("capture_secret") || ""
    const title = document.getElementById("note-title").value.trim()
    const body = document.getElementById("note-body").value.trim()
    const btn = document.getElementById("submit-btn")

    btn.disabled = true
    showStatus("Saving...", "loading")

    try {
      const headers = { "Content-Type": "application/json" }
      if (secret) headers["x-capture-secret"] = secret

      const res = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ title, body }),
      })
      const data = await res.json()
      if (res.ok) {
        showStatus("✓ Added to inbox", "success")
        document.getElementById("note-title").value = ""
        document.getElementById("note-body").value = ""
        setTimeout(hideStatus, 4000)
      } else {
        showStatus("✗ " + data.error, "error")
      }
    } catch(err) {
      showStatus("✗ Network error — check console", "error")
      console.error(err)
    }

    btn.disabled = false
  }, sig)
}

document.addEventListener("nav", initCaptureForm)
initCaptureForm()
`

export default (() => CaptureForm) satisfies QuartzComponentConstructor
