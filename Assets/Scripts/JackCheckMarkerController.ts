import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"

/** One authored SIK inspection marker. Owns only its visual hover state. */
@component
export class JackCheckMarkerController extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">JackCheckMarkerController – pinch target</span>')
  @ui.separator
  @ui.group_start("References")
  @input
  @hint("Zero-based inspection component index represented by this marker")
  checkIndex: number = 0
  @input
  @hint("Sphere mesh used for the bright marker dot")
  markerMesh!: RenderMesh
  @input
  @hint("Bright unlit material used for the marker dot")
  markerMaterial!: Material
  @ui.group_end
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Marker visual diameter in centimeters before hover")
  @widget(new SliderWidget(3, 8, 0.5))
  markerDiameterCm: number = 5
  @input
  @hint("Collider side length in centimeters; larger than the visual for forgiving input")
  @widget(new SliderWidget(5, 10, 0.5))
  colliderSizeCm: number = 7
  @ui.group_end

  private visual!: SceneObject
  private interactable!: Interactable
  private current: boolean = false
  private hovered: boolean = false
  private _onActivate = new Event<number>()

  get onActivate(): PublicApi<number> { return this._onActivate.publicApi() }

  onAwake(): void {
    this.visual = global.scene.createSceneObject("MarkerDot")
    this.visual.setParent(this.sceneObject)
    const meshVisual = this.visual.createComponent("Component.RenderMeshVisual") as RenderMeshVisual
    meshVisual.mesh = this.markerMesh
    meshVisual.mainMaterial = this.markerMaterial

    const collider = this.sceneObject.createComponent("Physics.ColliderComponent") as ColliderComponent
    const box = Shape.createBoxShape()
    box.size = new vec3(this.colliderSizeCm, this.colliderSizeCm, this.colliderSizeCm)
    collider.shape = box
    this.interactable = this.sceneObject.createComponent(Interactable.getTypeName()) as Interactable
    this.interactable.targetingMode = 3
    this.updateVisualScale()

    this.createEvent("OnStartEvent").bind(() => {
      this.interactable.onTriggerStart.add(() => this._onActivate.invoke(this.checkIndex))
      this.interactable.onHoverEnter.add(() => {
        this.hovered = true
        this.updateVisualScale()
      })
      this.interactable.onHoverExit.add(() => {
        this.hovered = false
        this.updateVisualScale()
      })
    })
  }

  setCurrent(current: boolean): void {
    this.current = current
    this.updateVisualScale()
  }

  private updateVisualScale(): void {
    if (!this.visual) return
    const multiplier = this.hovered ? 1.35 : (this.current ? 1.6 : 0.85)
    const diameter = this.markerDiameterCm * multiplier
    this.visual.getTransform().setLocalScale(new vec3(diameter, diameter, diameter))
  }
}
