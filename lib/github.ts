const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_REPO = process.env.GITHUB_REPO! // e.g. "NiruuSan/portoflio"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

const BASE_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents`

async function getFileSha(filePath: string): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/${filePath}?ref=${GITHUB_BRANCH}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.sha ?? null
}

export async function githubWriteFile(
  filePath: string,
  content: object,
  message: string
): Promise<void> {
  const sha = await getFileSha(filePath)
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64")

  const body: Record<string, string> = {
    message,
    content: encoded,
    branch: GITHUB_BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(`${BASE_URL}/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub API error: ${err.message}`)
  }
}

export async function githubDeleteFile(
  filePath: string,
  message: string
): Promise<void> {
  const sha = await getFileSha(filePath)
  if (!sha) throw new Error("File not found")

  const res = await fetch(`${BASE_URL}/${filePath}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sha, branch: GITHUB_BRANCH }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub API error: ${err.message}`)
  }
}

export async function githubFileExists(filePath: string): Promise<boolean> {
  return (await getFileSha(filePath)) !== null
}
