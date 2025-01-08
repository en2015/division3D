import { Color3, HemisphericLight, Material, Mesh, MeshBuilder, ShaderMaterial, StandardMaterial, Vector3, VideoTexture } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";

const initProjectionPlane = async ({ world: w, components: c, entities: e }: ISystem) => {
  const projection = MeshBuilder.CreatePlane("plane", { width: 1, height: 1, sideOrientation: Mesh.DOUBLESIDE });
  projection.position.y = 1;
  projection.visibility = 0.999999;
  projection.isPickable = false;
  projection.material = new StandardMaterial("std", w.scene);
  projection.setEnabled(false);
  projection.scaling.x = 0;
  projection.scaling.y = 0;
  projection.rotation.x -= 0.2;
  projection.renderingGroupId = 1;

  // (projection.material as StandardMaterial).diffuseTexture = new VideoTexture("video", "videos/illyria.webm", w.scene, true);


  const overlay = MeshBuilder.CreatePlane("plane", { width: 1, height: 1, sideOrientation: Mesh.DOUBLESIDE });
  overlay.position.y = 1;
  overlay.renderingGroupId = 2;
  overlay.visibility = 0.01;
  overlay.isPickable = false;
  overlay.material = new StandardMaterial("std", w.scene);
  overlay.position.z += 0.01;
  overlay.setEnabled(false);
  (overlay.material as StandardMaterial).diffuseColor = new Color3(0.6, 0.6, 1);
  (overlay.material as StandardMaterial).emissiveColor = new Color3(0.07, 0.07, 0.14);

  overlay.scaling.x = 0;
  overlay.scaling.y = 0;
  overlay.rotation = projection.rotation;


  w.entityManager.addComponent(
    e.projectionPlane,
    c.content
  );


  w.entityManager.addComponent(
    e.projectionPlane,
    c.projectionPlane,
    { projection: projection, overlay: overlay }
  );

  w.entityManager.addComponent(e.projectionPlane, c.standardAnimation, []);

  const laserBeamMesh = MeshBuilder.CreateCylinder("laserBeam", {
    height: 0.3,
    diameterTop: 0.01,
    diameterBottom: 0.01,
    tessellation: 6
  }, w.scene);
  laserBeamMesh.scaling.y = 0;
  const laserMaterial = new StandardMaterial("laserMaterial", w.scene);
  laserMaterial.emissiveColor = new Color3(0, 0, 1); // Green glow
  laserMaterial.backFaceCulling = true;

  // Apply the material to the laser beam
  laserBeamMesh.material = laserMaterial;
  //laserBeam.position.y += 0.5; // Slightly above the click point
  laserBeamMesh.scaling.y = 0; // Start with zero height
  //animateLaserBeam(laserBeam);
  laserMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;

  laserBeamMesh.setEnabled(false);

  const vertexShaderCode = await loadShaderFile("./Shaders/hologramVertex.glsl");
  const fragmentShaderCode = await loadShaderFile("./Shaders/hologramFragment.glsl");

  // Create the Babylon ShaderMaterial
  const hologramMaterial = new ShaderMaterial("hologramShader", w.scene, {
    vertexSource: vertexShaderCode,
    fragmentSource: fragmentShaderCode,
  }, {
    attributes: ["position", "uv"],
    uniforms: [
      "worldViewProjection",
      "uColor", "uBorderColor",
      "uCornerRadius", "uBorderThickness",
      "uGridThickness", "uGridSubdivisions",
      "uBandWidth", "uBandSpeed", "uTime",
      "textureSampler", "uEffectIntensity"
    ]
  });



  //   //const baseTexture = new Texture("./earth-planisphere.jpeg", this.scene);
  //   // Assign the color and texture properties
  //   hologramMaterial.setColor3("uColor", new Color3(0.0, 0.8, 1)); // Set your desired color here
  //   //hologramMaterial.setTexture("textureSampler", (projection!.material! as StandardMaterial)!.diffuseTexture ); // Replace with your texture object
  //   // Assign properties
  //   hologramMaterial.setColor3("uBorderColor", new Color3(1, 1, 1)); // Border color
  //   hologramMaterial.setFloat("uCornerRadius", 0.5);
  //   hologramMaterial.setFloat("uBorderThickness", 0.1);
  //   hologramMaterial.setFloat("uGridThickness", 0.2);
  //   hologramMaterial.setFloat("uGridSubdivisions", 0);
  //   hologramMaterial.setFloat("uBandWidth", 0.2);
  //   hologramMaterial.setFloat("uBandSpeed", 0.2);
  //   hologramMaterial.setFloat("uEffectIntensity",0.3)
  // //  hologramMaterial.alpha = 0.9; // Adjust as necessary (0.0 to 1.0)
  //   hologramMaterial.backFaceCulling = false;

  //   let time = 0;
  //   overlay.material = hologramMaterial
  //   w.scene.onBeforeRenderObservable.add(() => {
  //     const deltaTimeInSeconds = w.scene.getEngine().getDeltaTime() / 500; // Convert to seconds
  //     time += deltaTimeInSeconds;
  //     hologramMaterial.setFloat("uTime", time);
  // });
  w.entityManager.addComponent(e.laserBeam, c.projectionLaserBeam);
  w.entityManager.addComponent(e.laserBeam, c.mesh, laserBeamMesh)


};
async function loadShaderFile(url: string) {
  const response = await fetch(url);
  return response.text();
}
export default initProjectionPlane;

