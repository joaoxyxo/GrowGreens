import { describe, it, expect } from 'vitest'
import { DIAGNOSIS_KEY, KEY_ROOT } from '@/data/diagnosisKey'
import { SYMPTOMS_BY_ID } from '@/data/troubleshoot'

describe('chave de diagnóstico dicotómica', () => {
  it('tem um nó raiz válido', () => {
    expect(DIAGNOSIS_KEY[KEY_ROOT]).toBeTruthy()
    expect(DIAGNOSIS_KEY[KEY_ROOT].kind).toBe('question')
  })

  it('todos os destinos (next) das opções existem', () => {
    for (const node of Object.values(DIAGNOSIS_KEY)) {
      if (node.kind === 'question') {
        expect(node.options.length, `${node.id} sem opções`).toBeGreaterThan(0)
        for (const o of node.options) {
          expect(DIAGNOSIS_KEY[o.next], `${node.id} → ${o.next} inexistente`).toBeTruthy()
        }
      }
    }
  })

  it('todos os resultados apontam para sintomas existentes', () => {
    for (const node of Object.values(DIAGNOSIS_KEY)) {
      if (node.kind === 'result') {
        expect(
          SYMPTOMS_BY_ID[node.symptomId],
          `resultado ${node.id} → ${node.symptomId} inexistente`,
        ).toBeTruthy()
      }
    }
  })

  it('todos os nós são alcançáveis a partir da raiz (sem órfãos)', () => {
    const reachable = new Set<string>()
    const stack = [KEY_ROOT]
    while (stack.length) {
      const id = stack.pop()!
      if (reachable.has(id)) continue
      reachable.add(id)
      const node = DIAGNOSIS_KEY[id]
      if (node.kind === 'question') stack.push(...node.options.map((o) => o.next))
    }
    for (const id of Object.keys(DIAGNOSIS_KEY)) {
      expect(reachable.has(id), `nó órfão: ${id}`).toBe(true)
    }
  })

  it('cada caminho a partir da raiz termina num resultado (sem ciclos infinitos)', () => {
    function leads(id: string, depth = 0): boolean {
      if (depth > 20) return false // proteção contra ciclos
      const node = DIAGNOSIS_KEY[id]
      if (!node) return false
      if (node.kind === 'result') return true
      return node.options.every((o) => leads(o.next, depth + 1))
    }
    expect(leads(KEY_ROOT)).toBe(true)
  })
})
