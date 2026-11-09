import {JackCheckPromptUI} from "./JackCheckPromptUI"
import {JackCheckTagUI} from "./JackCheckTagUI"
import {JackCheckMarkerController} from "./JackCheckMarkerController"
import {JackCheckDecision, JackCheckState} from "./JackCheckState"

const PALLET_JACK_PREFAB = requireAsset("../GeneratedMeshes/PalletJack.glb") as ObjectPrefab

/**
 * JackCheckMain — owns inspection state and coordinates authored markers/UI.
 * Required inputs are wired by the two-phase bootstrap.
 * Must not author UI, place bespoke layout in code, or add external services.
 */
@component
export class JackCheckMain extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">JackCheckMain – guided pallet-jack inspection</span>')
  @ui.separator
  @ui.group_start("References")
  @input @hint("Authored floor-level slot for the real-scale pallet jack") palletJackAnchor!: SceneObject
  @input @hint("Passive inspection and summary card") promptUI!: JackCheckPromptUI
  @input @hint("Passive Do not use handle tag") tagUI!: JackCheckTagUI
  @input @hint("Wheels marker controller") wheelsMarker!: JackCheckMarkerController
  @input @hint("Fork-tips marker controller") forkTipsMarker!: JackCheckMarkerController
  @input @hint("Fork-underside marker controller") forkUndersideMarker!: JackCheckMarkerController
  @input @hint("Hydraulic-unit marker controller") hydraulicMarker!: JackCheckMarkerController
  @input @hint("Handle-and-controls marker controller") handleMarker!: JackCheckMarkerController
  @input @hint("Wheels prompt position") wheelsPromptAnchor!: SceneObject
  @input @hint("Fork-tips prompt position") forkTipsPromptAnchor!: SceneObject
  @input @hint("Fork-underside prompt position") forkUndersidePromptAnchor!: SceneObject
  @input @hint("Hydraulic-unit prompt position") hydraulicPromptAnchor!: SceneObject
  @input @hint("Handle prompt position") handlePromptAnchor!: SceneObject
  @input @hint("Completion summary beside the handle") summaryAnchor!: SceneObject
  @input @hint("Warning-tag position on the handle") handleTagAnchor!: SceneObject
  @ui.group_end
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Render collider wireframes for hit-zone diagnosis on preview restart")
  debugColliders: boolean = false
  @ui.group_end

  private state = new JackCheckState()
  private markers!: JackCheckMarkerController[]
  private promptAnchors!: SceneObject[]
  private decisionLock: boolean = false
  private unlockEvent!: DelayedCallbackEvent

  onAwake(): void {
    PALLET_JACK_PREFAB.instantiate(this.palletJackAnchor)
    this.unlockEvent = this.createEvent("DelayedCallbackEvent")
    this.unlockEvent.bind(() => {
      if (!this.state.ended) this.decisionLock = false
    })
    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  private onStart(): void {
    this.markers = [this.wheelsMarker, this.forkTipsMarker, this.forkUndersideMarker, this.hydraulicMarker, this.handleMarker]
    this.promptAnchors = [this.wheelsPromptAnchor, this.forkTipsPromptAnchor, this.forkUndersidePromptAnchor, this.hydraulicPromptAnchor, this.handlePromptAnchor]
    const required = [this.palletJackAnchor, this.promptUI, this.tagUI, this.summaryAnchor, this.handleTagAnchor]
    if (required.some((value) => !value) || this.markers.some((value) => !value) || this.promptAnchors.some((value) => !value)) {
      console.error("JackCheckMain: required @input not wired. Check Phase B bootstrap.")
      return
    }

    this.promptUI.onPass.add(() => this.recordDecision("pass"))
    this.promptUI.onIssue.add(() => this.recordDecision("issue"))
    this.promptUI.onReset.add(() => this.resetDemo())
    this.markers.forEach((marker, index) => marker.onActivate.add(() => this.activateMarker(index)))
    this.resetDemo()

    if (this.debugColliders) {
      this.setColliderDebugAll(this.sceneObject, true)
    }
    console.log("JackCheck ready: first inspection prompt, five markers.")
  }

  private recordDecision(decision: JackCheckDecision): void {
    if (this.decisionLock || this.state.ended) return
    this.decisionLock = true
    const result = this.state.recordDecision(decision)
    if (!result) {
      this.decisionLock = false
      return
    }
    console.log(`JackCheck decision: ${result.componentName} = ${result.decision}; results=${this.state.results.length}`)

    if (this.state.ended) {
      this.markers.forEach((marker) => marker.setCurrent(false))
      if (this.state.failedComponent) {
        this.tagUI.showAt(this.handleTagAnchor.getTransform().getWorldPosition())
        this.promptUI.showSummary("Issue reported", `Issue reported: ${this.state.failedComponent}`, this.summaryAnchor.getTransform().getWorldPosition())
      } else {
        this.tagUI.hide()
        this.promptUI.showSummary("Inspection complete", "5 of 5 checks passed", this.summaryAnchor.getTransform().getWorldPosition())
      }
      return
    }

    this.showCurrentPrompt()
    this.unlockEvent.reset(0.35)
  }

  private activateMarker(index: number): void {
    if (this.state.ended || this.decisionLock || index !== this.state.currentIndex) return
    this.showCurrentPrompt()
  }

  private showCurrentPrompt(): void {
    const index = this.state.currentIndex
    const component = JackCheckState.components[index]
    this.markers.forEach((marker, markerIndex) => marker.setCurrent(markerIndex === index))
    this.promptUI.showPrompt(component.name, component.prompt, index + 1, JackCheckState.components.length, this.promptAnchors[index].getTransform().getWorldPosition())
  }

  private resetDemo(): void {
    this.unlockEvent.cancel()
    this.state.reset()
    this.decisionLock = false
    this.tagUI.hide()
    this.showCurrentPrompt()
    console.log("JackCheck reset: first inspection prompt restored; tag hidden.")
  }

  private setColliderDebugAll(obj: SceneObject, enable: boolean): void {
    const collider = obj.getComponent("Physics.ColliderComponent") as ColliderComponent | null
    if (collider) collider.debugDrawEnabled = enable
    const body = obj.getComponent("Physics.BodyComponent") as ColliderComponent | null
    if (body) body.debugDrawEnabled = enable
    for (let i = 0; i < obj.getChildrenCount(); i++) {
      this.setColliderDebugAll(obj.getChild(i), enable)
    }
  }
}
