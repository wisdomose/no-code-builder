import {
  DEVICE_WIDTHS,
  useEditorStore,
  type EditorElement,
  type ElementLayout,
  type ElementStyle,
} from './useEditorStore'

export interface HtmlProjectDocumentV1 {
  version: 1
  exportedAt: string
  project: {
    name: string
  }
  document: {
    artboard: ReturnType<typeof useEditorStore.getState>['artboard']
    deviceMode: ReturnType<typeof useEditorStore.getState>['deviceMode']
    rootElements: ReturnType<typeof useEditorStore.getState>['rootElements']
    elements: ReturnType<typeof useEditorStore.getState>['elements']
  }
}

function buildTimestamp(date: Date) {
  return date.toISOString().replace(/[:.]/g, '-')
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inferDeviceMode(width: number): HtmlProjectDocumentV1['document']['deviceMode'] {
  if (width <= DEVICE_WIDTHS.mobile) return 'mobile'
  if (width <= DEVICE_WIDTHS.tablet) return 'tablet'
  return 'desktop'
}

function classList(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

function arbitrary(prefix: string, value?: string | number) {
  if (value === undefined || value === '') return undefined
  // Tailwind arbitrary values require underscores instead of spaces
  return `${prefix}-[${String(value).replace(/ /g, '_')}]`
}

function colorClass(prefix: string, value?: string) {
  if (!value) return undefined
  // Use named Tailwind class for transparent
  if (value === 'transparent') return `${prefix}-transparent`
  // Tailwind arbitrary values require underscores instead of spaces
  return `${prefix}-[${value.replace(/ /g, '_')}]`
}

function positionClasses(element: EditorElement, isRoot: boolean) {
  const absolute = isRoot || element.layout.position === 'absolute'
  return classList(
    absolute ? 'absolute' : 'relative',
    absolute ? arbitrary('left', `${element.layout.x ?? 0}px`) : undefined,
    absolute ? arbitrary('top', `${element.layout.y ?? 0}px`) : undefined,
  )
}

function sizeClasses(element: EditorElement) {
  return classList(
    element.layout.width === 'auto'
      ? 'w-auto'
      : element.layout.width === '100%'
        ? 'w-full'
        : arbitrary('w', `${element.layout.width}px`),
    element.layout.height === 'auto'
      ? 'h-auto'
      : element.layout.height === '100%'
        ? 'h-full'
        : arbitrary('h', `${element.layout.height}px`),
  )
}

function paddingClasses(padding?: number | string): Array<string | undefined | false> {
  if (padding === undefined) return []
  if (typeof padding === 'number') return [arbitrary('p', `${padding}px`)]

  // Handle CSS shorthand: "10px" | "10px 20px" | "10px 20px 30px" | "10px 20px 30px 40px"
  const parts = String(padding).trim().split(/\s+/)
  if (parts.length === 1) return [arbitrary('p', parts[0])]
  if (parts.length === 2) {
    // vertical horizontal
    return [arbitrary('py', parts[0]), arbitrary('px', parts[1])]
  }
  if (parts.length === 3) {
    // top horizontal bottom
    return [arbitrary('pt', parts[0]), arbitrary('px', parts[1]), arbitrary('pb', parts[2])]
  }
  // top right bottom left
  return [
    arbitrary('pt', parts[0]),
    arbitrary('pr', parts[1]),
    arbitrary('pb', parts[2]),
    arbitrary('pl', parts[3]),
  ]
}

function layoutClasses(element: EditorElement) {
  return classList(
    element.layout.display === 'flex'
      ? 'flex'
      : element.layout.display === 'grid'
        ? 'grid'
        : element.layout.display === 'block'
          ? 'block'
          : undefined,
    element.layout.flexDirection === 'row'
      ? 'flex-row'
      : element.layout.flexDirection === 'column'
        ? 'flex-col'
        : undefined,
    element.layout.flexWrap === 'wrap'
      ? 'flex-wrap'
      : element.layout.flexWrap === 'nowrap'
        ? 'flex-nowrap'
        : undefined,
    element.layout.gridTemplateColumns
      ? arbitrary('grid-cols', element.layout.gridTemplateColumns)
      : undefined,
    element.layout.gridTemplateRows
      ? arbitrary('grid-rows', element.layout.gridTemplateRows)
      : undefined,
    element.layout.alignItems === 'start'
      ? 'items-start'
      : element.layout.alignItems === 'center'
        ? 'items-center'
        : element.layout.alignItems === 'end'
          ? 'items-end'
          : element.layout.alignItems === 'stretch'
            ? 'items-stretch'
            : undefined,
    element.layout.justifyContent === 'start'
      ? 'justify-start'
      : element.layout.justifyContent === 'center'
        ? 'justify-center'
        : element.layout.justifyContent === 'end'
          ? 'justify-end'
          : element.layout.justifyContent === 'space-between'
            ? 'justify-between'
            : element.layout.justifyContent === 'space-around'
              ? 'justify-around'
              : element.layout.justifyContent === 'space-evenly'
                ? 'justify-evenly'
                : undefined,
    element.layout.gap !== undefined ? arbitrary('gap', `${element.layout.gap}px`) : undefined,
    ...paddingClasses(element.layout.padding),
    element.layout.overflow === 'hidden'
      ? 'overflow-hidden'
      : element.layout.overflow === 'auto'
        ? 'overflow-auto'
        : element.layout.overflow === 'scroll'
          ? 'overflow-scroll'
          : undefined,
    element.layout.zIndex !== undefined ? arbitrary('z', element.layout.zIndex) : undefined,
  )
}

function styleClasses(element: EditorElement) {
  const { style } = element
  return classList(
    colorClass('bg', style.background),
    style.backgroundSize === 'cover'
      ? 'bg-cover'
      : style.backgroundSize === 'contain'
        ? 'bg-contain'
        : style.backgroundSize === '100% 100%'
          ? arbitrary('bg-size', '100% 100%')
          : undefined,
    style.backgroundPosition ? arbitrary('bg-position', style.backgroundPosition) : undefined,
    style.backgroundRepeat === 'no-repeat'
      ? 'bg-no-repeat'
      : style.backgroundRepeat === 'repeat'
        ? 'bg-repeat'
        : style.backgroundRepeat === 'repeat-x'
          ? 'bg-repeat-x'
          : style.backgroundRepeat === 'repeat-y'
            ? 'bg-repeat-y'
            : undefined,
    style.borderRadius !== undefined
      ? style.borderRadius >= 999
        ? 'rounded-full'
        : arbitrary('rounded', `${style.borderRadius}px`)
      : undefined,
    style.borderWidth !== undefined ? arbitrary('border', `${style.borderWidth}px`) : undefined,
    style.borderColor ? colorClass('border', style.borderColor) : undefined,
    style.borderStyle === 'solid'
      ? 'border-solid'
      : style.borderStyle === 'dashed'
        ? 'border-dashed'
        : style.borderStyle === 'dotted'
          ? 'border-dotted'
          : style.borderStyle === 'double'
            ? 'border-double'
            : undefined,
    style.color ? colorClass('text', style.color) : undefined,
    style.fontSize !== undefined ? arbitrary('text', `${style.fontSize}px`) : undefined,
    style.fontWeight ? arbitrary('font', style.fontWeight) : undefined,
    style.fontStyle === 'normal'
      ? 'not-italic'
      : style.fontStyle === 'italic'
        ? 'italic'
        : undefined,
    style.textDecoration === 'none'
      ? 'no-underline'
      : style.textDecoration === 'underline'
        ? 'underline'
        : style.textDecoration === 'line-through'
          ? 'line-through'
          : undefined,
    style.textTransform === 'none'
      ? 'normal-case'
      : style.textTransform === 'uppercase'
        ? 'uppercase'
        : style.textTransform === 'lowercase'
          ? 'lowercase'
          : style.textTransform === 'capitalize'
            ? 'capitalize'
            : undefined,
    style.textAlign === 'left'
      ? 'text-left'
      : style.textAlign === 'center'
        ? 'text-center'
        : style.textAlign === 'right'
          ? 'text-right'
          : style.textAlign === 'justify'
            ? 'text-justify'
            : undefined,
    style.lineHeight ? arbitrary('leading', style.lineHeight) : undefined,
    style.letterSpacing ? arbitrary('tracking', style.letterSpacing) : undefined,
    style.opacity !== undefined ? arbitrary('opacity', style.opacity) : undefined,
    style.boxShadow ? arbitrary('shadow', style.boxShadow) : undefined,
  )
}

function inlineStyle(element: EditorElement) {
  const style: string[] = []
  if (element.style.backgroundImage) style.push(`background-image: ${element.style.backgroundImage}`)
  if (element.style.transform) style.push(`transform: ${element.style.transform}`)
  if (element.style.fontFamily) style.push(`font-family: ${element.style.fontFamily}`)
  return style.length ? ` style="${escapeHtml(style.join('; '))}"` : ''
}

function renderElement(
  elementId: string,
  elements: Record<string, EditorElement>,
  indentLevel = 1,
  isRoot = false,
): string {
  const element = elements[elementId]
  if (!element || element.visible === false) return ''

  const indent = '  '.repeat(indentLevel)

  const children = (element.children || [])
    .map((childId) => renderElement(childId, elements, indentLevel + 1, false))
    .join(element.children?.length ? '\n' : '')

  let innerHtml = ''
  if (element.type === 'text') {
    innerHtml = escapeHtml(element.content || '')
  } else if (element.type === 'button') {
    innerHtml = escapeHtml(element.content || 'Button')
  } else if (children) {
    innerHtml = `\n${children}\n${indent}`
  }

  const classes = classList(
    positionClasses(element, isRoot),
    sizeClasses(element),
    layoutClasses(element),
    styleClasses(element),
    element.type === 'text' ? 'whitespace-pre-wrap' : undefined,
    element.type === 'button' ? 'inline-flex items-center justify-center' : undefined,
    element.type === 'image' ? 'block max-w-full object-cover' : undefined,
  )
  const attrs = `data-codex-id="${escapeHtml(element.id)}" data-codex-type="${escapeHtml(element.type)}" class="${escapeHtml(classes)}"${inlineStyle(element)}`

  if (element.type === 'image') {
    return `${indent}<img ${attrs} src="${escapeHtml(element.content || '')}" alt="${escapeHtml(element.name || '')}" />`
  }

  const tag = element.type === 'button' ? 'button' : 'div'
  return `${indent}<${tag} ${attrs}>${innerHtml}</${tag}>`
}

export function createHtmlProjectDocument(state: ReturnType<typeof useEditorStore.getState>): HtmlProjectDocumentV1 {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    project: { name: 'Project One' },
    document: {
      artboard: structuredClone(state.artboard),
      deviceMode: state.deviceMode,
      rootElements: structuredClone(state.rootElements),
      elements: structuredClone(state.elements),
    },
  }
}

function getUsedFonts(elements: Record<string, EditorElement>): string[] {
  const fonts = new Set<string>()
  for (const el of Object.values(elements)) {
    if (el.style.fontFamily) {
      fonts.add(el.style.fontFamily.replace(/['"]/g, '').split(',')[0].trim())
    }
  }
  // Default font if nothing specified
  if (fonts.size === 0) {
    fonts.add('Inter')
  }
  return Array.from(fonts)
}

function buildFontUrl(fonts: string[]) {
  const families = fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

export function renderProjectHtml(state: ReturnType<typeof useEditorStore.getState>) {
  const project = createHtmlProjectDocument(state)
  const artboardWidth = DEVICE_WIDTHS[project.document.deviceMode]
  const body = project.document.rootElements
    .map((id) => renderElement(id, project.document.elements, 2, true))
    .join('\n')

  const usedFonts = getUsedFonts(project.document.elements)
  const fontUrl = buildFontUrl(usedFonts)

  const stageClasses = classList(
    'relative',
    'overflow-x-auto',
    'max-w-full',
    arbitrary('w', `${artboardWidth}px`),
    arbitrary('min-h', `${project.document.artboard.height}px`),
    colorClass('bg', project.document.artboard.background),
    'mx-auto'
  )

  return `<!DOCTYPE html>
<html class="light" lang="en">
<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>${escapeHtml(project.project.name)}</title>
  <link href="https://fonts.googleapis.com" rel="preconnect" />
  <link crossorigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
  <link href="${fontUrl}" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
  <style>
    /* Codex base resets */
    html, body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }
  </style>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#007AFF',
          },
          fontFamily: {
            display: ['${usedFonts[0]}', 'system-ui', 'sans-serif'],
          },
        },
      },
    };
  </script>
</head>
<body class="bg-white font-display m-0">
  <main data-codex-stage class="${escapeHtml(stageClasses)}">
${body}
  </main>
</body>
</html>`
}

export function downloadProjectHtml(state: ReturnType<typeof useEditorStore.getState>) {
  const html = renderProjectHtml(state)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `project-export-${buildTimestamp(new Date())}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)

  return html
}

// ========= Import Logic =========

function parsePixelNumber(value?: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseFloat(value.toString().replace('px', ''))
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseSize(value?: string | null): number | 'auto' | '100%' | undefined {
  if (!value) return undefined
  if (value === 'auto' || value === '100%') return value
  const num = parsePixelNumber(value)
  return num !== undefined ? num : undefined
}

function inferTypeFromTag(tagName: string): EditorElement['type'] {
  const tag = tagName.toLowerCase()
  if (tag === 'img') return 'image'
  if (tag === 'button' || tag === 'a') return 'button'
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'strong', 'em', 'b', 'i'].includes(tag)) return 'text'
  if (['input', 'textarea', 'select'].includes(tag)) return 'text'
  return 'container'
}

function extractChildNodes(node: Element): Element[] {
  return Array.from(node.children).filter(child => {
    // Ignore script, style, meta, etc.
    const tag = child.tagName.toLowerCase()
    return !['script', 'style', 'meta', 'link', 'noscript', 'title', 'head'].includes(tag)
  })
}

function parseHtmlNode(
  node: Element,
  parentId: string | undefined,
  elements: Record<string, EditorElement>,
  index: number
): string {
  // Use existing codex ID if present, otherwise generate a clean descriptive one
  const tag = node.tagName.toLowerCase()
  const codexId = node.getAttribute('data-codex-id')
  const id = codexId || `${tag}-${Math.random().toString(36).slice(2, 9)}`

  // Use existing type if present, otherwise infer
  const type = (node.getAttribute('data-codex-type') as EditorElement['type'] || inferTypeFromTag(tag))

  // We are discarding backward compatibility, so we purely parse the inline HTML styles 
  // (and if imported from somewhere else, we assume it has inline styles or we accept defaults)
  // To make it slightly smarter for unstyled HTML, we'll assign some sensible defaults
  const inlineStyle = (node as HTMLElement).style

  // --- Layout extraction ---
  const pt = inlineStyle.paddingTop || inlineStyle.padding
  const pr = inlineStyle.paddingRight || inlineStyle.padding
  const pb = inlineStyle.paddingBottom || inlineStyle.padding
  const pl = inlineStyle.paddingLeft || inlineStyle.padding

  let padding: number | string | undefined = undefined
  if (pt === pr && pr === pb && pb === pl && pt) {
    if (pt.endsWith('px')) padding = parsePixelNumber(pt)
    else padding = pt
  }

  const layout: ElementLayout = {
    position: inlineStyle.position === 'absolute' || (!parentId && !inlineStyle.position) ? 'absolute' : 'flow',
    x: parsePixelNumber(inlineStyle.left) ?? 0,
    y: parsePixelNumber(inlineStyle.top) ?? 0,
    width: parseSize(inlineStyle.width) ?? (['span', 'b', 'strong', 'i', 'em', 'a'].includes(tag) ? 'auto' : '100%'),
    height: parseSize(inlineStyle.height) ?? 'auto',
    display: (inlineStyle.display as any) || (['div', 'section', 'nav', 'header', 'footer', 'main', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li'].includes(tag) ? 'block' : 'flex'),
    flexDirection: (inlineStyle.flexDirection as any) || 'column',
    flexWrap: (inlineStyle.flexWrap as any),
    justifyContent: (inlineStyle.justifyContent as any),
    alignItems: (inlineStyle.alignItems as any) || 'stretch',
    gap: parsePixelNumber(inlineStyle.gap),
    padding,
    overflow: (inlineStyle.overflow as any),
    zIndex: parsePixelNumber(inlineStyle.zIndex),
    gridTemplateColumns: inlineStyle.gridTemplateColumns,
    gridTemplateRows: inlineStyle.gridTemplateRows,
  }

  // --- Style extraction ---
  const style: ElementStyle = {
    background: inlineStyle.backgroundColor || inlineStyle.background,
    backgroundImage: inlineStyle.backgroundImage && inlineStyle.backgroundImage !== 'none' ? inlineStyle.backgroundImage : undefined,
    backgroundSize: (inlineStyle.backgroundSize as any),
    backgroundPosition: inlineStyle.backgroundPosition,
    backgroundRepeat: (inlineStyle.backgroundRepeat as any),
    borderRadius: parsePixelNumber(inlineStyle.borderRadius),
    borderWidth: parsePixelNumber(inlineStyle.borderWidth),
    borderColor: inlineStyle.borderColor,
    borderStyle: (inlineStyle.borderStyle as any),
    color: inlineStyle.color,
    fontSize: parsePixelNumber(inlineStyle.fontSize),
    fontFamily: inlineStyle.fontFamily,
    fontWeight: inlineStyle.fontWeight || undefined,
    fontStyle: (inlineStyle.fontStyle as any),
    textDecoration: inlineStyle.textDecoration && inlineStyle.textDecoration !== 'none' ? inlineStyle.textDecoration as any : undefined,
    textTransform: inlineStyle.textTransform && inlineStyle.textTransform !== 'none' ? inlineStyle.textTransform as any : undefined,
    textAlign: (inlineStyle.textAlign as any),
    lineHeight: parsePixelNumber(inlineStyle.lineHeight) || inlineStyle.lineHeight,
    letterSpacing: inlineStyle.letterSpacing && inlineStyle.letterSpacing !== 'normal' ? inlineStyle.letterSpacing : undefined,
    opacity: inlineStyle.opacity !== '' ? Number.parseFloat(inlineStyle.opacity) : undefined,
    boxShadow: inlineStyle.boxShadow && inlineStyle.boxShadow !== 'none' ? inlineStyle.boxShadow : undefined,
    transform: inlineStyle.transform && inlineStyle.transform !== 'none' ? inlineStyle.transform : undefined,
  }

  // Clean empty strings
  for (const key of Object.keys(style)) {
    if ((style as any)[key] === '') delete (style as any)[key]
  }

  // Process children
  const childNodes = extractChildNodes(node)
  const children = childNodes.map((child, idx) => parseHtmlNode(child, id, elements, idx))

  // Extract content
  let content: string | undefined = undefined
  let name: string | undefined = node.getAttribute('data-codex-name') || undefined

  if (type === 'image') {
    content = node.getAttribute('src') || undefined
    name = name || node.getAttribute('alt') || `Image ${index + 1}`
  } else if (['input', 'textarea'].includes(tag)) {
    content = (node as HTMLInputElement).placeholder || (node as HTMLInputElement).value || undefined
  } else if (childNodes.length === 0 && tag !== 'br' && tag !== 'hr') {
    // Only take text content if there are no element children
    const text = node.textContent?.trim()
    if (text) content = text
  }

  elements[id] = {
    id,
    type,
    parentId,
    children,
    layout,
    style,
    content,
    name,
    visible: true,
  }

  return id
}

export function parseProjectHtml(html: string): HtmlProjectDocumentV1 {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Try to find the stage wrapper, fallback to main, fallback to body
  let stage = doc.querySelector('[data-codex-stage]')
  if (!stage) stage = doc.querySelector('main')
  if (!stage) stage = doc.querySelector('body')

  if (!stage) {
    throw new Error('This HTML file is empty or missing a body.')
  }

  const stageStyle = (stage as HTMLElement).style

  // Try to infer artboard size
  const artboardWidth = parsePixelNumber(stageStyle.width) || DEVICE_WIDTHS.desktop
  let artboardHeight = parsePixelNumber(stageStyle.minHeight) || parsePixelNumber(stageStyle.height) || 900
  const artboardBackground = stageStyle.backgroundColor || '#ffffff'

  const deviceMode = inferDeviceMode(artboardWidth)
  const elements: Record<string, EditorElement> = {}

  const childNodes = extractChildNodes(stage)
  const rootElements = childNodes.map((child, idx) => parseHtmlNode(child, undefined, elements, idx))

  const title = doc.querySelector('title')?.textContent?.trim() || 'Project One'

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    project: { name: title },
    document: {
      artboard: { height: artboardHeight, background: artboardBackground },
      deviceMode,
      rootElements,
      elements,
    },
  }
}

export async function importProjectHtmlFile(file: File) {
  const html = await file.text()
  return parseProjectHtml(html)
}

export function applyImportedProject(project: HtmlProjectDocumentV1) {
  useEditorStore.setState((state) => ({
    ...state,
    elements: structuredClone(project.document.elements),
    rootElements: structuredClone(project.document.rootElements),
    artboard: structuredClone(project.document.artboard),
    deviceMode: project.document.deviceMode,
    selectedId: null,
    hoveredElementId: null,
    insertIndex: null,
    editingId: null,
    interactionState: { mode: 'idle' },
    history: { past: [], future: [] },
    snapLines: [],
  }))
}

