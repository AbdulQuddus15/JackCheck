import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findSceneObjectByName, nextFrame, sleep, withTimeout} from "Leaf.lspkg/Utils/common/Utils"
import {JackCheckLeafInteractor} from "./JackCheckLeafInteractor"

async function waitForCondition(condition: () => boolean, description: string): Promise<void> {
  await withTimeout((async () => {
    while (!condition()) await nextFrame()
  })(), 2000, `Timed out waiting for ${description}`)
}

const EXPECTED = [
  ["1 of 5", "Check wheels for damage or flat spots."],
  ["2 of 5", "Check fork tips for cracks, bends, or wear."],
  ["3 of 5", "Check underneath the forks for cracks or damage."],
  ["4 of 5", "Check the hydraulic unit for leaks or damage."],
  ["5 of 5", "Check the handle and controls for damage and smooth operation."],
]

@component
export class JackCheckProgressionScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1000)
    const interactor = new JackCheckLeafInteractor()
    if (findSceneObjectByName("SummaryCard").enabled) await interactor.tapButton("ResetDemoButton")

    expect((findSceneObjectByName("ProgressText").getComponent("Component.Text") as Text).text).toBe(EXPECTED[0][0])
    await Promise.all([interactor.tapButton("PassButton"), interactor.tapButton("PassButton")])
    await sleep(150)
    expect((findSceneObjectByName("ProgressText").getComponent("Component.Text") as Text).text).toBe("2 of 5")

    for (let index = 1; index < EXPECTED.length; index++) {
      expect((findSceneObjectByName("ProgressText").getComponent("Component.Text") as Text).text).toBe(EXPECTED[index][0])
      expect((findSceneObjectByName("PromptText").getComponent("Component.Text") as Text).text).toBe(EXPECTED[index][1])
      // Keep sequential test input clear of the intentional 350 ms decision lock.
      await sleep(200)
      await interactor.tapButton("PassButton")
      if (index + 1 < EXPECTED.length) {
        const nextExpected = EXPECTED[index + 1]
        await waitForCondition(() =>
          (findSceneObjectByName("ProgressText").getComponent("Component.Text") as Text).text === nextExpected[0] &&
          (findSceneObjectByName("PromptText").getComponent("Component.Text") as Text).text === nextExpected[1],
        `"${nextExpected[0]}" and its prompt`)
      } else {
        await waitForCondition(() => findSceneObjectByName("SummaryCard").enabled, "SummaryCard")
      }
    }
    expect(findSceneObjectByName("SummaryCard").enabled).toBe(true)
  }
}
