import {
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  Sparkles
} from "lucide-react";
import { getAssetUrl } from "../services/api.js";

function initials(name = "P") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-3xl font-bold text-zinc-950 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function PortfolioRenderer({ portfolio, user }) {
  const profile = portfolio?.profile || {};
  const contact = portfolio?.contact || {};
  const projects = portfolio?.projects || [];
  const skills = portfolio?.skills || [];
  const experiences = portfolio?.experiences || [];
  const displayName = profile.fullName || user?.username || "Portfolio";
  const avatarUrl = getAssetUrl(profile.profileImage);
  const resumeUrl = getAssetUrl(profile.resume);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <nav className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-950 dark:text-white">
            {displayName}
          </a>
          <div className="hidden items-center gap-5 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
            <a href="#about" className="hover:text-emerald-600">About</a>
            <a href="#projects" className="hover:text-emerald-600">Projects</a>
            <a href="#skills" className="hover:text-emerald-600">Skills</a>
            <a href="#experience" className="hover:text-emerald-600">Experience</a>
            <a href="#contact" className="hover:text-emerald-600">Contact</a>
          </div>
        </div>
      </nav>

      <header id="top" className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Sparkles size={16} />
              @{user?.username}
            </div>
            <h1 className="text-5xl font-black leading-tight text-zinc-950 dark:text-white sm:text-6xl">
              {displayName}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
              {profile.title || "Creative Developer"}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {profile.bio || "A modern portfolio built with Portfolio Builder."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700" href="#projects">
                View work
                <ExternalLink size={17} />
              </a>
              {resumeUrl ? (
                <a className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900" href={resumeUrl} target="_blank" rel="noreferrer">
                  Resume
                  <Download size={17} />
                </a>
              ) : null}
            </div>
          </div>

          <div className="animate-rise rounded-lg border border-zinc-200 bg-white p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ) : (
              <div className="grid aspect-square w-full place-items-center rounded-lg bg-gradient-to-br from-emerald-500 via-sky-500 to-rose-500 text-7xl font-black text-white">
                {initials(displayName)}
              </div>
            )}
          </div>
        </div>
      </header>

      <Section id="about" title="About">
        <p className="max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          {profile.bio || "Add your story from the dashboard to make this section your own."}
        </p>
      </Section>

      <Section id="projects" title="Projects">
        {projects.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project._id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
                {project.image ? (
                  <img
                    src={getAssetUrl(project.image)}
                    alt={project.title}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.techStack || []).map((tech) => (
                      <span key={tech} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.liveLink ? (
                      <a className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300" href={project.liveLink} target="_blank" rel="noreferrer">
                        Live <ExternalLink size={16} />
                      </a>
                    ) : null}
                    {project.githubLink ? (
                      <a className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200" href={project.githubLink} target="_blank" rel="noreferrer">
                        Code <Github size={16} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">Projects will appear here once they are added.</p>
        )}
      </Section>

      <Section id="skills" title="Skills">
        {skills.length ? (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span key={skill._id} className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-bold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                {skill.name}
                {skill.level ? <span className="ml-2 text-emerald-600 dark:text-emerald-300">{skill.level}</span> : null}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">Skills will appear here once they are added.</p>
        )}
      </Section>

      <Section id="experience" title="Experience">
        {experiences.length ? (
          <div className="grid gap-4">
            {experiences.map((item) => (
              <article key={item._id} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{item.role}</h3>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {item.organization}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.duration}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">Experience and education will appear here once added.</p>
        )}
      </Section>

      <Section id="contact" title="Contact">
        <div className="grid gap-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 sm:grid-cols-2">
          {contact.email ? (
            <a className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition hover:border-emerald-400 dark:border-zinc-800" href={`mailto:${contact.email}`}>
              <Mail className="text-emerald-600" size={19} /> {contact.email}
            </a>
          ) : null}
          {contact.phone ? (
            <a className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition hover:border-emerald-400 dark:border-zinc-800" href={`tel:${contact.phone}`}>
              <Phone className="text-emerald-600" size={19} /> {contact.phone}
            </a>
          ) : null}
          {contact.linkedin ? (
            <a className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition hover:border-emerald-400 dark:border-zinc-800" href={contact.linkedin} target="_blank" rel="noreferrer">
              <Linkedin className="text-emerald-600" size={19} /> LinkedIn
            </a>
          ) : null}
          {contact.github ? (
            <a className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition hover:border-emerald-400 dark:border-zinc-800" href={contact.github} target="_blank" rel="noreferrer">
              <Github className="text-emerald-600" size={19} /> GitHub
            </a>
          ) : null}
        </div>
      </Section>
    </main>
  );
}
