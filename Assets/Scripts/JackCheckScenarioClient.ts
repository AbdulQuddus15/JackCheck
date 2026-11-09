import {DefaultScenarioManager} from "Leaf.lspkg/Scenarios/scenario/manager/DefaultLeafScenarioManager"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"

@component
export class JackCheckScenarioClient extends BaseScriptComponent {
  private scenarioManager = DefaultScenarioManager.getInstance()

  onAwake(): void {
    this.runScenarios()
      .then(() => console.log("[LEAF][SUCCESS] All JackCheck scenarios passed."))
      .catch((error) => console.error(`[LEAF][FAILURE] ${error}`))
  }

  private async runScenarios(): Promise<void> {
    for (const scenarioId of this.scenarioManager.listScenarioIds()) {
      console.log(`[LEAF][START] ${scenarioId}`)
      await sleep(1000)
      await this.scenarioManager.startScenario(scenarioId)
      console.log(`[LEAF][PASS] ${scenarioId}`)
      await sleep(1000)
    }
  }
}
