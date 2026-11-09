import {scenariosIndex} from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator"
import {ScenarioMetadata} from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata"
import {JackCheckLaunchScenario} from "./JackCheckLaunchScenario"
import {JackCheckProgressionScenario} from "./JackCheckProgressionScenario"
import {JackCheckIssueScenario} from "./JackCheckIssueScenario"
import {JackCheckAllPassScenario} from "./JackCheckAllPassScenario"
import {JackCheckResetScenario} from "./JackCheckResetScenario"

@component
export class LeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    {id: "jackcheck-01-launch", typename: JackCheckLaunchScenario.getTypeName()},
    {id: "jackcheck-02-linear-and-duplicate-guard", typename: JackCheckProgressionScenario.getTypeName()},
    {id: "jackcheck-03-issue-and-reset", typename: JackCheckIssueScenario.getTypeName()},
    {id: "jackcheck-04-all-pass", typename: JackCheckAllPassScenario.getTypeName()},
    {id: "jackcheck-05-reset-after-all-pass", typename: JackCheckResetScenario.getTypeName()},
  ]
}
