// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import {
    parseProjectHtml,
    renderProjectHtml,
    createHtmlProjectDocument,
    type HtmlProjectDocumentV1
} from '../projectHtml'
import { useEditorStore } from '../useEditorStore'

describe('projectHtml export/import', () => {
    it('exports valid HTML with Tailwind CDN and inline styles', () => {
        // Setup a small test state
        useEditorStore.setState({
            artboard: { height: 800, background: '#ffffff' },
            deviceMode: 'desktop',
            rootElements: ['el1'],
            elements: {
                el1: {
                    id: 'el1',
                    type: 'text',
                    content: 'Hello World',
                    visible: true,
                    layout: { position: 'absolute', x: 10, y: 20, width: 200, height: 50 },
                    style: { color: '#ff0000', fontSize: 24 }
                }
            }
        })

        const html = renderProjectHtml(useEditorStore.getState())

        // Core structure
        expect(html).toContain('<!DOCTYPE html>')
        expect(html).toContain('<html class="light" lang="en">')
        expect(html).toContain('cdn.tailwindcss.com')

        // Element render
        expect(html).toContain('Hello World')
        expect(html).toContain('data-codex-id="el1"')
        expect(html).toContain('data-codex-type="text"')

        // Inline styles (not Tailwind classes)
        expect(html).toContain('absolute')
        expect(html).toContain('left-[10px]') // Leftovers from classList
        expect(html).toContain('text-[#ff0000]')
    })

    it('imports arbitrary HTML without codex attributes', () => {
        const rawHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <main style="width: 1440px; min-height: 900px; background-color: rgb(255, 255, 255);">
            <div style="position: absolute; left: 100px; top: 150px; width: 300px; height: auto; display: flex; flex-direction: column; gap: 16px;">
              <h1 style="color: rgb(51, 51, 51); font-size: 32px; margin: 0;">Arbitrary Heading</h1>
              <p style="font-size: 16px; line-height: 24px;">Some description text</p>
              <button style="background-color: blue; color: white; border-radius: 8px;">Click Me</button>
              <img src="test.png" alt="Test Image" style="width: 100%; height: 200px;" />
            </div>
          </main>
        </body>
      </html>
    `

        const doc = parseProjectHtml(rawHtml)

        expect(doc.version).toBe(1)
        expect(doc.document.deviceMode).toBe('desktop')
        expect(doc.document.artboard.height).toBe(900)

        // Should have 1 root element (the div)
        expect(doc.document.rootElements.length).toBe(1)
        const rootId = doc.document.rootElements[0]
        const rootEl = doc.document.elements[rootId]

        expect(rootEl.type).toBe('container')
        expect(rootEl.layout.x).toBe(100)
        expect(rootEl.layout.y).toBe(150)
        expect(rootEl.layout.width).toBe(300)
        expect(rootEl.layout.display).toBe('flex')
        expect(rootEl.layout.gap).toBe(16)

        // Should have 4 children
        expect(rootEl.children?.length).toBe(4)
        if (!rootEl.children) throw new Error('No children')

        const [h1Id, pId, btnId, imgId] = rootEl.children

        // h1
        const h1 = doc.document.elements[h1Id]
        expect(h1.type).toBe('text')
        expect(h1.content).toBe('Arbitrary Heading')
        expect(h1.style.fontSize).toBe(32)

        // p
        const p = doc.document.elements[pId]
        expect(p.type).toBe('text')
        expect(p.content).toBe('Some description text')
        expect(p.style.fontSize).toBe(16)

        // button
        const btn = doc.document.elements[btnId]
        expect(btn.type).toBe('button')
        expect(btn.content).toBe('Click Me')
        expect(btn.style.borderRadius).toBe(8)

        // img
        const img = doc.document.elements[imgId]
        expect(img.type).toBe('image')
        expect(img.content).toBe('test.png')
        expect(img.name).toBe('Test Image')
        expect(img.layout.height).toBe(200)
    })

    it('preserves codex-id during round-trip if present', () => {
        const rawHtml = `
      <main data-codex-stage>
        <h1 data-codex-id="test-id-123" data-codex-type="text" style="color: red;">Hello round trip</h1>
      </main>
    `
        const doc = parseProjectHtml(rawHtml)
        const el = doc.document.elements['test-id-123']
        expect(el).toBeDefined()
        expect(el.type).toBe('text')
        expect(el.content).toBe('Hello round trip')
        expect(el.style.color).toBe('red')
    })
})
