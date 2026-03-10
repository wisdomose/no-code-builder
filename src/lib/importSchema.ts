import { z } from 'zod'

// ─── Layout Schema ────────────────────────────────────────────────────────────

const ElementLayoutSchema = z.object({
    position: z.enum(['absolute', 'flow']).optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.union([z.number(), z.literal('auto'), z.literal('100%')]),
    height: z.union([z.number(), z.literal('auto'), z.literal('100%')]),
    display: z.enum(['flex', 'block', 'grid']).optional(),
    flexDirection: z.enum(['row', 'column']).optional(),
    flexWrap: z.enum(['wrap', 'nowrap']).optional(),
    gridTemplateColumns: z.string().optional(),
    gridTemplateRows: z.string().optional(),
    alignItems: z.enum(['start', 'center', 'end', 'stretch']).optional(),
    justifyContent: z.enum(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly', 'stretch']).optional(),
    alignSelf: z.enum(['auto', 'start', 'center', 'end', 'stretch']).optional(),
    gap: z.number().optional(),
    padding: z.union([z.number(), z.string()]).optional(),
    overflow: z.enum(['visible', 'hidden', 'scroll', 'auto']).optional(),
    zIndex: z.number().optional(),
})

// ─── Style Schema ─────────────────────────────────────────────────────────────

const ElementStyleSchema = z.object({
    background: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundSize: z.enum(['cover', 'contain', 'auto', '100% 100%']).optional(),
    backgroundPosition: z.string().optional(),
    backgroundRepeat: z.enum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']).optional(),
    borderRadius: z.number().optional(),
    borderWidth: z.number().optional(),
    borderColor: z.string().optional(),
    borderStyle: z.enum(['solid', 'dashed', 'dotted', 'double', 'none']).optional(),
    color: z.string().optional(),
    fontSize: z.number().optional(),
    fontFamily: z.string().optional(),
    fontWeight: z.union([z.number(), z.string()]).optional(),
    fontStyle: z.enum(['normal', 'italic']).optional(),
    textDecoration: z.enum(['none', 'underline', 'line-through']).optional(),
    textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
    lineHeight: z.union([z.number(), z.string()]).optional(),
    letterSpacing: z.string().optional(),
    opacity: z.number().optional(),
    boxShadow: z.string().optional(),
    transform: z.string().optional(),
})

// ─── Element Schema ───────────────────────────────────────────────────────────

const EditorElementSchema = z.object({
    id: z.string().min(1),
    type: z.enum(['text', 'image', 'button', 'container', 'div']),
    name: z.string().optional(),
    parentId: z.string().optional(),
    children: z.array(z.string()).optional(),
    visible: z.boolean().optional(),
    locked: z.boolean().optional(),
    layout: ElementLayoutSchema,
    style: ElementStyleSchema,
    content: z.string().optional(),
    index: z.number().optional(),
})

// ─── Artboard Schema ──────────────────────────────────────────────────────────

const ArtboardSchema = z.object({
    height: z.number().positive(),
    background: z.string(),
})

// ─── Project Import Schema ────────────────────────────────────────────────────

export const ProjectImportSchema = z.object({
    elements: z.record(z.string(), EditorElementSchema),
    rootElements: z.array(z.string()),
    artboard: ArtboardSchema,
})

export type ProjectImportData = z.infer<typeof ProjectImportSchema>

// ─── Validator ────────────────────────────────────────────────────────────────

export function validateImportJson(raw: string): {
    success: boolean
    data?: ProjectImportData
    errors?: string[]
} {
    // 1. Parse raw JSON string
    let parsed: unknown
    try {
        parsed = JSON.parse(raw)
    } catch {
        return { success: false, errors: ['Invalid JSON syntax. Please check your input.'] }
    }

    // 2. Validate with Zod
    const result = ProjectImportSchema.safeParse(parsed)
    if (!result.success) {
        const errors = result.error.issues.map((issue) => {
            const path = issue.path.join('.')
            return path ? `${path}: ${issue.message}` : issue.message
        })
        return { success: false, errors: errors.slice(0, 10) }
    }

    // 3. Integrity checks
    const data = result.data
    const elementIds = new Set(Object.keys(data.elements))
    const integrityErrors: string[] = []

    // Check rootElements reference valid element IDs
    for (const rootId of data.rootElements) {
        if (!elementIds.has(rootId)) {
            integrityErrors.push(`rootElements references unknown element "${rootId}"`)
        }
    }

    // Check parent/child references
    for (const [elId, el] of Object.entries(data.elements)) {
        if (el.parentId && !elementIds.has(el.parentId)) {
            integrityErrors.push(`Element "${elId}" references unknown parent "${el.parentId}"`)
        }
        if (el.children) {
            for (const childId of el.children) {
                if (!elementIds.has(childId)) {
                    integrityErrors.push(`Element "${elId}" references unknown child "${childId}"`)
                }
            }
        }
    }

    if (integrityErrors.length > 0) {
        return { success: false, errors: integrityErrors.slice(0, 10) }
    }

    return { success: true, data }
}
