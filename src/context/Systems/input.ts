import { Matrix, Color3, AbstractMesh, Mesh, Vector3, Animation, StandardMaterial, VideoTexture, HighlightLayer, Axis, Space, MeshBuilder, VolumetricLightScatteringPostProcess, Texture, ShaderMaterial, Material, Vector2, RenderTargetTexture, Camera, ArcRotateCamera } from "@babylonjs/core";
import { GridStatus, MountOrientation, MovementStatus, ObjectHelpers } from "../enums";
import ISystem, { IAnimation } from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import { Config } from "../constants";
import { animateLaserBeam, animateProjectionCube, animateProjectionPlane, startCharacterAnimation, startProjectionCube, stopCharacterAnimation } from "./projection";


export const followMouse = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  const archetypes = w.query.with(c.character).with(c.mesh).without(c.onCutscene).execute();

  if (archetypes.length <= 0) {
    return null;
  }

  for (const archeType of archetypes) {
    for (
      let index = archeType.getEntities().length() - 1;
      index >= 0;
      index--
    ) {

      const entId = archeType.getEntityIdFromIndex(index);

      const mesh: Mesh = archeType.getColumn(c.mesh)[index];

      if (w.scene.pointerX === 0 && w.scene.pointerY === 0) {
        return;
      }

      const target = w.scene.pick(w.scene.pointerX, w.scene.pointerY);
      const highlight = w.entityManager.getComponent(e.highlight, c.highlight)[0];


      if (target.pickedMesh && target.pickedPoint && target.pickedMesh.name === "referencePlane") {

        const camera = w.entityManager.getComponent(e.camera, c.camera)[0];

        const referenceMesh = w.entityManager.getComponent(e.referencePlane, c.mesh)[w.entityManager.getArchTypeId(e.referencePlane)];

        const position = target.pickedPoint.negate();
        position.addInPlace(referenceMesh.forward.scale(10));

        mesh.lookAt(position);

        (highlight as HighlightLayer).removeAllMeshes();

      } else if (target.pickedMesh && target.pickedPoint) {
        const ent = Number(target.pickedMesh.name);
        if (!ent) return;
        const pov = w.entityManager.getComponent(ent, c.pointOfView)[w.entityManager.getArchTypeId(ent)];

        mesh.lookAt(pov)
        // const path = w.entityManager.getComponent(ent, c.pointOfView).path[w.entityManager.getArchTypeId(ent)];

        if (target.pickedMesh.parent) {
          for (const child of target.pickedMesh.parent.getChildMeshes()) {
            (highlight as HighlightLayer).addMesh(child as Mesh, new Color3(0.5, 0.5, 1));
          }
        } else {
          (highlight as HighlightLayer).addMesh(target.pickedMesh as Mesh, new Color3(0.5, 0.5, 1));
        }
        // mesh.lookAt(new Vector3(-target.pickedMesh.position.x, -target.pickedMesh.position.y, target.pi.z));

        return;
      }
    }
  }
};


export const mouseUp = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  let state = w.entityManager.getComponent(e.state, c.state)[w.entityManager.getArchTypeId(e.state)];
  if (state == 1) {
    return
  }
  const [projectionArchetype] = w.query.with(c.projectionCone).with(c.mesh).execute();

  const [LaserBeamArchetype] = w.query.with(c.projectionLaserBeam).with(c.mesh).execute();
  if (!projectionArchetype) {
    return;
  }

  const projEntId = projectionArchetype.getEntityIdFromIndex(0)

  const LaserBeamMesh: Mesh = LaserBeamArchetype.getColumn(c.mesh)[0];
  const projMesh: Mesh = projectionArchetype.getColumn(c.mesh)[0];

  projMesh.setEnabled(false);

  const projection = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).projection[w.entityManager.getArchTypeId(e.projectionPlane)];
  const overlay = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).overlay[w.entityManager.getArchTypeId(e.projectionPlane)];
  LaserBeamMesh.setEnabled(false)
  projection.setEnabled(false);
  overlay.setEnabled(false);
  projMesh.scaling.x = 0;
  projMesh.scaling.y = 0;

  projection.scaling.x = 0;
  projection.scaling.y = 0;

  overlay.scaling.x = 0;
  overlay.scaling.y = 0;

  (projection.material as StandardMaterial).diffuseTexture?.dispose();
  w.entityManager.removeComponent(e.character, c.onCutscene);
  startCharacterAnimation({ world: w, components: c, entities: e });


};

export const mouseDown = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  let state = w.entityManager.getComponent(e.state, c.state)[w.entityManager.getArchTypeId(e.state)];

  if (state == 1) {
    w.entityManager.getComponent(e.state, c.state)[w.entityManager.getArchTypeId(e.state)] = 0
  }
  if (w.entityManager.hasComponent(e.projectionPlane, c.enabled)) {
    return;
  }

  const [charArchetype] = w.query.with(c.character).with(c.mesh).execute();
  const [projectionArchetype] = w.query.with(c.projectionCone).with(c.mesh).execute();
  const [LaserBeamArchetype] = w.query.with(c.projectionLaserBeam).with(c.mesh).execute();

  if (!charArchetype || !projectionArchetype) {
    return;
  }

  const charEntId = charArchetype.getEntityIdFromIndex(0);

  const charMesh: Mesh = charArchetype.getColumn(c.mesh)[0];

  const projEntId = projectionArchetype.getEntityIdFromIndex(0)

  const projMesh: Mesh = projectionArchetype.getColumn(c.mesh)[0];

  const LaserBeamEntID = projectionArchetype.getEntityIdFromIndex(0)
  const LaserBeamMesh: Mesh = LaserBeamArchetype.getColumn(c.mesh)[0];

  const target = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

  if (target.pickedMesh) {
    const entId = Number(target.pickedMesh.name);

    if (isNaN(entId)) {
      return;
    }

    startProjectionCube({ world: w, components: c, entities: e }, projMesh, charMesh);

    const highlight = w.entityManager.getComponent(e.highlight, c.highlight)[0];
    (highlight as HighlightLayer).removeAllMeshes();

    w.entityManager.addComponent(e.character, c.onCutscene);

    console.log("ent id is", entId);

    if (w.entityManager.hasComponent(entId, c.prop) && w.entityManager.hasComponent(entId, c.content)) {

      const path = w.entityManager.getComponent(entId, c.content).path[w.entityManager.getArchTypeId(entId)];
      const type = w.entityManager.getComponent(entId, c.content).type[w.entityManager.getArchTypeId(entId)];
      const width = w.entityManager.getComponent(entId, c.content).width[w.entityManager.getArchTypeId(entId)];
      const height = w.entityManager.getComponent(entId, c.content).height[w.entityManager.getArchTypeId(entId)];
      const pov: Vector3 = w.entityManager.getComponent(entId, c.pointOfView)[w.entityManager.getArchTypeId(entId)].clone();
      const mesh = w.entityManager.getComponent(entId, c.mesh)[w.entityManager.getArchTypeId(entId)];
      console.log(mesh)
      const projection = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).projection[w.entityManager.getArchTypeId(e.projectionPlane)];
      const overlay = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).overlay[w.entityManager.getArchTypeId(e.projectionPlane)];

      LaserBeamMesh.setEnabled(true);
      const referenceMesh = w.entityManager.getComponent(e.referencePlane, c.mesh)[w.entityManager.getArchTypeId(e.referencePlane)];
     // rotateCameraToObject(w.scene.activeCamera as ArcRotateCamera, mesh, 0.2, referenceMesh)
      // Laser effect (create a thin cylinder)
      // const laserBeam = MeshBuilder.CreateCylinder("laserBeam", {
      //   height: 0.5,
      //   diameterTop: 0.01,
      //   diameterBottom: 0.01,
      //   tessellation: 6
      // }, w.scene);
      LaserBeamMesh.position = new Vector3(-pov.x, pov.y - 0.68, -pov.z)
      console.log(target.pickedPoint)
      animateLaserBeam({ world: w, components: c, entities: e }, LaserBeamMesh);
      // // Create the laser beam material
      // const laserMaterial = new StandardMaterial("laserMaterial", w.scene);

      // // Set emissive color to make it glow
      // laserMaterial.emissiveColor = new Color3(0, 0, 1); // Green glow

      // // Optional: Add transparency
      // // laserMaterial.alpha = 0.7;

      // // Optional: Disable backface culling if you want the laser visible from all sides
      // laserMaterial.backFaceCulling = true;

      // // Apply the material to the laser beam
      // laserBeam.material = laserMaterial;
      // //laserBeam.position.y += 0.5; // Slightly above the click point
      // laserBeam.scaling.y = 0; // Start with zero height
      // animateLaserBeam(laserBeam);
      const childMeshes = mesh.getChildMeshes();
      // const materials = childMeshes.map(mesh => mesh.material as Material);
      //const multiMaterial = new MultiMaterial("mergedMultiMaterial", scene);
      // multiMaterial.subMaterials = materials;
      // const renderTexture = new RenderTargetTexture("bakedTexture", { width: 1024, height: 1024 }, w.scene);
      // const mergedMesh = Mesh.MergeMeshes(childMeshes, true, false, null, false, true);
      // renderTexture.renderList!.push(mergedMesh!);
      // const singleMaterial = new StandardMaterial("singleMaterial", w.scene);
      // singleMaterial.diffuseTexture = renderTexture;
      // if (mergedMesh) {
      //   mergedMesh.position = new Vector3(0, 0, 0);
      // }
      // // Function to animate the laser beam upwards
      // const vertexShaderCode = await loadShaderFile("./Shaders/hologramVertex.glsl");
      // const fragmentShaderCode = await loadShaderFile("./Shaders/hologramFragment.glsl");
      // // Create the Babylon ShaderMaterial
      // const hologramMaterial = new ShaderMaterial("hologramShader", w.scene, {
      //   vertexSource: vertexShaderCode,
      //   fragmentSource: fragmentShaderCode,
      // }, {
      //   attributes: ["position", "uv"],
      //   uniforms: [
      //     "worldViewProjection",
      //     "uColor", "uBorderColor",
      //     "uCornerRadius", "uBorderThickness",
      //     "uGridThickness", "uGridSubdivisions",
      //     "uBandWidth", "uBandSpeed", "uTime",
      //     "textureSampler", "uEffectIntensity"
      //   ]
      // });



      // //const baseTexture = new Texture("./earth-planisphere.jpeg", this.scene);
      // // Assign the color and texture properties
      // hologramMaterial.setColor3("uColor", new Color3(0.0, 0.8, 1)); // Set your desired color here
      // const matt = mergedMesh?.material as StandardMaterial;
      // hologramMaterial.setTexture("textureSampler", singleMaterial!.diffuseTexture!); // Replace with your texture object
      // // Assign properties
      // hologramMaterial.setColor3("uBorderColor", new Color3(1, 1, 1)); // Border color
      // hologramMaterial.setFloat("uCornerRadius", 0.5);
      // hologramMaterial.setFloat("uBorderThickness", 0.1);
      // hologramMaterial.setFloat("uGridThickness", 0.2);
      // hologramMaterial.setFloat("uGridSubdivisions", 5);
      // hologramMaterial.setFloat("uBandWidth", 0.2);
      // hologramMaterial.setFloat("uBandSpeed", 0.2);
      // hologramMaterial.setFloat("uEffectIntensity", 0.3)
      // //  hologramMaterial.alpha = 0.9; // Adjust as necessary (0.0 to 1.0)
      // hologramMaterial.backFaceCulling = false;
      // mergedMesh!.material = hologramMaterial
      // let time = 0;
      // //  projection.material = hologramMaterial
      // w.scene.onBeforeRenderObservable.add(() => {
      //   const deltaTimeInSeconds = w.scene.getEngine().getDeltaTime() / 500; // Convert to seconds
      //   time += deltaTimeInSeconds;
      //   hologramMaterial.setFloat("uTime", time);
      // });
      //hologramMaterial.setTexture("textureSampler", (projection!.material! as StandardMaterial)!.diffuseTexture ); // Replace with your texture object

      ////
      projection.position = new Vector3(-pov.x, pov.y - 0.68, -pov.z);
      const camera = w.scene.activeCamera;
      projection.position.y += 0.8;
      projection.lookAt(camera!.position);
      overlay.position = projection.position;
      //  overlay.position.z += 0.01;

      if (type === 0) {
        (projection.material as StandardMaterial).diffuseTexture = new VideoTexture("video", path, w.scene, true);
      }
      overlay.setEnabled(true);
      projection.setEnabled(true);

      stopCharacterAnimation({ world: w, components: c, entities: e });
      animateProjectionCube({ world: w, components: c, entities: e }, projEntId, height, width);


    }
  }




  // function animateLaserBeam(laserBeam: Mesh) {
  //   // Create an animation for scaling the laser's height
  //   const scaleAnimation = new Animation("laserExpandScale", "scaling.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  //   const positionAnimation = new Animation("laserExpandPosition", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

  //   // Keyframes for scaling the laser upwards
  //   const scaleKeyFrames = [
  //     { frame: 0, value: 0 },
  //     { frame: 10, value: 1 } // Expand laser to full height
  //   ];
  //   scaleAnimation.setKeys(scaleKeyFrames);

  //   // Keyframes for adjusting the position upwards to keep the base fixed
  //   const positionKeyFrames = [
  //     { frame: 0, value: laserBeam.position.y },
  //     { frame: 10, value: laserBeam.position.y + 0.5 / 2 } // Adjust for half the target height
  //   ];
  //   positionAnimation.setKeys(positionKeyFrames);

  //   // Add both animations to the laser and start them
  //   laserBeam.animations.push(scaleAnimation);
  //   laserBeam.animations.push(positionAnimation);
  //   w.scene.beginAnimation(laserBeam, 0, 10, false);
  // }

};


export const scroll = ({ world: w, components: c, entities: e }: ISystem) => async (event: any) => {
  const [cameraArchetype] = w.query.with(c.camera).execute();

  if (!cameraArchetype) {
    return;
  }

  const camera = cameraArchetype.getColumn(c.camera)[0];

  const delta = event.deltaY * -0.0012; // Adjust the sensitivity as needed
  camera.alpha += delta; // Modify alpha to rotate horizontally

  const referenceMesh = w.entityManager.getComponent(e.referencePlane, c.mesh)[w.entityManager.getArchTypeId(e.referencePlane)];
  // referenceMesh.visibility = 1;

  referenceMesh.position = Vector3.Zero();
  referenceMesh.rotation.y -= delta;

  const backward = (referenceMesh as Mesh).forward; // Get the backward direction by negating the forward vector
  referenceMesh.position.addInPlace(backward.scale(5)); // Move the mesh along the backward direction

  const directionalLight = w.entityManager.getComponent(e.directionalLight, c.light)[w.entityManager.getArchTypeId(e.directionalLight)];
  let lightDirection = directionalLight.direction.clone();
  const rotationMatrix = Matrix.RotationY(-delta);
  lightDirection = Vector3.TransformNormal(lightDirection, rotationMatrix);
  directionalLight.direction = lightDirection.normalize(); // Update the light's direction

  const projection = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).projection[w.entityManager.getArchTypeId(e.projectionPlane)];
  const overlay = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).overlay[w.entityManager.getArchTypeId(e.projectionPlane)];
  console.log(w.scene.activeCamera)
  projection.lookAt(w.scene.activeCamera?.position)
  overlay.lookAt(w.scene.activeCamera?.position)
  // overlay.position = Vector3.Zero();
  // projection.position = Vector3.Zero();

  overlay.setEnabled(true);
  projection.setEnabled(true);

  // overlay.rotation.y -= delta;
  // projection.rotation.y -= delta;


};
async function loadShaderFile(url: string) {
  const response = await fetch(url);
  return response.text();
}
function rotateCameraToObject(camera: ArcRotateCamera, object: Mesh, offsetAngle: number, referenceMesh: Mesh) {
  // Calculate target alpha with offset
  const objectPosition = object.getAbsolutePosition();
  const deltaX = objectPosition.x - camera.target.x;
  const deltaZ = objectPosition.z - camera.target.z;
  const targetAlpha = Math.atan2(deltaZ, deltaX) + offsetAngle;

 let animating = true; // Set animating flag

  // Add an observable to the render loop
 const animationObservable = camera.getScene().onBeforeRenderObservable.add(() => {
      // Gradually interpolate towards the target alpha
      const step = 0.05; // Adjust the step for smoothness/speed of rotation
      camera.alpha += (targetAlpha - camera.alpha) * step;
      referenceMesh.position = Vector3.Zero();
      referenceMesh.rotation.y -= (targetAlpha - camera.alpha) * step;
    
      const backward = (referenceMesh as Mesh).forward; // Get the backward direction by negating the forward vector
      referenceMesh.position.addInPlace(backward.scale(5)); // Move the mesh along the backward direction
    
      // Stop animating if close enough to the target
      if (Math.abs(targetAlpha - camera.alpha) < 0.001) {
          camera.alpha = targetAlpha; // Snap to target
          animating = false; // Stop animating
          
          // Dispose of the observable
          camera.getScene().onBeforeRenderObservable.remove(animationObservable);
      }
  });
}

