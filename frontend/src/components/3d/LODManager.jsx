import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const LOD_LEVELS = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2
};

export const LOD_DISTANCES = {
  HIGH: 5,
  MEDIUM: 10
};

const createSimplifiedDeviceMesh = (device, uHeight, rackDepth, deviceColor, statusColor) => {
  const depth = rackDepth || 1.0;
  const dHeight = device.height || device.u_height || 1;
  const height = dHeight * uHeight;
  const chassisWidth = 0.44;
  const chassisDepth = 0.8;
  const panelWidth = 0.4826;
  const panelDepth = 0.02;
  const frontZ = depth / 2 - 0.02;
  const halfHeight = height / 2;

  return (
    <group>
      <mesh position={[0, 0, frontZ - panelDepth / 2]}>
        <boxGeometry args={[panelWidth, height - 0.002, panelDepth]} />
        <meshStandardMaterial color={deviceColor} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, frontZ - panelDepth - chassisDepth / 2]}>
        <boxGeometry args={[chassisWidth, height - 0.002, chassisDepth]} />
        <meshStandardMaterial color="#333333" roughness={0.9} metalness={0.3} />
      </mesh>
      <mesh position={[panelWidth/2 - 0.03, halfHeight - 0.02, frontZ + 0.01]}>
        <circleGeometry args={[0.006, 16]} />
        <meshBasicMaterial color={statusColor} toneMapped={false} />
      </mesh>
    </group>
  );
};

const createMediumDeviceMesh = (device, uHeight, rackDepth, deviceColor, statusColor) => {
  const depth = rackDepth || 1.0;
  const dHeight = device.height || device.u_height || 1;
  const height = dHeight * uHeight;
  const chassisWidth = 0.44;
  const chassisDepth = 0.8;
  const panelWidth = 0.4826;
  const panelDepth = 0.02;
  const frontZ = depth / 2 - 0.02;
  const is2U = height > 0.08;
  const halfHeight = height / 2;

  return (
    <group>
      <mesh position={[0, 0, frontZ + 0.0055]}>
        <boxGeometry args={[0.44, height - 0.004, 0.002]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, frontZ - panelDepth / 2]}>
        <boxGeometry args={[panelWidth, height - 0.002, panelDepth]} />
        <meshStandardMaterial color={deviceColor} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, frontZ - panelDepth - chassisDepth / 2]}>
          <boxGeometry args={[chassisWidth, height - 0.002, chassisDepth]} />
          <meshStandardMaterial color="#333333" roughness={0.9} metalness={0.3} />
        </mesh>
      <group position={[-0.18, 0, frontZ + 0.006]}>
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.04, height - 0.01, 0.002]} />
          <meshStandardMaterial color="#000000" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.01, 0.002]}>
          <boxGeometry args={[0.012, 0.01, 0.002]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      <group position={[0.05, 0, frontZ + 0.006]}>
        {Array.from({ length: is2U ? 4 : 2 }).map((_, i) => (
          <mesh key={i} position={[(i - 1) * 0.08, 0, 0]}>
            <boxGeometry args={[0.06, 0.03, 0.004]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        ))}
      </group>
      <mesh position={[panelWidth/2 - 0.03, halfHeight - 0.02, frontZ + 0.01]}>
        <circleGeometry args={[0.006, 16]} />
        <meshBasicMaterial color={statusColor} toneMapped={false} />
      </mesh>
    </group>
  );
};

const LODManager = ({ 
  device, 
  uHeight, 
  rackDepth, 
  position, 
  deviceColor, 
  statusColor, 
  children,
  level = LOD_LEVELS.HIGH
}) => {
  const groupRef = useRef();
  const { camera } = useThree();
  const [lodLevel, setLodLevel] = React.useState(LOD_LEVELS.HIGH);
  const distanceRef = useRef(0);

  useFrame(() => {
    if (groupRef.current) {
      const distance = camera.position.distanceTo(groupRef.current.position);
      distanceRef.current = distance;
      
      let newLevel = LOD_LEVELS.HIGH;
      if (distance > LOD_DISTANCES.MEDIUM) {
        newLevel = LOD_LEVELS.LOW;
      } else if (distance > LOD_DISTANCES.HIGH) {
        newLevel = LOD_LEVELS.MEDIUM;
      }
      
      if (newLevel !== lodLevel) {
        setLodLevel(newLevel);
      }
    }
  });

  if (level !== LOD_LEVELS.HIGH) {
    return children;
  }

  const renderLODMesh = () => {
    switch (lodLevel) {
      case LOD_LEVELS.LOW:
        return createSimplifiedDeviceMesh(device, uHeight, rackDepth, deviceColor, statusColor);
      case LOD_LEVELS.MEDIUM:
        return createMediumDeviceMesh(device, uHeight, rackDepth, deviceColor, statusColor);
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {lodLevel === LOD_LEVELS.HIGH ? children : renderLODMesh()}
    </group>
  );
};

export default LODManager;
