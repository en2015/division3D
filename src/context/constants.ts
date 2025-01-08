import { Color3, Color4, ImageProcessingConfiguration, Vector3 } from "@babylonjs/core";
import { IConfig, ILandmark } from "./types";

export enum NavStates {
  Free = 0,
  Locked = 1,
  InAction = 2
}

export const Landmarks: Array<ILandmark> = [
  {
    position: new Vector3(-1.5, 0, 2),
    path: "assets/models/illyria.glb",
    contentType: 0,
    contentPath: "videos/illyria.webm",
    contentWidth: -2,
    contentHeight: 1,
    pointOfView: new Vector3(1.4444393897879078, 1.0185350423417545,
      -2.163848034905117)
  },
  {
    position: new Vector3(1.5, 0, 2),
    path: "assets/models/plane.glb",
    contentType: 0,
    contentPath: "videos/tmt.mp4",
    contentWidth: -2,
    contentHeight: 1,
    pointOfView: new Vector3(-1.4279038803295565, 1.036356511723174423, -2.1586169075275174)
  }
];

export const Config: IConfig = {
  debug: false,
  cellSize: 0.0628,
  blockMovement: false,

  cameraScrollSpeed: 0.01,
  cameraLowerLimit: 3,
  cameraUpperLimit: 5,
  cameraLowerAlpha: Math.PI / 2,
  cameraUpperAlpha: Math.PI / 2,
  cameraLowerBeta: Math.PI / 2.5,
  cameraUpperBeta: Math.PI / 2.5,
  cameraPosition: new Vector3(0, 0.2, 0),

  cameraFOV: 1.0,
  ambientLightColor: new Color3(255 / 255, 0 / 255, 0 / 255),
  ambientLightIntensity: 0.2,

  directionalLightIntensity: 1.2,

  toneMappingEnabled: true,
  toneMappingType: ImageProcessingConfiguration.TONEMAPPING_ACES,
  exposure: 1.5,
  contrast: 1.5,



  
  animationBlendingSpeed: 0.05,
}
