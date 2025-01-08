import ISystem from "../types";
import initCamera from "./camera";
import initLight from "./ambientLight";
import initReferencePlane from "./referencePlane";
import initSkybox from "./skybox";
import { Config, Landmarks, NavStates } from "../constants";
import initAmbientLight from "./ambientLight";
import initDirectionalLight from "./directionalLight";
import initShadowGenerator from "./shadowGenerator";
import { BloomEffect, Color3, Color4, CreateCylinder, DefaultRenderingPipeline, GlowLayer, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import initFireflies from "./particleSystems";
import initGlow from "./glow";
import initAnimationMaster from "./animationMaster";
import initProjectionPlane from "./projectionPlane";
import initHighlightLayer from "./initHighlightLayer";


const tempInitRoom = ({ world: w, components: c, entities: e }: ISystem) => {


  for (const landmarkDef of Landmarks) {
    const landmark = w.entityManager.create();
    w.entityManager.addComponent(landmark, c.loadable, { path: landmarkDef.path });
    // w.entityManager.addComponent(landmark, c.flat);
    w.entityManager.addComponent(landmark, c.transform, { position: landmarkDef.position, rotation: Vector3.Zero(), scaling: Vector3.One() });
    w.entityManager.addComponent(landmark, c.clickable);
    w.entityManager.addComponent(landmark, c.prop);
    w.entityManager.addComponent(landmark, c.pointOfView, landmarkDef.pointOfView);

    w.entityManager.addComponent(landmark, c.content, { type: landmarkDef.contentType, path: landmarkDef.contentPath, width: landmarkDef.contentWidth, height: landmarkDef.contentHeight, point: landmarkDef.pointOfView });
    w.entityManager.addComponent(landmark, c.shadows, { casts: true, receives: true });
  }

  e.platform = w.entityManager.create();
  w.entityManager.addComponent(e.platform, c.loadable, {
    path: "assets/models/platform.glb"
  });
  w.entityManager.addComponent(e.platform, c.shadows, { casts: true, receives: true });

  e.platformGlow = w.entityManager.create();
  w.entityManager.addComponent(e.platformGlow, c.loadable, {
    path: "assets/models/platformGlow.glb"
  });
  w.entityManager.addComponent(e.platformGlow, c.transform, { position: null, rotation: null, scaling: new Vector3(1, 0, 1) });

  const projectionCylinder = w.entityManager.create();
  w.entityManager.addComponent(projectionCylinder, c.loadable, {
    path: "assets/models/projectionCylinder.glb"
  });
  w.entityManager.addComponent(projectionCylinder, c.shadows, { casts: false, receives: false });
  const projectionCone = w.entityManager.create();
  const cone = CreateCylinder("projectionCone", {
    height: 0.1,            // Length of the cone
    diameterTop: 0.01,    // Smaller radius (pointed end)
    diameterBottom: 0.3, // Larger radius (base end)
    tessellation: 32     // Smoothness of the cone
  }, w.scene);
  cone.setPivotPoint(new Vector3(0, -0.05, 0))
  cone.rotation.x = -3.14 / 2;
  cone.setEnabled(false)


  // const coneMaterial = new StandardMaterial("coneMaterial", w.scene);
  // // coneMaterial.diffuseColor = new Color3(1, 0, 0); // Red color
  // coneMaterial.alpha = 0.05;
  // cone.material = coneMaterial;

  // const laserBeam = w.entityManager.create();
  // const laserBeamMesh = MeshBuilder.CreateCylinder("laserBeam", {
  //   height: 0.5,
  //   diameterTop: 0.01,
  //   diameterBottom: 0.01,
  //   tessellation: 6
  // }, w.scene);

  // w.entityManager.addComponent(laserBeam, c.projectionLaserBeam);
  // w.entityManager.addComponent(laserBeam, c.mesh, laserBeamMesh)

  w.entityManager.addComponent(projectionCylinder, c.projectionCylinders);
  w.entityManager.addComponent(projectionCone, c.projectionCone);
  w.entityManager.addComponent(projectionCone, c.mesh, cone);


  w.entityManager.addComponent(e.character, c.loadable, { path: "assets/models/divi.glb" });
  w.entityManager.addComponent(e.character, c.character);
  w.entityManager.addComponent(e.character, c.onCutscene);
  w.entityManager.addComponent(e.character, c.shadows, { casts: true, receives: true });
  w.entityManager.addComponent(e.character, c.transform, { position: Vector3.Zero(), rotation: new Vector3(-0.5, Math.PI, 0), scaling: null })


  const terrain = w.entityManager.create();
  w.entityManager.addComponent(terrain, c.loadable, { path: "assets/models/terrain.glb" });
  w.entityManager.addComponent(terrain, c.flat);
  w.entityManager.addComponent(terrain, c.shadows, { casts: false, receives: true });
  w.entityManager.addComponent(e.state, c.state, "0")
  // const tree = w.entityManager.create();
  // w.entityManager.addComponent(tree, c.loadable, {path: "assets/models/tree.glb"});
  // w.entityManager.addComponent(tree, c.shadows, { casts: true, receives: true});
  // w.entityManager.addComponent(tree, c.transform, { position: new Vector3(5, 0, -1), rotation: Vector3.Zero(), scaling: Vector3.One()});


  const dome = w.entityManager.create();
  w.entityManager.addComponent(dome, c.loadable, { path: "assets/models/dome.glb" });

};

const initWorld = (props: ISystem) => {

  props.world.scene.imageProcessingConfiguration.toneMappingEnabled = Config.toneMappingEnabled;
  props.world.scene.imageProcessingConfiguration.toneMappingType = Config.toneMappingType;
  props.world.scene.imageProcessingConfiguration.exposure = Config.exposure;
  props.world.scene.imageProcessingConfiguration.contrast = Config.contrast;

  props.world.scene.imageProcessingConfiguration.vignetteEnabled = true;
  props.world.scene.imageProcessingConfiguration.vignetteWeight = 0.5;
  props.world.scene.imageProcessingConfiguration.vignetteColor = new Color4(0, 0.0, 1.0, 0);
  props.world.scene.imageProcessingConfiguration.vignetteStretch = 5;
  props.world.scene.fogEnabled = true;
  props.world.scene.fogDensity = 0.015;
  props.world.scene.fogColor = Color3.Red();
  props.world.scene.fogMode = Scene.FOGMODE_EXP2;


  initCamera(props);
  initDirectionalLight(props);
  initAmbientLight(props);
  initShadowGenerator(props);
  initSkybox(props);
  initReferencePlane(props);
  initFireflies(props);
  tempInitRoom(props);
  initGlow(props);
  initAnimationMaster(props);
  initProjectionPlane(props);
  initHighlightLayer(props);
};

export default initWorld;
export { initCamera, initLight, initReferencePlane, initSkybox };
