import World from "@/ecs/World";
import { Type } from "@/ecs/utilities/Types";

const initStaticComponents = (world: World) => {
  const components = {
    camera: world.schemaManager.register(Type.Custom),
    transform: world.schemaManager.register({ position: Type.Custom, rotation: Type.Custom, scaling: Type.Custom}),
    light: world.schemaManager.register(Type.Custom),
    shadowGenerator: world.schemaManager.register(Type.Custom),
    mesh: world.schemaManager.register(Type.Custom),
    shadowsLight: world.schemaManager.register(Type.Tag),
    flat : world.schemaManager.register(Type.Tag),
    rotatable: world.schemaManager.register(Type.Tag),
    active: world.schemaManager.register(Type.Tag),
    enabled: world.schemaManager.register(Type.Tag),
    shadows: world.schemaManager.register({ casts: Type.Boolean, receives: Type.Boolean}),
    pointOfView: world.schemaManager.register(Type.Custom),
    loadable: world.schemaManager.register({
      path: Type.String,
      position: Type.Custom
    }),
    state: world.schemaManager.register(Type.Custom),
    clickable: world.schemaManager.register(Type.Tag),
    onCutscene: world.schemaManager.register(Type.Tag),
    character: world.schemaManager.register(Type.Custom),
    projectionCylinders: world.schemaManager.register(Type.Tag),
    projectionCone: world.schemaManager.register(Type.Tag),
    projectionLaserBeam: world.schemaManager.register(Type.Tag),

    highlight: world.schemaManager.register(Type.Custom),
    gpuParticleSystem: world.schemaManager.register(Type.Custom),
    standardAnimation: world.schemaManager.register(Type.Custom),
    customAnimation : world.schemaManager.register(Type.Custom),
    glow: world.schemaManager.register(Type.Custom),
    cutsceneMaster: world.schemaManager.register(Type.Custom),
    prop: world.schemaManager.register(Type.Tag),
    content: world.schemaManager.register({path: Type.Custom, type: Type.Int16, width: Type.Int16, height: Type.Int16, point: Type.Custom}),
    projectionPlane: world.schemaManager.register({overlay: Type.Custom, projection: Type.Custom}),

  };

  return components;
};

export type StaticComponents = ReturnType<typeof initStaticComponents>;
export default initStaticComponents;
