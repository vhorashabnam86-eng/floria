"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function CreatureCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;
    let isDisposed = false;

    // Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Ambient & Directional Lighting matching Floria's moonlit garden aesthetic
    const ambientLight = new THREE.AmbientLight(0x7c6ab4, 1.8);
    scene.add(ambientLight);

    // Moonlight key light from top-right
    const moonLight = new THREE.DirectionalLight(0xe0e7ff, 3.2);
    moonLight.position.set(3, 5, 4);
    scene.add(moonLight);

    // Warm lantern rim light from below/front
    const lanternLight = new THREE.PointLight(0xf59e0b, 3.5, 8);
    lanternLight.position.set(0, -1.6, 1.5);
    scene.add(lanternLight);

    // Subtle magical purple/pink rim light
    const floraLight = new THREE.PointLight(0xd946ef, 2.5, 6);
    floraLight.position.set(-2, 0.7, 1.5);
    scene.add(floraLight);

    // Firelight abdomen local point light
    const abdomenGlow = new THREE.PointLight(0x34d399, 2.0, 4);
    abdomenGlow.position.set(0, -0.58, 0);
    scene.add(abdomenGlow);

    // Mouse tracking state
    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
    };

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouse.targetX = (e.clientX / innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // Model references
    let creatureRoot: THREE.Group | null = null;
    let headBone: THREE.Bone | null = null;
    let leftWing: THREE.Bone | null = null;
    let rightWing: THREE.Bone | null = null;
    let buttMesh: THREE.Mesh | null = null;

    let baseLeftWingRot = { x: -Math.PI / 2, y: 0, z: -Math.PI };
    let baseRightWingRot = { x: -Math.PI / 2, y: 0, z: 0 };
    let baseHeadRot = { x: 0, y: 0, z: 0 };

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      "/3dmodel/creature.glb",
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;

        // Compute bounding box and center creature
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Center geometry offset
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Creature wrapper to allow rotation & positioning around center
        const wrapper = new THREE.Group();
        wrapper.add(model);

        // Scale to 10% bigger prominent size (1.9 * 1.1 = 2.09)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = (1.9 * 1.1) / (maxDim || 1);
        wrapper.scale.setScalar(scaleFactor);

        // Default forward orientation facing viewer
        // Creature front faces -X in original model, so rotate -PI/2 around Y to face camera (+Z)
        wrapper.rotation.set(0.12, -Math.PI / 2, 0);

        // Base position: bottom center of hero section, moved 10% more towards the bottom
        wrapper.position.set(0, -0.58, 0);

        scene.add(wrapper);
        creatureRoot = wrapper;

        // Locate bones and meshes
        model.traverse((child) => {
          if (child instanceof THREE.Bone) {
            if (child.name === "Bone_2") {
              headBone = child;
              baseHeadRot = { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z };
            } else if (child.name === "LeftWing_0") {
              leftWing = child;
              baseLeftWingRot = { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z };
            } else if (child.name === "RightWing_1") {
              rightWing = child;
              baseRightWingRot = { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z };
            }
          }

          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Enhance glowing abdomen (butt material)
            if (child.name === "Object_10" || child.material?.name === "butt") {
              buttMesh = child;
              if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive = new THREE.Color(0x10b981);
                child.material.emissiveIntensity = 1.8;
                child.material.roughness = 0.25;
              }
            } else if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.roughness = Math.min(child.material.roughness || 0.5, 0.45);
              child.material.metalness = Math.max(child.material.metalness || 0.1, 0.2);
            }
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading Dusk 3D creature model:", error);
      }
    );

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp towards cursor - fast & responsive sensitivity
      const lerpFactor = 0.18;
      mouse.currentX += (mouse.targetX - mouse.currentX) * lerpFactor;
      mouse.currentY += (mouse.targetY - mouse.currentY) * lerpFactor;

      if (creatureRoot) {
        // Natural hovering float around base bottom-center position
        const baseY = -0.58;
        const hoverY = Math.sin(elapsedTime * 2.2) * 0.08;
        const hoverX = Math.cos(elapsedTime * 1.5) * 0.04;
        creatureRoot.position.y = baseY + hoverY + mouse.currentY * 0.12;
        // Butterfly moves right when mouse is on right, moves left when mouse is on left
        creatureRoot.position.x = hoverX + mouse.currentX * 0.35;
        abdomenGlow.position.y = creatureRoot.position.y;
        abdomenGlow.position.x = creatureRoot.position.x;

        // Model looks and turns towards cursor:
        // Yaw: inverted so when mouse pointer moves right, wings & body face to the right
        const targetYaw = -Math.PI / 2 - mouse.currentX * 0.75;
        // Pitch (up / down rotation)
        const targetPitch = 0.12 - mouse.currentY * 0.45;
        // Roll / Banking into the turn
        const targetRoll = mouse.currentX * 0.25;

        creatureRoot.rotation.y = THREE.MathUtils.lerp(creatureRoot.rotation.y, targetYaw, 0.18);
        creatureRoot.rotation.x = THREE.MathUtils.lerp(creatureRoot.rotation.x, targetPitch, 0.18);
        creatureRoot.rotation.z = THREE.MathUtils.lerp(creatureRoot.rotation.z, targetRoll, 0.18);

        // Head bone follows cursor with matching direction
        if (headBone) {
          headBone.rotation.y = baseHeadRot.y - mouse.currentX * 0.45;
          headBone.rotation.x = baseHeadRot.x - mouse.currentY * 0.35;
          headBone.rotation.z = baseHeadRot.z + mouse.currentX * 0.2;
        }

        // Wings animate and follow cursor direction
        // Fast flutter + fluttering frequency response
        const flutter = Math.sin(elapsedTime * 12) * 0.28;
        const speedInfluence = Math.abs(mouse.targetX - mouse.currentX) * 2.5;
        const dynamicFlutter = flutter * (1 + speedInfluence);

        if (leftWing) {
          leftWing.rotation.z =
            baseLeftWingRot.z +
            dynamicFlutter -
            mouse.currentX * 0.35 +
            mouse.currentY * 0.2;
          leftWing.rotation.x =
            baseLeftWingRot.x - mouse.currentY * 0.3 - mouse.currentX * 0.15;
        }

        if (rightWing) {
          rightWing.rotation.z =
            baseRightWingRot.z -
            dynamicFlutter -
            mouse.currentX * 0.35 -
            mouse.currentY * 0.2;
          rightWing.rotation.x =
            baseRightWingRot.x - mouse.currentY * 0.3 + mouse.currentX * 0.15;
        }

        // Abdomen bioluminescent pulse
        if (buttMesh && buttMesh.material instanceof THREE.MeshStandardMaterial) {
          const pulse = 1.6 + Math.sin(elapsedTime * 3.5) * 0.6;
          buttMesh.material.emissiveIntensity = pulse;
          abdomenGlow.intensity = pulse * 1.5;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[1000] pointer-events-none flex items-center justify-center overflow-hidden opacity-70"
      style={{ zIndex: 1000, opacity: 0.7 }}
      id="creature-3d-container"
    >
      <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
    </div>
  );
}
