import World from "@/ecs/World";
import { Config } from "../constants";

const initStaticEntities = (world: World) => {
  const entities = {
    camera: world.entityManager.create(),
    ambientLight: world.entityManager.create(),
    directionalLight: world.entityManager.create(),
    pointLight: world.entityManager.create(),
    shadowGenerator: world.entityManager.create(),
    referencePlane: world.entityManager.create(),
    fireflies: world.entityManager.create(),
    glow: world.entityManager.create(),
    highlight: world.entityManager.create(),
    character: world.entityManager.create(),
    platform: world.entityManager.create(),
    platformGlow: world.entityManager.create(),
    state: world.entityManager.create(),
    projectionPlane: world.entityManager.create(),
    laserBeam: world.entityManager.create()
  };

  return entities;
};

export type StaticEntities = ReturnType<typeof initStaticEntities>;
export default initStaticEntities;
