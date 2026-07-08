import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function MonolithCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      <cylinderGeometry args={[1.5, 1.5, 5, 6]} />
      <meshPhysicalMaterial
        color="#EAE0C8"
        metalness={0.5}
        roughness={0.1}
        transmission={0.6}
        thickness={1.2}
        ior={1.9}
        emissive="#D4AF37"
        emissiveIntensity={0.1}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function FloatingShard({
  position,
  scale,
  geometry,
}: {
  position: [number, number, number];
  scale: number;
  geometry: "icosahedron" | "torusKnot";
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + position[0]) * 0.5;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  const geo = useMemo(() => {
    if (geometry === "icosahedron") {
      return new THREE.IcosahedronGeometry(scale, 0);
    }
    return new THREE.TorusKnotGeometry(scale * 0.5, scale * 0.15, 64, 8);
  }, [geometry, scale]);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position} geometry={geo}>
        <meshPhysicalMaterial
          color="#EAE0C8"
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
          ior={2.0}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  );
}

function HolographicParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const goldColor = new THREE.Color("#D4AF37");
    const creamColor = new THREE.Color("#EAE0C8");
    const bronzeColor = new THREE.Color("#8B7355");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;

      const colorChoice = Math.random();
      let c: THREE.Color;
      if (colorChoice < 0.4) c = goldColor;
      else if (colorChoice < 0.7) c = creamColor;
      else c = bronzeColor;

      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += 0.005 + Math.sin(time * 0.1 + i) * 0.002;
      arr[i3] += Math.sin(time * 0.2 + i * 0.1) * 0.001;

      if (arr[i3 + 1] > 10) {
        arr[i3 + 1] = -10;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function VolumetricRays() {
  return (
    <group position={[0, 3.5, 0]}>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <coneGeometry args={[1.5, 4, 6, 1, true]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 6, 0]} position={[0.3, 0, 0]}>
        <coneGeometry args={[1.2, 3.5, 6, 1, true]} />
        <meshBasicMaterial
          color="#EAE0C8"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.1,
        0.02
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.y * 0.05,
        0.02
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#0A0A0F" />

      {/* Key directional light - gold */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#D4AF37"
        castShadow
      />

      {/* Rim lights */}
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#8B7355" />
      <pointLight position={[3, -2, -2]} intensity={0.3} color="#C0392B" />

      <MonolithCore />

      <FloatingShard
        position={[-3, 1, -1]}
        scale={0.4}
        geometry="icosahedron"
      />
      <FloatingShard
        position={[3, -1, -2]}
        scale={0.3}
        geometry="torusKnot"
      />
      <FloatingShard
        position={[-2, -2, 1]}
        scale={0.25}
        geometry="icosahedron"
      />
      <FloatingShard
        position={[2.5, 2, -1.5]}
        scale={0.35}
        geometry="torusKnot"
      />

      <VolumetricRays />
      <HolographicParticles />
    </group>
  );
}

export default function DataCore() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, -2, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <fog attach="fog" args={["#0A0A0F", 10, 25]} />
        <Scene />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
