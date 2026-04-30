const REPO = "thakur-ro/thakur-ro.github.io"
const BRANCH = "main"
const INBOX_PATH = "raw-notes/inbox.md"

async function appendToInbox(token, title, body, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    // Always fetch the latest SHA before writing
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${INBOX_PATH}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    let currentContent = ""
    let sha = undefined

    if (getRes.ok) {
      const data = await getRes.json()
      currentContent = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8")
      sha = data.sha
    } else if (getRes.status !== 404) {
      return { ok: false, status: getRes.status, error: "Failed to read inbox" }
    }

    const now = new Date()
    const timestamp = now.toISOString().replace("T", " ").slice(0, 16) + " UTC"
    const divider = currentContent ? "\n\n---\n\n" : ""
    const entry = `## ${title}\n*${timestamp}*\n\n${body}`
    const updated = currentContent + divider + entry + "\n"

    const putPayload = {
      message: `inbox: ${title}`,
      content: Buffer.from(updated).toString("base64"),
      branch: BRANCH,
    }
    if (sha) putPayload.sha = sha

    const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${INBOX_PATH}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(putPayload),
    })

    if (putRes.status === 409) continue // SHA changed between GET and PUT — retry
    const putData = await putRes.json()
    return { ok: putRes.ok, status: putRes.status, error: putData.message }
  }

  return { ok: false, status: 409, error: "Conflict after retries — try again" }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-capture-secret")

  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { title, body } = req.body
  if (!title || !body) return res.status(400).json({ error: "title and body are required" })

  const secret = process.env.CAPTURE_SECRET
  if (secret && req.headers["x-capture-secret"] !== secret) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = process.env.NOTES_PAT
  if (!token) return res.status(500).json({ error: "NOTES_PAT not configured on server" })

  const result = await appendToInbox(token, title, body)
  if (result.ok) {
    return res.status(200).json({ ok: true })
  } else {
    return res.status(result.status).json({ error: result.error })
  }
}
