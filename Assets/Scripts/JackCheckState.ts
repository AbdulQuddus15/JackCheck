export type JackCheckDecision = "pass" | "issue"

export interface JackCheckComponent {
  name: string
  prompt: string
}

export interface JackCheckDecisionResult {
  decision: JackCheckDecision
  componentName: string
  ended: boolean
}

/** Pure JackCheck inspection state. No scene, UI, audio, or external services. */
export class JackCheckState {
  static readonly components: JackCheckComponent[] = [
    {name: "Wheels", prompt: "Check wheels for damage or flat spots."},
    {name: "Fork tips", prompt: "Check fork tips for cracks, bends, or wear."},
    {name: "Fork underside", prompt: "Check underneath the forks for cracks or damage."},
    {name: "Hydraulic unit", prompt: "Check the hydraulic unit for leaks or damage."},
    {name: "Handle and controls", prompt: "Check the handle and controls for damage and smooth operation."},
  ]

  currentIndex: number = 0
  ended: boolean = false
  failedComponent: string | null = null
  results: JackCheckDecision[] = []

  recordDecision(decision: JackCheckDecision): JackCheckDecisionResult | null {
    if (this.ended || this.currentIndex < 0 || this.currentIndex >= JackCheckState.components.length) {
      return null
    }
    const component = JackCheckState.components[this.currentIndex]
    this.results.push(decision)
    if (decision === "issue") {
      this.failedComponent = component.name
      this.ended = true
    } else if (this.currentIndex === JackCheckState.components.length - 1) {
      this.ended = true
    } else {
      this.currentIndex++
    }
    return {decision, componentName: component.name, ended: this.ended}
  }

  reset(): void {
    this.currentIndex = 0
    this.ended = false
    this.failedComponent = null
    this.results = []
  }
}
