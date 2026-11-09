import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findSceneObjectByName, sleep} from "Leaf.lspkg/Utils/common/Utils"
import {JackCheckLeafInteractor} from "./JackCheckLeafInteractor"

@component
export class JackCheckResetScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1000)
    const interactor = new JackCheckLeafInteractor()
    for (let index = 0; index < 5; index++) {
      // Keep sequential test input clear of the intentional 350 ms decision lock.
      if (index > 0) await sleep(200)
      await interactor.tapButton("PassButton")
    }
    expect(findSceneObjectByName("SummaryCard").enabled).toBe(true)
    await interactor.tapButton("ResetDemoButton")

    expect(findSceneObjectByName("InspectionCard").enabled).toBe(true)
    expect(findSceneObjectByName("SummaryCard").enabled).toBe(false)
    expect(findSceneObjectByName("HandleTag").enabled).toBe(false)
    expect((findSceneObjectByName("ProgressText").getComponent("Component.Text") as Text).text).toBe("1 of 5")
    expect((findSceneObjectByName("PromptText").getComponent("Component.Text") as Text).text).toBe("Check wheels for damage or flat spots.")
  }
}
