const REPO = "thakur-ro/thakur-ro.github.io"
const BRANCH = "main"

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { title, body } = req.body
  if (!title || !body) return res.status(400).json({ error: "title and body are required" })

  const token = process.env.NOTES_PAT
  if (!token) return res.status(500).json({ error: "NOTES_PAT not configured on server" })

  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 5).replace(":", "-")
  const filename = `raw-notes/${date}-${time}-${slugify(title)}.md`
  const content = `---\ntitle: "${title}"\ndate: ${date}\nstatus: raw\n---\n\n${body}\n`

  const ghRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `raw note: ${title}`,
      content: Buffer.from(content).toString("base64"),
      branch: BRANCH,
    }),
  })

  const data = await ghRes.json()
  if (ghRes.ok) {
    return res.status(200).json({ ok: true, path: filename })
  } else {
    return res.status(ghRes.status).json({ error: data.message })
  }
}
