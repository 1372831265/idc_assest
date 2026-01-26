import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
const envMapUrl = '/assets/3d/env.hdr';
import RackModel from './RackModel';

const Scene = ({ rack, devices, selectedDeviceId, onDeviceClick, onDeviceLeave, onDeviceHover, tooltipFields, deviceSlideEnabled = true }) => {
  return (
    <Canvas shadows dpr={[1, 1.2]} performance={{ min: 0.5 }}>
      <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={50} />
      
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[5, 8, 5]} intensity={2} color="#ffffff" castShadow />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      <Suspense fallback={null}>
        <Environment files={envMapUrl} blur={0.5} resolution={256} background={false} />
      </Suspense>
      
      {/* Models */}
      <group position={[0, 0, 0]}>
        <RackModel 
          rack={rack} 
          devices={devices} 
          selectedDeviceId={selectedDeviceId}
          onDeviceClick={onDeviceClick}
          onDeviceLeave={onDeviceLeave}
          onDeviceHover={onDeviceHover}
          tooltipFields={tooltipFields}
          deviceSlideEnabled={deviceSlideEnabled}
        />
      </group>
      
      {/* Controls */}
      <OrbitControls 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 1.75}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        mouseButtons={{
          LEFT: 0, // 左键旋转
          MIDDLE: 2, // 中键平移
          RIGHT: 0 // 右键禁用
        }}
        touches={{
          ONE: 1, // 单指旋转
          TWO: 2 // 双指平移
        }}
        target={[0, (rack?.height || 45) * 0.04445 / 2 + 0.1, 0]} // Focus on middle of rack
      />
    </Canvas>
  );
};

export default Scene;