import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate"
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import {ElementContent} from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent"
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout"
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem"
import {FlexAlign, FlexAlignSelf, FlexDirection, FlexJustify} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes"
import {ContentVerticalAlignment} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/LayoutTypes"
import {Billboard} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"

const CHECK_ICON = requireAsset("../Icons/check.png") as Texture
const WARNING_ICON = requireAsset("../Icons/warning.png") as Texture
const REFRESH_ICON = requireAsset("../Icons/refresh.png") as Texture

type TextRole = "Headline1" | "Headline2" | "Subheadline" | "Button" | "Body" | "Caption"
const TYPE_SCALE: Record<TextRole, {size: number; weight: number}> = {
  Headline1: {size: 96, weight: 700},
  Headline2: {size: 88, weight: 700},
  Subheadline: {size: 80, weight: 700},
  Button: {size: 88, weight: 500},
  Body: {size: 96, weight: 500},
  Caption: {size: 72, weight: 500},
}

function roleSize(role: TextRole): number {
  return TYPE_SCALE[role].size
}

function applyTextRole(text: Text, role: TextRole): void {
  text.size = roleSize(role)
  ;(text as Text & {weight?: number}).weight = TYPE_SCALE[role].weight
}

/**
 * JackCheckPromptUI — passive inspection and completion card.
 * Inputs: presentation dimensions and colors only.
 * Main supplies exact prompt/summary data and all world positions.
 * Must not own inspection state or decide pass/issue outcomes.
 */
@component
export class JackCheckPromptUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">JackCheckPromptUI – inspection and summary card</span>')
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Card width in centimeters")
  @widget(new SliderWidget(22, 32, 0.5))
  panelWidthCm: number = 32
  @input
  @hint("Card height in centimeters")
  @widget(new SliderWidget(16, 24, 0.5))
  panelHeightCm: number = 24
  @input
  @hint("Inner padding in centimeters")
  @widget(new SliderWidget(0.6, 2, 0.1))
  paddingCm: number = 1.2
  @input
  @hint("Pass, Issue, and Reset target height in centimeters")
  @widget(new SliderWidget(3.5, 6, 0.5))
  buttonHeightCm: number = 5
  @input('vec4', '{1,1,1,1}')
  @hint("Primary light text color")
  @widget(new ColorWidget())
  textColor: vec4
  @input('vec4', '{0.45,0.7,0.95,1}')
  @hint("Accent color for progress and component names")
  @widget(new ColorWidget())
  accentColor: vec4
  @ui.group_end

  private inspectionCard!: SceneObject
  private summaryCard!: SceneObject
  private progressText!: Text
  private componentText!: Text
  private promptText!: Text
  private summaryTitle!: Text
  private summaryDetail!: Text
  private passButton!: Button
  private issueButton!: Button
  private resetButton!: Button
  private _onPass = new Event<void>()
  private _onIssue = new Event<void>()
  private _onReset = new Event<void>()

  get onPass(): PublicApi<void> { return this._onPass.publicApi() }
  get onIssue(): PublicApi<void> { return this._onIssue.publicApi() }
  get onReset(): PublicApi<void> { return this._onReset.publicApi() }

  onAwake(): void {
    this.sceneObject.createComponent("Component.Canvas")
    this.sceneObject.createComponent(Billboard.getTypeName())
    this.buildInspectionCard()
    this.buildSummaryCard()
    this.summaryCard.enabled = false
  }

  showPrompt(componentName: string, promptText: string, step: number, total: number, worldPosition: vec3): void {
    this.progressText.text = `${step} of ${total}`
    this.componentText.text = componentName
    this.promptText.text = promptText
    this.sceneObject.getTransform().setWorldPosition(worldPosition)
    this.summaryCard.enabled = false
    this.inspectionCard.enabled = true
  }

  showSummary(title: string, detail: string, worldPosition: vec3): void {
    this.summaryTitle.text = title
    this.summaryDetail.text = detail
    this.sceneObject.getTransform().setWorldPosition(worldPosition)
    this.inspectionCard.enabled = false
    this.summaryCard.enabled = true
  }

  hideAll(): void {
    this.inspectionCard.enabled = false
    this.summaryCard.enabled = false
  }

  private buildInspectionCard(): void {
    const built = this.buildCard("InspectionCard")
    this.inspectionCard = built.root
    const content = built.content
    this.progressText = this.addText(content, "ProgressText", "1 of 5", "Caption", 1.6, this.accentColor)
    this.componentText = this.addText(content, "ComponentText", "Wheels", "Headline2", 2.2, this.textColor)
    this.promptText = this.addText(content, "PromptText", "Check wheels for damage or flat spots.", "Body", 5.0, this.textColor)
    this.promptText.horizontalOverflow = HorizontalOverflow.Wrap

    const row = this.obj(content, "DecisionRow")
    const rowItem = row.createComponent(FlexItem.getTypeName()) as FlexItem
    rowItem.overrideHeight = this.buttonHeightCm
    rowItem.alignSelf = FlexAlignSelf.Stretch
    const rowFlex = row.createComponent(FlexLayout.getTypeName()) as FlexLayout
    rowFlex.autoDiscoverItemsOnStart = false
    rowFlex.width = this.panelWidthCm - this.paddingCm * 2
    rowFlex.height = this.buttonHeightCm
    rowFlex.direction = FlexDirection.Row
    rowFlex.justifyContent = FlexJustify.Center
    rowFlex.alignItems = FlexAlign.Center
    rowFlex.columnGap = 2
    const decisionFlex = content.getComponent(FlexLayout.getTypeName()) as FlexLayout
    decisionFlex.addItems([rowItem])

    this.passButton = this.addDecisionButton(row, "PassButton", "Pass", CHECK_ICON, () => this._onPass.invoke())
    this.issueButton = this.addDecisionButton(row, "IssueButton", "Issue", WARNING_ICON, () => this._onIssue.invoke())
    rowFlex.addItems([
      this.passButton.getSceneObject().getComponent(FlexItem.getTypeName()) as FlexItem,
      this.issueButton.getSceneObject().getComponent(FlexItem.getTypeName()) as FlexItem,
    ])
  }

  private buildSummaryCard(): void {
    const built = this.buildCard("SummaryCard")
    this.summaryCard = built.root
    const content = built.content
    this.addText(content, "SummaryEyebrow", "JackCheck", "Caption", 1.6, this.accentColor)
    this.summaryTitle = this.addText(content, "SummaryTitle", "Inspection complete", "Headline2", 3.0, this.textColor)
    this.summaryDetail = this.addText(content, "SummaryDetail", "5 of 5 checks passed", "Body", 5.0, this.textColor)
    this.summaryDetail.horizontalOverflow = HorizontalOverflow.Wrap

    const reset = this.obj(content, "ResetDemoButton")
    const resetItem = reset.createComponent(FlexItem.getTypeName()) as FlexItem
    resetItem.overrideWidth = 18
    resetItem.overrideHeight = this.buttonHeightCm
    resetItem.alignSelf = FlexAlignSelf.Center
    this.resetButton = reset.createComponent(Button.getTypeName()) as Button
    this.resetButton.size = new vec3(18, this.buttonHeightCm, 1)
    this.resetButton.onInitialized.add(() => {
      this.resetButton.size = new vec3(18, this.buttonHeightCm, 1)
    })
    const ec = reset.createComponent(ElementContent.getTypeName()) as ElementContent
    ec.text = "Reset demo"
    ec.textSize = roleSize("Button")
    ec.leadingIcon = REFRESH_ICON
    ec.leadingIconSize = 2.0
    ec.spacing = 0.6
    ec.contentAlignment = "center"
    this.resetButton.onTriggerUp.add(() => this._onReset.invoke())
    const flex = content.getComponent(FlexLayout.getTypeName()) as FlexLayout
    flex.addItems([resetItem])
  }

  private buildCard(name: string): {root: SceneObject; content: SceneObject} {
    const root = this.obj(this.sceneObject, name)
    const plate = root.createComponent(BackPlate.getTypeName()) as BackPlate
    plate.style = "dark"
    plate.size = new vec2(this.panelWidthCm, this.panelHeightCm)
    const content = this.obj(root, `${name}Content`)
    content.getTransform().setLocalPosition(new vec3(0, 0, 0.6))
    const flex = content.createComponent(FlexLayout.getTypeName()) as FlexLayout
    flex.autoDiscoverItemsOnStart = false
    flex.width = this.panelWidthCm
    flex.height = this.panelHeightCm
    flex.direction = FlexDirection.Column
    flex.alignItems = FlexAlign.Stretch
    flex.justifyContent = FlexJustify.Start
    flex.verticalAlignment = ContentVerticalAlignment.Top
    flex.rowGap = 0.8
    flex.paddingTop = this.paddingCm
    flex.paddingBottom = this.paddingCm
    flex.paddingLeft = this.paddingCm
    flex.paddingRight = this.paddingCm
    return {root, content}
  }

  private addDecisionButton(parent: SceneObject, name: string, label: string, icon: Texture, callback: () => void): Button {
    const so = this.obj(parent, name)
    const item = so.createComponent(FlexItem.getTypeName()) as FlexItem
    item.overrideWidth = 10
    item.overrideHeight = this.buttonHeightCm
    const button = so.createComponent(Button.getTypeName()) as Button
    button.size = new vec3(10, this.buttonHeightCm, 1)
    button.onInitialized.add(() => {
      button.size = new vec3(10, this.buttonHeightCm, 1)
    })
    const ec = so.createComponent(ElementContent.getTypeName()) as ElementContent
    ec.text = label
    ec.textSize = roleSize("Button")
    ec.leadingIcon = icon
    ec.leadingIconSize = 2.0
    ec.spacing = 0.6
    ec.contentAlignment = "center"
    button.onTriggerUp.add(callback)
    return button
  }

  private addText(parent: SceneObject, name: string, value: string, role: TextRole, height: number, color: vec4): Text {
    const so = this.obj(parent, name)
    const text = so.createComponent("Component.Text") as Text
    text.text = value
    text.depthTest = true
    applyTextRole(text, role)
    text.textFill.color = color
    text.horizontalAlignment = HorizontalAlignment.Center
    text.verticalAlignment = VerticalAlignment.Center
    text.horizontalOverflow = HorizontalOverflow.Overflow
    text.verticalOverflow = VerticalOverflow.Overflow
    text.layoutRect = Rect.create(-0.5, 0.5, -0.5, 0.5)
    const item = so.createComponent(FlexItem.getTypeName()) as FlexItem
    item.alignSelf = FlexAlignSelf.Stretch
    item.overrideHeight = height
    const flex = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout
    flex.addItems([item])
    return text
  }

  private obj(parent: SceneObject, name: string): SceneObject {
    const so = global.scene.createSceneObject(name)
    so.setParent(parent)
    return so
  }
}
