import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title-wrapper")}>
      <a
        href="https://github.com/thakur-ro/thakur-ro.github.io"
        class="page-title-icon"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Source on GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="22"
          height="22"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </a>
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
    </div>
  )
}

PageTitle.css = `
.page-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.page-title-icon {
  display: flex;
  align-items: center;
  color: var(--darkgray);
  opacity: 0.6;
  transition: opacity 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  background: none !important;
  padding: 0 !important;
}

.page-title-icon:hover {
  opacity: 1;
  color: var(--secondary);
}

.page-title {
  font-size: 1.1rem;
  margin: 0;
  font-family: var(--titleFont);
  font-weight: 600;
  letter-spacing: -0.01em;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
