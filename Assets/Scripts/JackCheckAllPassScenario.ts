import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findSceneObjectByName, sleep} from "Leaf.lspkg/Utils/common/Utils"
import {JackCheckLeafInteractor} from "./JackCheckLeafInteractor"

@component
export class JackCheckAllPassScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1000)
    const interactor = new JackCheckLeafInteractor()
    if (findSceneObjectByName("SummaryCard").enabled) await interactor.tapButton("ResetDemoButton")
    for (let index = 0; index < 5; index++) {
      // Keep sequential test input clear of the intentional 350 ms decision lock.
      if (index > 0) await sleep(200)
      await interactor.tapButton("PassButton")
    }

    expect(findSceneObjectByName("SummaryCard").enabled).toBe(true)
    expect((findSceneObjectByName("SummaryTitle").getComponent("Component.Text") as Text).text).toBe("Inspection complete")
    expect((findSceneObjectByName("SummaryDetail").getComponent("Component.Text") as Text).text).toBe("5 of 5 checks passed")
    expect(findSceneObjectByName("HandleTag").enabled).toBe(false)
  }
}
