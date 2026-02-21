"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface GlobalContent {
  hero: { name: string; tagline: string; subtitle: string }
  about: {
    heading: string
    description: string
    descriptionSecondary: string
    stats: { value: string; label: string }[]
  }
  contact: {
    heading: string
    description: string
    email: string
    socialLinks: { label: string; href: string }[]
  }
  marquee: { skills: string[] }
  metadata: { title: string; description: string }
}

interface Project {
  id: string
  title: string
  category: string
  year: string
  image: string
  videoId: string
  description: string
  isShort: boolean
}

interface ShortProject {
  id: string
  title: string
  videoId: string
  category: string
}

const fetchOpts = { credentials: "include" as const }

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [globalContent, setGlobalContent] = useState<GlobalContent | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [shorts, setShorts] = useState<ShortProject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editingShort, setEditingShort] = useState<string | null>(null)
  const [newProject, setNewProject] = useState<Partial<Project>>({})
  const [newShort, setNewShort] = useState<Partial<ShortProject>>({})

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check", fetchOpts)
      const data = await res.json()
      setAuthenticated(data.authenticated)
      if (data.authenticated) fetchAll()
      else setLoading(false)
    } catch {
      setAuthenticated(false)
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      setAuthenticated(true)
      setPassword("")
      fetchAll()
    } else {
      setLoginError(data.error || "Invalid password")
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setAuthenticated(false)
    setGlobalContent(null)
    setProjects([])
    setShorts([])
  }

  async function fetchAll() {
    setLoading(true)
    try {
      const [globalRes, projectsRes, shortsRes] = await Promise.all([
        fetch("/api/content/global", fetchOpts),
        fetch("/api/content/projects", fetchOpts),
        fetch("/api/content/shorts", fetchOpts),
      ])
      if (globalRes.status === 401 || projectsRes.status === 401 || shortsRes.status === 401) {
        setAuthenticated(false)
        return
      }
      if (globalRes.ok) setGlobalContent(await globalRes.json())
      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (shortsRes.ok) setShorts(await shortsRes.json())
    } finally {
      setLoading(false)
    }
  }

  async function saveGlobal() {
    if (!globalContent) return
    setSaving("global")
    try {
      const res = await fetch("/api/content/global", {
        ...fetchOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalContent),
      })
      if (res.ok) alert("Saved!")
      else if (res.status === 401) setAuthenticated(false)
      else alert("Failed to save")
    } finally {
      setSaving(null)
    }
  }

  async function saveProject(id: string, project: Omit<Project, "id">) {
    setSaving(id)
    try {
      const res = await fetch(`/api/content/projects/${id}`, {
        ...fetchOpts,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      })
      if (res.ok) {
        setEditingProject(null)
        fetchAll()
      } else if (res.status === 401) setAuthenticated(false)
      else alert("Failed to save")
    } finally {
      setSaving(null)
    }
  }

  async function addProject() {
    if (!newProject.title || !newProject.videoId) {
      alert("Title and Video ID required")
      return
    }
    setSaving("new-project")
    try {
      const res = await fetch("/api/content/projects", {
        ...fetchOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProject.title,
          category: newProject.category || "",
          year: newProject.year || "2024",
          image: newProject.image || "",
          videoId: newProject.videoId,
          description: newProject.description || "",
          isShort: newProject.isShort ?? false,
        }),
      })
      if (res.ok) {
        setNewProject({})
        fetchAll()
      } else if (res.status === 401) setAuthenticated(false)
      else alert("Failed to add")
    } finally {
      setSaving(null)
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return
    const res = await fetch(`/api/content/projects/${id}`, { ...fetchOpts, method: "DELETE" })
    if (res.ok) fetchAll()
    else if (res.status === 401) setAuthenticated(false)
  }

  async function saveShort(id: string, short: Omit<ShortProject, "id">) {
    setSaving(id)
    try {
      const res = await fetch(`/api/content/shorts/${id}`, {
        ...fetchOpts,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(short),
      })
      if (res.ok) {
        setEditingShort(null)
        fetchAll()
      } else if (res.status === 401) setAuthenticated(false)
      else alert("Failed to save")
    } finally {
      setSaving(null)
    }
  }

  async function addShort() {
    if (!newShort.title || !newShort.videoId) {
      alert("Title and Video ID required")
      return
    }
    setSaving("new-short")
    try {
      const res = await fetch("/api/content/shorts", {
        ...fetchOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newShort.title,
          videoId: newShort.videoId,
          category: newShort.category || "",
        }),
      })
      if (res.ok) {
        setNewShort({})
        fetchAll()
      } else if (res.status === 401) setAuthenticated(false)
      else alert("Failed to add")
    } finally {
      setSaving(null)
    }
  }

  async function deleteShort(id: string) {
    if (!confirm("Delete this short?")) return
    const res = await fetch(`/api/content/shorts/${id}`, { ...fetchOpts, method: "DELETE" })
    if (res.ok) fetchAll()
    else if (res.status === 401) setAuthenticated(false)
  }

  if (authenticated === null || (authenticated && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <p className="text-sm text-muted-foreground">Enter password to access content admin</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  autoFocus
                />
              </div>
              {loginError && (
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold">Content Admin</h1>
            <p className="text-sm text-muted-foreground">Edit your portfolio content</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">View Site</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="global">
          <TabsList className="mb-6">
            <TabsTrigger value="global">Site Settings</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            {globalContent && (
              <Card>
                <CardHeader>
                  <CardTitle>Hero, About, Contact & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <Label>Hero Name</Label>
                    <Input
                      value={globalContent.hero.name}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          hero: { ...globalContent.hero, name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Tagline</Label>
                    <Input
                      value={globalContent.hero.tagline}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          hero: { ...globalContent.hero, tagline: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Input
                      value={globalContent.hero.subtitle}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          hero: { ...globalContent.hero, subtitle: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>About Description</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      value={globalContent.about.description}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          about: { ...globalContent.about, description: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>About Stats (one per line: Value|Label)</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono"
                      placeholder="4+|Years Experience&#10;6+|Tools Mastered"
                      value={globalContent.about.stats.map((s) => `${s.value}|${s.label}`).join("\n")}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          about: {
                            ...globalContent.about,
                            stats: e.target.value
                              .split("\n")
                              .filter(Boolean)
                              .map((line) => {
                                const [value, label] = line.split("|")
                                return { value: value?.trim() || "", label: label?.trim() || "" }
                              }),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>About Secondary</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      value={globalContent.about.descriptionSecondary}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          about: { ...globalContent.about, descriptionSecondary: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marquee Skills (comma-separated)</Label>
                    <Input
                      value={globalContent.marquee.skills.join(", ")}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          marquee: {
                            skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Heading</Label>
                    <Input
                      value={globalContent.contact.heading}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          contact: { ...globalContent.contact, heading: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Description</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      value={globalContent.contact.description}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          contact: { ...globalContent.contact, description: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      value={globalContent.contact.email}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          contact: { ...globalContent.contact, email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Social Links (one per line: Label|URL)</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono text-sm"
                      placeholder="Instagram|https://instagram.com/...&#10;LinkedIn|https://linkedin.com/..."
                      value={globalContent.contact.socialLinks
                        .map((l) => `${l.label}|${l.href}`)
                        .join("\n")}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          contact: {
                            ...globalContent.contact,
                            socialLinks: e.target.value
                              .split("\n")
                              .filter(Boolean)
                              .map((line) => {
                                const [label, href] = line.split("|")
                                return { label: label?.trim() || "", href: href?.trim() || "" }
                              }),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Site Title</Label>
                    <Input
                      value={globalContent.metadata.title}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          metadata: { ...globalContent.metadata, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      value={globalContent.metadata.description}
                      onChange={(e) =>
                        setGlobalContent({
                          ...globalContent,
                          metadata: { ...globalContent.metadata, description: e.target.value },
                        })
                      }
                    />
                  </div>
                  <Button onClick={saveGlobal} disabled={saving === "global"}>
                    {saving === "global" ? "Saving..." : "Save All"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Project title"
                        value={newProject.title || ""}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        placeholder="e.g. After Effects"
                        value={newProject.category || ""}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        placeholder="2024"
                        value={newProject.year || ""}
                        onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube Video ID</Label>
                      <Input
                        placeholder="e.g. dQw4w9WgXcQ"
                        value={newProject.videoId || ""}
                        onChange={(e) => setNewProject({ ...newProject, videoId: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Project description"
                      value={newProject.description || ""}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="new-isShort"
                      checked={newProject.isShort ?? false}
                      onChange={(e) => setNewProject({ ...newProject, isShort: e.target.checked })}
                    />
                    <Label htmlFor="new-isShort">Short format (9:16)</Label>
                  </div>
                  <Button onClick={addProject} disabled={saving === "new-project"}>
                    {saving === "new-project" ? "Adding..." : "Add Project"}
                  </Button>
                </CardContent>
              </Card>

              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex gap-2">
                      {editingProject === project.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              saveProject(project.id, {
                                title: project.title,
                                category: project.category,
                                year: project.year,
                                image: project.image,
                                videoId: project.videoId,
                                description: project.description,
                                isShort: project.isShort,
                              })
                            }
                            disabled={saving === project.id}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProject(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingProject(project.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}>
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  {editingProject === project.id ? (
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={project.title}
                            onChange={(e) =>
                              setProjects(
                                projects.map((p) => (p.id === project.id ? { ...p, title: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            value={project.category}
                            onChange={(e) =>
                              setProjects(
                                projects.map((p) => (p.id === project.id ? { ...p, category: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            value={project.year}
                            onChange={(e) =>
                              setProjects(
                                projects.map((p) => (p.id === project.id ? { ...p, year: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Video ID</Label>
                          <Input
                            value={project.videoId}
                            onChange={(e) =>
                              setProjects(
                                projects.map((p) => (p.id === project.id ? { ...p, videoId: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <textarea
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          value={project.description}
                          onChange={(e) =>
                            setProjects(
                              projects.map((p) =>
                                p.id === project.id ? { ...p, description: e.target.value } : p
                              )
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={project.isShort}
                          onChange={(e) =>
                            setProjects(
                              projects.map((p) =>
                                p.id === project.id ? { ...p, isShort: e.target.checked } : p
                              )
                            )
                          }
                        />
                        <Label>Short format (9:16)</Label>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{project.category} · {project.year}</p>
                      <p className="mt-2 text-sm">{project.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shorts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Short</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Short title"
                        value={newShort.title || ""}
                        onChange={(e) => setNewShort({ ...newShort, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube Video ID</Label>
                      <Input
                        placeholder="e.g. dQw4w9WgXcQ"
                        value={newShort.videoId || ""}
                        onChange={(e) => setNewShort({ ...newShort, videoId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        placeholder="e.g. Social Content"
                        value={newShort.category || ""}
                        onChange={(e) => setNewShort({ ...newShort, category: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={addShort} disabled={saving === "new-short"}>
                    {saving === "new-short" ? "Adding..." : "Add Short"}
                  </Button>
                </CardContent>
              </Card>

              {shorts.map((short) => (
                <Card key={short.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{short.title}</CardTitle>
                    <div className="flex gap-2">
                      {editingShort === short.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              saveShort(short.id, {
                                title: short.title,
                                videoId: short.videoId,
                                category: short.category,
                              })
                            }
                            disabled={saving === short.id}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingShort(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingShort(short.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteShort(short.id)}>
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  {editingShort === short.id ? (
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={short.title}
                            onChange={(e) =>
                              setShorts(shorts.map((s) => (s.id === short.id ? { ...s, title: e.target.value } : s)))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Video ID</Label>
                          <Input
                            value={short.videoId}
                            onChange={(e) =>
                              setShorts(shorts.map((s) => (s.id === short.id ? { ...s, videoId: e.target.value } : s)))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            value={short.category}
                            onChange={(e) =>
                              setShorts(shorts.map((s) => (s.id === short.id ? { ...s, category: e.target.value } : s)))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{short.category}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
