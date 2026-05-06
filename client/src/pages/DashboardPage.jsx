import {
  BriefcaseBusiness,
  Check,
  Copy,
  Eye,
  FolderKanban,
  Github,
  GraduationCap,
  Linkedin,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Phone,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import InputField from "../components/InputField.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import SelectField from "../components/SelectField.jsx";
import TextAreaField from "../components/TextAreaField.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api, { getAssetUrl } from "../services/api.js";

const navItems = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "contact", label: "Contact", icon: Mail }
];

function normalizePortfolio(portfolio) {
  return {
    profile: {
      fullName: "",
      title: "",
      bio: "",
      profileImage: "",
      resume: "",
      ...(portfolio?.profile || {})
    },
    projects: portfolio?.projects || [],
    skills: portfolio?.skills || [],
    experiences: portfolio?.experiences || [],
    contact: {
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      ...(portfolio?.contact || {})
    },
    ...portfolio
  };
}

function Panel({ children }) {
  return (
    <section className="animate-rise rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      {children}
    </section>
  );
}

function Sidebar({ activeSection, setActiveSection, onClose }) {
  return (
    <nav className="grid gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return (
          <button
            key={item.id}
            className={`flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-bold transition ${
              active
                ? "bg-emerald-600 text-white dark:bg-emerald-500"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            type="button"
            onClick={() => {
              setActiveSection(item.id);
              onClose?.();
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
      {message}
    </div>
  );
}

function ProfilePanel({ portfolio, onSaved, onError }) {
  const [form, setForm] = useState(portfolio.profile);
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(portfolio.profile);
  }, [portfolio.profile]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    onError("");

    try {
      const data = new FormData();
      data.append("fullName", form.fullName || "");
      data.append("title", form.title || "");
      data.append("bio", form.bio || "");

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      if (resume) {
        data.append("resume", resume);
      }

      const response = await api.patch("/portfolio/profile", data);
      onSaved(response.data);
      setProfileImage(null);
      setResume(null);
    } catch (error) {
      onError(error.response?.data?.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel>
      <SectionHeader eyebrow="Profile" title="Personal details" />
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
          <div>
            <div className="grid aspect-square place-items-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
              {form.profileImage ? (
                <img
                  src={getAssetUrl(form.profileImage)}
                  alt={form.fullName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="text-zinc-400" size={48} />
              )}
            </div>
            <label className="mt-3 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
              <Upload size={16} />
              Image
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div className="grid gap-4">
            <InputField
              id="fullName"
              label="Full name"
              name="fullName"
              value={form.fullName || ""}
              onChange={updateField}
              placeholder="Your name"
            />
            <InputField
              id="title"
              label="Title"
              name="title"
              value={form.title || ""}
              onChange={updateField}
              placeholder="Frontend Developer"
            />
            <TextAreaField
              id="bio"
              label="Bio/About"
              name="bio"
              value={form.bio || ""}
              onChange={updateField}
              placeholder="Write a crisp introduction about your work."
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Resume PDF
              </span>
              <input
                className="block w-full rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 file:mr-4 file:h-11 file:border-0 file:bg-zinc-100 file:px-4 file:text-sm file:font-bold file:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-100"
                type="file"
                accept="application/pdf"
                onChange={(event) => setResume(event.target.files?.[0] || null)}
              />
              {form.resume ? (
                <a
                  className="mt-2 inline-block text-sm font-semibold text-emerald-700 dark:text-emerald-300"
                  href={getAssetUrl(form.resume)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Current resume
                </a>
              ) : null}
            </label>
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
          Save profile
        </Button>
      </form>
    </Panel>
  );
}

function ProjectsPanel({ portfolio, onSaved, onError }) {
  const blank = {
    title: "",
    description: "",
    techStack: "",
    liveLink: "",
    githubLink: ""
  };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function resetForm() {
    setForm(blank);
    setEditingId("");
    setImage(null);
  }

  function editProject(project) {
    setEditingId(project._id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      techStack: (project.techStack || []).join(", "),
      liveLink: project.liveLink || "",
      githubLink: project.githubLink || ""
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    onError("");

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) {
        data.append("image", image);
      }

      const response = editingId
        ? await api.patch(`/portfolio/projects/${editingId}`, data)
        : await api.post("/portfolio/projects", data);
      onSaved(response.data);
      resetForm();
    } catch (error) {
      onError(error.response?.data?.message || "Unable to save project");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(projectId) {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      const response = await api.delete(`/portfolio/projects/${projectId}`);
      onSaved(response.data);
    } catch (error) {
      onError(error.response?.data?.message || "Unable to delete project");
    }
  }

  return (
    <Panel>
      <SectionHeader eyebrow="Projects" title="Project library" />
      <form className="mb-8 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField id="projectTitle" label="Title" name="title" value={form.title} onChange={updateField} required />
          <InputField id="techStack" label="Tech stack" name="techStack" value={form.techStack} onChange={updateField} placeholder="React, Node, MongoDB" />
        </div>
        <TextAreaField id="projectDescription" label="Description" name="description" value={form.description} onChange={updateField} />
        <div className="grid gap-4 md:grid-cols-2">
          <InputField id="liveLink" label="Live link" name="liveLink" value={form.liveLink} onChange={updateField} placeholder="https://..." />
          <InputField id="githubLink" label="GitHub link" name="githubLink" value={form.githubLink} onChange={updateField} placeholder="https://github.com/..." />
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Project image
          </span>
          <input
            className="block w-full rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 file:mr-4 file:h-11 file:border-0 file:bg-zinc-100 file:px-4 file:text-sm file:font-bold file:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-100"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />}
            {editingId ? "Update project" : "Add project"}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      {portfolio.projects.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {portfolio.projects.map((project) => (
            <article key={project._id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              {project.image ? (
                <img
                  src={getAssetUrl(project.image)}
                  alt={project.title}
                  className="mb-4 aspect-video w-full rounded-lg object-cover"
                />
              ) : null}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-zinc-950 dark:text-white">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{project.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button aria-label="Edit project" title="Edit project" size="icon" variant="secondary" onClick={() => editProject(project)}>
                    <Pencil size={16} />
                  </Button>
                  <Button aria-label="Delete project" title="Delete project" size="icon" variant="danger" onClick={() => deleteProject(project._id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(project.techStack || []).map((tech) => (
                  <span key={tech} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No projects yet" message="Add your best work so it can appear on the public portfolio." />
      )}
    </Panel>
  );
}

function SkillsPanel({ portfolio, onSaved, onError }) {
  const [form, setForm] = useState({ name: "", level: "" });
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm({ name: "", level: "" });
    setEditingId("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    onError("");

    try {
      const response = editingId
        ? await api.patch(`/portfolio/skills/${editingId}`, form)
        : await api.post("/portfolio/skills", form);
      onSaved(response.data);
      resetForm();
    } catch (error) {
      onError(error.response?.data?.message || "Unable to save skill");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSkill(skillId) {
    try {
      const response = await api.delete(`/portfolio/skills/${skillId}`);
      onSaved(response.data);
    } catch (error) {
      onError(error.response?.data?.message || "Unable to delete skill");
    }
  }

  return (
    <Panel>
      <SectionHeader eyebrow="Skills" title="Skill set" />
      <form className="mb-8 grid gap-4 md:grid-cols-[1fr_220px_auto]" onSubmit={handleSubmit}>
        <InputField
          id="skillName"
          label="Skill"
          name="name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <SelectField
          id="skillLevel"
          label="Level"
          name="level"
          value={form.level}
          onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))}
        >
          <option value="">Optional</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </SelectField>
        <div className="flex items-end gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />}
            {editingId ? "Update" : "Add"}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              <X size={17} />
            </Button>
          ) : null}
        </div>
      </form>

      {portfolio.skills.length ? (
        <div className="flex flex-wrap gap-3">
          {portfolio.skills.map((skill) => (
            <span key={skill._id} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              {skill.name}
              {skill.level ? <span className="text-emerald-600 dark:text-emerald-300">{skill.level}</span> : null}
              <button
                aria-label="Edit skill"
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                type="button"
                onClick={() => {
                  setEditingId(skill._id);
                  setForm({ name: skill.name, level: skill.level || "" });
                }}
              >
                <Pencil size={14} />
              </button>
              <button
                aria-label="Delete skill"
                className="rounded-full p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/10"
                type="button"
                onClick={() => deleteSkill(skill._id)}
              >
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <EmptyState title="No skills yet" message="Add core tools and strengths with optional levels." />
      )}
    </Panel>
  );
}

function ExperiencePanel({ portfolio, onSaved, onError }) {
  const blank = { organization: "", role: "", duration: "", description: "" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function resetForm() {
    setForm(blank);
    setEditingId("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    onError("");

    try {
      const response = editingId
        ? await api.patch(`/portfolio/experiences/${editingId}`, form)
        : await api.post("/portfolio/experiences", form);
      onSaved(response.data);
      resetForm();
    } catch (error) {
      onError(error.response?.data?.message || "Unable to save experience");
    } finally {
      setSaving(false);
    }
  }

  async function deleteExperience(experienceId) {
    try {
      const response = await api.delete(`/portfolio/experiences/${experienceId}`);
      onSaved(response.data);
    } catch (error) {
      onError(error.response?.data?.message || "Unable to delete experience");
    }
  }

  return (
    <Panel>
      <SectionHeader eyebrow="Experience" title="Experience and education" />
      <form className="mb-8 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField id="organization" label="Company/College name" name="organization" value={form.organization} onChange={updateField} required />
          <InputField id="role" label="Role" name="role" value={form.role} onChange={updateField} required />
        </div>
        <InputField id="duration" label="Duration" name="duration" value={form.duration} onChange={updateField} placeholder="2022 - Present" />
        <TextAreaField id="experienceDescription" label="Description" name="description" value={form.description} onChange={updateField} />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={17} /> : <GraduationCap size={17} />}
            {editingId ? "Update entry" : "Add entry"}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      {portfolio.experiences.length ? (
        <div className="grid gap-4">
          {portfolio.experiences.map((item) => (
            <article key={item._id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-zinc-950 dark:text-white">{item.role}</h3>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{item.organization}</p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{item.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    aria-label="Edit entry"
                    title="Edit entry"
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(item._id);
                      setForm({
                        organization: item.organization || "",
                        role: item.role || "",
                        duration: item.duration || "",
                        description: item.description || ""
                      });
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button aria-label="Delete entry" title="Delete entry" size="icon" variant="danger" onClick={() => deleteExperience(item._id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No entries yet" message="Add work, education, internships, or certifications." />
      )}
    </Panel>
  );
}

function ContactPanel({ portfolio, onSaved, onError }) {
  const [form, setForm] = useState(portfolio.contact);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(portfolio.contact);
  }, [portfolio.contact]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    onError("");

    try {
      const response = await api.patch("/portfolio/contact", form);
      onSaved(response.data);
    } catch (error) {
      onError(error.response?.data?.message || "Unable to save contact details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel>
      <SectionHeader eyebrow="Contact" title="Public contact links" />
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField id="contactEmail" label="Email" name="email" type="email" value={form.email || ""} onChange={updateField} />
          <InputField id="phone" label="Phone" name="phone" value={form.phone || ""} onChange={updateField} />
          <InputField id="linkedin" label="LinkedIn" name="linkedin" value={form.linkedin || ""} onChange={updateField} placeholder="https://linkedin.com/in/..." />
          <InputField id="github" label="GitHub" name="github" value={form.github || ""} onChange={updateField} placeholder="https://github.com/..." />
        </div>
        <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 sm:grid-cols-2">
          <span className="flex items-center gap-2"><Mail size={16} /> {form.email || "Email"}</span>
          <span className="flex items-center gap-2"><Phone size={16} /> {form.phone || "Phone"}</span>
          <span className="flex items-center gap-2"><Linkedin size={16} /> LinkedIn</span>
          <span className="flex items-center gap-2"><Github size={16} /> GitHub</span>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
          Save contact
        </Button>
      </form>
    </Panel>
  );
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [portfolio, setLocalPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, logout, setPortfolio: setAuthPortfolio } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function loadPortfolio() {
      try {
        const { data } = await api.get("/portfolio/me");
        if (!ignore) {
          setLocalPortfolio(normalizePortfolio(data));
          setAuthPortfolio(data);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || "Unable to load portfolio");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      ignore = true;
    };
  }, [setAuthPortfolio]);

  const publicUrl = useMemo(() => {
    if (!user?.username) {
      return "";
    }
    return `${window.location.origin}/${user.username}`;
  }, [user?.username]);

  function handleSaved(updatedPortfolio) {
    const normalized = normalizePortfolio(updatedPortfolio);
    setLocalPortfolio(normalized);
    setAuthPortfolio(updatedPortfolio);
  }

  async function copyPublicUrl() {
    if (!publicUrl) {
      return;
    }
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const activePanel = {
    profile: portfolio ? <ProfilePanel portfolio={portfolio} onSaved={handleSaved} onError={setError} /> : null,
    projects: portfolio ? <ProjectsPanel portfolio={portfolio} onSaved={handleSaved} onError={setError} /> : null,
    skills: portfolio ? <SkillsPanel portfolio={portfolio} onSaved={handleSaved} onError={setError} /> : null,
    experience: portfolio ? <ExperiencePanel portfolio={portfolio} onSaved={handleSaved} onError={setError} /> : null,
    contact: portfolio ? <ContactPanel portfolio={portfolio} onSaved={handleSaved} onError={setError} /> : null
  }[activeSection];

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-zinc-200 bg-white px-4 py-5 dark:border-zinc-800 dark:bg-zinc-900 lg:block">
          <div className="mb-8 flex items-center justify-between">
            <Link className="text-lg font-black" to="/dashboard">
              Portfolio Builder
            </Link>
            <ThemeToggle />
          </div>
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Public URL</p>
            <p className="mt-2 break-all text-sm font-semibold text-zinc-800 dark:text-zinc-200">{publicUrl}</p>
            <div className="mt-4 flex gap-2">
              <Button size="icon" variant="secondary" aria-label="Copy public URL" title="Copy public URL" onClick={copyPublicUrl}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
              <Link to={`/${user.username}`} target="_blank" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800" aria-label="Open public portfolio" title="Open public portfolio">
                <Eye size={16} />
              </Link>
            </div>
          </div>
        </aside>

        <div>
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">@{user.username}</p>
                <h1 className="text-2xl font-black">Dashboard</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/preview" className="hidden h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-bold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:inline-flex">
                  <Eye size={17} />
                  Preview
                </Link>
                <Button aria-label="Logout" title="Logout" size="icon" variant="secondary" onClick={handleLogout}>
                  <LogOut size={17} />
                </Button>
                <div className="lg:hidden">
                  <ThemeToggle />
                </div>
                <Button aria-label="Open menu" title="Open menu" size="icon" variant="secondary" className="lg:hidden" onClick={() => setMenuOpen(true)}>
                  <Menu size={18} />
                </Button>
              </div>
            </div>
          </header>

          {menuOpen ? (
            <div className="fixed inset-0 z-40 bg-zinc-950/40 lg:hidden" onClick={() => setMenuOpen(false)}>
              <div className="h-full w-[min(82vw,320px)] bg-white p-5 shadow-soft dark:bg-zinc-900" onClick={(event) => event.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-black">Sections</span>
                  <Button aria-label="Close menu" title="Close menu" size="icon" variant="ghost" onClick={() => setMenuOpen(false)}>
                    <X size={18} />
                  </Button>
                </div>
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onClose={() => setMenuOpen(false)} />
                <Link to="/preview" className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-bold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                  <Eye size={17} />
                  Preview
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            <ErrorMessage message={error} />
            {loading ? (
              <div className="grid min-h-[50vh] place-items-center">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : (
              activePanel
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
