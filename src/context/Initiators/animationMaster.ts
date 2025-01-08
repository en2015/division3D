import { GlowLayer, HemisphericLight, Animation } from "@babylonjs/core";
import ISystem, { IAnimation, ICutSceneMaster } from "../types";
import { Config } from "../constants";
import { startCharacterAnimation, startProjectionCube } from "../Systems/projection";

const initAnimationMaster = ({ world: w, components: c, entities: e }: ISystem) => {
  
  const animationMaster = w.entityManager.create();

  const cutscene: ICutSceneMaster = {
    name : "startScene",
    currentFrame: 0,
    maxFrame: 180,
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
        entity : e.platformGlow,
        startFrame: 120,
        endFrame: 150,
        type: 0,
        started: false,
        animation :  {
          name: "platformGlowScale",
          fps: 30,
          property: "scaling.y",
          enabled: true,
          startFrame: 0,
          created: false,
          callback: () => {
          },
          loop: false,
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          keyFrames: [
            {
              frame: 0, 
              value: 0,
            },
            {
              frame: 30, 
              value: 1,
            }, 
          ]
        }
      },
      {
        entity: e.glow,
        startFrame: 90,
        endFrame: 150,
        type: 1,
        started: false,
        animation: { step: 1, currentFrame: 0, property: "intensity", minValue: 0, maxValue: 0.5, duration: 60, callback : () => {
          startCharacterAnimation({ world: w, components: c, entities: e });
        }, animationMaster: animationMaster }
      },
      {
        entity : e.character,
        startFrame: 150,
        endFrame: 180,
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

            const [archetype] = w.query.with(c.projectionCylinders).execute();

            const charMesh = w.entityManager.getComponent(e.character, c.mesh)[w.entityManager.getArchTypeId(e.character)];

            const projectionMesh = archetype.getColumn(c.mesh)[0];
            // projectionMesh.setEnabled(true);

           // startProjectionCube({ world: w, components: c, entities: e }, projectionMesh, charMesh);

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
    animationMaster,
    c.cutsceneMaster,
    cutscene
  );

};

export default initAnimationMaster;
