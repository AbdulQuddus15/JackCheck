import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findSceneObjectByName, sleep} from "Leaf.lspkg/Utils/common/Utils"
import {JackCheckLeafInteractor} from "./JackCheckLeafInteractor"

@component
export class JackCheckLaunchScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    expect(findSceneObjectByName("PalletJackAnchor").getChildrenCount()).toBeGreaterThan(0)
    const markerNames = ["Marker_Wheels", "Marker_ForkTips", "Marker_ForkUnderside", "Marker_HydraulicUnit", "Marker_HandleAndControls"]
    markerNames.forEach((name) => expect(findSceneObjectByName(name).enabled).toBe(true))
    expect(findSceneObjectByName("InspectionCard").enabled).toBe(true)
    expect(findSceneObjectByName("SummaryCard").enabled).toBe(false)
    expect((findSceneObjectByName("ProgressText").getComponent("Component.Text") as Text).text).toBe("1 of 5")
    expect((findSceneObjectByName("PromptText").getComponent("Component.Text") as Text).text).toBe("Check wheels for damage or flat spots.")

    const interactor = new JackCheckLeafInteractor()
    await interactor.tapButton("Marker_Wheels")
    await sleep(200)
    expect((findSceneObjectByName("PromptText").getComponent("Component.Text") as Text).text).toBe("Check wheels for damage or flat spots.")
  }
}
