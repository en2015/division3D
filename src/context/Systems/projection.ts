import { NavStates } from "../constants";
import ISystem from "../types";

import { Animation, Color3, Mesh, MeshBuilder, Skeleton, StandardMaterial, Vector3 } from "@babylonjs/core";

export const animateProjectionPlane = ({ world: w, components: c, entities: e }: ISystem, height: number, width: number) => {
  let animations = w.entityManager.getComponent(e.projectionPlane, c.standardAnimation)[0];

  const scaleAnims = [
    {
      name: "scalex",
      fps: 30,
      property: "scaling.x",
      enabled: true,
      startFrame: 0,
      created: false,
      loop: false,
      callback: () => {

      },
      animationType: Animation.ANIMATIONTYPE_FLOAT,
      keyFrames: [
        {
          frame: 0,
          value: 0,
        },
        {
          frame: 15,
          value: 0,
        },
        {
          frame: 20,
          value: width,
        },
      ]
    },
    {
      name: "scaley",
      fps: 30,
      property: "scaling.y",
      enabled: true,
      startFrame: 0,
      created: false,
      loop: false,
      callback: () => {
        let state = w.entityManager.getComponent(e.state, c.state)[w.entityManager.getArchTypeId(e.state)];
        w.entityManager.getComponent(e.state, c.state)[w.entityManager.getArchTypeId(e.state)] = 1
        
      },
      animationType: Animation.ANIMATIONTYPE_FLOAT,
      keyFrames: [
        {
          frame: 0,
          value: 0,
        },
        {
          frame: 15,
          value: 0,
        },
        {
          frame: 20,
          value: height,
        },
      ]
    }
  ];

  for (const anim of scaleAnims) {
    animations.push(anim);
  }
};

export const animateProjectionCube = ({ world: w, components: c, entities: e }: ISystem, projEntId: number, height: number, width: number) => {
  if (!w.entityManager.hasComponent(projEntId, c.standardAnimation)) {
    w.entityManager.addComponent(projEntId, c.standardAnimation, []);
  }
  let projAnimations = w.entityManager.getComponent(projEntId, c.standardAnimation)[w.entityManager.getArchTypeId(projEntId)];

  projAnimations.push(
    {
      name: "scalezplane",
      fps: 30,
      property: "scaling.z",
      enabled: true,
      startFrame: 0,
      created: false,
      loop: false,
      callback: () => {
        animateProjectionPlane({ world: w, components: c, entities: e }, height, width);
      },
      animationType: Animation.ANIMATIONTYPE_FLOAT,
      keyFrames: [
        {
          frame: 0,
          value: 0,
        },
        {
          frame: 5,
          value: -1,
        },
      ]
    }
  );
  projAnimations.push({
    name: "scaleyplane",
    fps: 30,
    property: "scaling.x",
    enabled: true,
    startFrame: 0,
    created: false,
    loop: false,
    callback: () => {
    },
    animationType: Animation.ANIMATIONTYPE_FLOAT,
    keyFrames: [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 5,
        value: 1,
      },
    ]
  });

  projAnimations.push({
    name: "scaleyplane",
    fps: 30,
    property: "scaling.y",
    enabled: true,
    startFrame: 0,
    created: false,
    loop: false,
    callback: () => {
    },
    animationType: Animation.ANIMATIONTYPE_FLOAT,

    keyFrames: [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 10,
        value: 20,
      },
    ]
  });

}

export const startProjectionCube = ({ world: w, components: c, entities: e }: ISystem, projMesh: Mesh, charMesh: Mesh) => {
  if (!projMesh.isEnabled()) {
    projMesh.setEnabled(true);

    console.log(projMesh)
    console.log(charMesh.getChildMeshes()[0].skeleton!.bones)

    projMesh.attachToBone(charMesh.getChildMeshes()[0].skeleton!.bones[6], charMesh);
    projMesh.position.y = charMesh.getChildMeshes()[0].skeleton!.bones[6].position.y - 0.3


  }
}

export const animateLaserBeam = ({ world: w, components: c, entities: e }: ISystem, laserBeam: Mesh) => {
  // Create an animation for scaling the laser's height
  const scaleAnimation = new Animation("laserExpandScale", "scaling.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  const positionAnimation = new Animation("laserExpandPosition", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

  // Keyframes for scaling the laser upwards
  const scaleKeyFrames = [
    { frame: 0, value: 0 },
    { frame: 10, value: 0 },

    { frame: 20, value: 1 } // Expand laser to full height
  ];
  scaleAnimation.setKeys(scaleKeyFrames);

  // Keyframes for adjusting the position upwards to keep the base fixed
  const positionKeyFrames = [
    { frame: 0, value: laserBeam.position.y },
    { frame: 10, value: laserBeam.position.y },

    { frame: 20, value: laserBeam.position.y + 0.3 / 2 } // Adjust for half the target height
  ];
  positionAnimation.setKeys(positionKeyFrames);

  // Add both animations to the laser and start them
  laserBeam.animations.push(scaleAnimation);
  laserBeam.animations.push(positionAnimation);
  w.scene.beginAnimation(laserBeam, 0, 45, false);
}


export const stopCharacterAnimation = ({ world: w, components: c, entities: e }: ISystem) => {
  w.scene.animationGroups[0].start();
  w.scene.animationGroups[0].loopAnimation = true;
  w.scene.animationGroups[1].stop();

}

export const startCharacterAnimation = ({ world: w, components: c, entities: e }: ISystem) => {
  w.scene.animationGroups[1].start();
  w.scene.animationGroups[1].loopAnimation = true;
  w.scene.animationGroups[0].stop();

}

