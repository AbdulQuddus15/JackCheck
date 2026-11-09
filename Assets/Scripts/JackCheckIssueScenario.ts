import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findSceneObjectByName, sleep} from "Leaf.lspkg/Utils/common/Utils"
import {JackCheckLeafInteractor} from "./JackCheckLeafInteractor"

@component
export class JackCheckIssueScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1000)
    const interactor = new JackCheckLeafInteractor()
    if (findSceneObjectByName("SummaryCard").enabled) await interactor.tapButton("ResetDemoButton")

    await interactor.tapButton("IssueButton")
    expect(findSceneObjectByName("InspectionCard").enabled).toBe(false)
    expect(findSceneObjectByName("SummaryCard").enabled).toBe(true)
    expect((findSceneObjectByName("SummaryDetail").getComponent("Component.Text") as Text).text.includes("Wheels")).toBe(true)
    expect(findSceneObjectByName("HandleTag").enabled).toBe(true)
    expect((findSceneObjectByName("TagText").getComponent("Component.Text") as Text).text).toBe("Do not use")

    await interactor.tapButton("ResetDemoButton")
    expect(findSceneObjectByName("InspectionCard").enabled).toBe(true)
    expect(findSceneObjectByName("SummaryCard").enabled).toBe(false)
    expect(findSceneObjectByName("HandleTag").enabled).toBe(false)
    expect((findSceneObjectByName("PromptText").getComponent("Component.Text") as Text).text).toBe("Check wheels for damage or flat spots.")
  }
}
