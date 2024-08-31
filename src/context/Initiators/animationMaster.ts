import { GlowLayer, HemisphericLight, Animation } from "@babylonjs/core";
import ISystem, { IAnimation, ICutSceneMaster } from "../types";
import { Config } from "../constants";

const initAnimationMaster = ({ world: w, components: c, entities: e }: ISystem) => {
  
  const cutscene: ICutSceneMaster = {
    name : "startScene",
    currentFrame: 0,
    scenes : [
      {
        entity : e.camera,
        startFrame: 0,
        endFrame: 120,
        type: 0,
        started: false,
        animation :  {
          name: "initialCameraMovement",
          fps: 30,
          property: "radius",
          enabled: true,
          startFrame: 0,
          created: false,
          loop: false,
          callback : () => {
            const camera = w.entityManager.getComponent(e.camera, c.camera)[0];
            camera.lowerRadiusLimit = Config.cameraLowerLimit;
          },
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          keyFrames: [
            {
              frame: 0, 
              value: 0,
            },
            {
              frame: 120, 
              value: Config.cameraUpperLimit,
            }, 
          ]
        }
      },
      {
        entity: e.glow,
        startFrame: 30,
        endFrame: 90,
        type: 1,
        started: false,
        animation: { step: 1, currentFrame: 0, property: "intensity", minValue: 0, maxValue: 0.5, duration: 60, callback : () => {}, animationMaster: e.animationMaster }
      },
      {
        entity : e.character,
        startFrame: 90,
        endFrame: 120,
        type: 0,
        started: false,
        animation :  {
          name: "character",
          fps: 30,
          property: "rotation.x",
          enabled: true,
          startFrame: 0,
          created: false,
          callback: () => {
            w.entityManager.removeComponent(e.character, c.onCutscene);
            w.entityManager.addComponent(e.platform, c.rotatable);
          },
          loop: false,
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          keyFrames: [
            {
              frame: 0, 
              value: -0.5,
            },
            {
              frame: 30, 
              value: 0,
            }, 
          ]
        }
      },
    ]
  }
  
  w.entityManager.addComponent(
    e.animationMaster,
    c.cutsceneMaster,
    cutscene
  );

};

export default initAnimationMaster;
