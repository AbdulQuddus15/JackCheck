import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate"
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout"
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem"
import {FlexAlign, FlexDirection, FlexJustify} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes"
import {Billboard} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"

const WARNING_ICON = requireAsset("../Icons/warning.png") as Texture
const IMAGE_MATERIAL = requireAsset("../Materials/ImageMaterial.mat") as Material

/** JackCheckTagUI — passive handle warning tag; Main decides when it exists. */
@component
export class JackCheckTagUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">JackCheckTagUI – handle warning tag</span>')
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Tag width in centimeters")
  @widget(new SliderWidget(14, 24, 0.5))
  widthCm: number = 20
  @input
  @hint("Tag height in centimeters")
  @widget(new SliderWidget(5, 10, 0.5))
  heightCm: number = 8
  @input('vec4', '{1,1,1,1}')
  @hint("Light warning text color")
  @widget(new ColorWidget())
  textColor: vec4
  @ui.group_end

  private handleTag!: SceneObject

  onAwake(): void {
    this.sceneObject.createComponent("Component.Canvas")
    this.sceneObject.createComponent(Billboard.getTypeName())
    this.handleTag = global.scene.createSceneObject("HandleTag")
    this.handleTag.setParent(this.sceneObject)
    const plate = this.handleTag.createComponent(BackPlate.getTypeName()) as BackPlate
    plate.style = "dark"
    plate.size = new vec2(this.widthCm, this.heightCm)

    const content = global.scene.createSceneObject("HandleTagContent")
    content.setParent(this.handleTag)
    content.getTransform().setLocalPosition(new vec3(0, 0, 0.6))
    const flex = content.createComponent(FlexLayout.getTypeName()) as FlexLayout
    flex.autoDiscoverItemsOnStart = false
    flex.width = this.widthCm
    flex.height = this.heightCm
    flex.direction = FlexDirection.Row
    flex.justifyContent = FlexJustify.Center
    flex.alignItems = FlexAlign.Center
    flex.columnGap = 1.0

    const iconObject = global.scene.createSceneObject("TagWarningIcon")
    iconObject.setParent(content)
    iconObject.getTransform().setLocalScale(new vec3(3, 3, 1))
    const image = iconObject.createComponent("Component.Image") as Image
    const material = IMAGE_MATERIAL.clone()
    material.mainPass.baseTex = WARNING_ICON
    material.mainPass.depthTest = true
    material.mainPass.depthWrite = false
    image.clearMaterials()
    image.addMaterial(material)
    const iconItem = iconObject.createComponent(FlexItem.getTypeName()) as FlexItem
    iconItem.overrideWidth = 3
    iconItem.overrideHeight = 3

    const textObject = global.scene.createSceneObject("TagText")
    textObject.setParent(content)
    const text = textObject.createComponent("Component.Text") as Text
    text.text = "Do not use"
    text.depthTest = true
    text.size = 88
    ;(text as Text & {weight?: number}).weight = 700
    text.textFill.color = this.textColor
    text.horizontalAlignment = HorizontalAlignment.Center
    text.verticalAlignment = VerticalAlignment.Center
    text.horizontalOverflow = HorizontalOverflow.Overflow
    text.verticalOverflow = VerticalOverflow.Overflow
    text.layoutRect = Rect.create(-6, 6, -1.5, 1.5)
    const textItem = textObject.createComponent(FlexItem.getTypeName()) as FlexItem
    textItem.overrideWidth = 12
    textItem.overrideHeight = 3
    flex.addItems([iconItem, textItem])
    this.handleTag.enabled = false
  }

  showAt(worldPosition: vec3): void {
    this.sceneObject.getTransform().setWorldPosition(worldPosition)
    this.handleTag.enabled = true
  }

  hide(): void {
    this.handleTag.enabled = false
  }
}
