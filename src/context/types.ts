import World from "@/ecs/World";
import { StaticComponents } from "./Components";
import { StaticEntities } from "./Entities";
import { Color3, Color4, ImageProcessingConfiguration, Vector, Vector3 } from "@babylonjs/core";

export default interface ISystem {
  world: World;
  components: StaticComponents;
  entities: StaticEntities;
}

export interface ILandmark {
  position: Vector3,
  path: string,
  contentType: number,
  contentPath: string,
  contentWidth: number,
  contentHeight: number,
  pointOfView: Vector3
}

export interface IAnimation {
  name: string,
  fps: number,
  property: string,
  enabled: boolean,
  startFrame: number,
  created: boolean,
  keyFrames: Array<IKeyFrame>,
  animationType: number,
  loop: boolean,
  animationMaster: number,
  callback: Function
}

export interface ICustomAnimation {
  property: string,
  minValue: unknown,
  maxValue: unknown,
  duration: number,
  currentFrame: number,
  step: number,
  animationMaster: number,
  callback: Function
}

export interface ICutScene {
  entity: number,
  startFrame: number,
  endFrame: number,
  animation: unknown,
  type: number,
  started: boolean
}

export interface ICutSceneMaster {
  name: string,
  scenes: Array<ICutScene>,
  currentFrame: number,
  maxFrame: number
}

export interface IKeyFrame {
  frame: number,
  value: unknown,
}

export interface IConfig {
  debug: boolean,
  blockMovement: boolean,
  cellSize: number,
  cameraScrollSpeed: number,
  cameraLowerLimit: number,
  cameraUpperLimit: number,
  cameraLowerAlpha: number,
  cameraUpperAlpha: number,
  cameraLowerBeta: number,
  cameraUpperBeta: number,
  cameraPosition: Vector3,

  cameraFOV: number,
  ambientLightColor: Color3,
  ambientLightIntensity: number,

  directionalLightIntensity: number,

  toneMappingEnabled: boolean,
  toneMappingType: number,
  exposure: number,
  contrast: number,

  animationBlendingSpeed: number
}
