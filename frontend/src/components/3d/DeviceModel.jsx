import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PERFORMANCE_MODE = true;

const InstancedStatusLights = ({ count, positions, colors: statusColors, zOffset }) => {
    const meshRef = useRef();
    const colorArray = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const color = new THREE.Color(statusColors[i] || '#22c55e');
            arr[i * 3] = color.r;
            arr[i * 3 + 1] = color.g;
            arr[i * 3 + 2] = color.b;
        }
        return arr;
    }, [count, statusColors]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y, positions[i].z + zOffset);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count, positions, zOffset, dummy]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <circleGeometry args={[0.0015, 8]} />
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    );
};

const InstancedDriveBays = ({ count, positions, color, hasDetail = true }) => {
    const meshRef = useRef();
    const detailRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
        if (detailRef.current && hasDetail) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x + 0.04, positions[i].y, positions[i].z + 0.003);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                detailRef.current.setMatrixAt(i, dummy.matrix);
            }
            detailRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count, positions, hasDetail, dummy]);

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.07, 0.035, 0.004]} />
                <meshStandardMaterial color={color || '#334155'} roughness={0.6} metalness={0.4} />
            </instancedMesh>
            {hasDetail && (
                <instancedMesh ref={detailRef} args={[undefined, undefined, count]}>
                    <boxGeometry args={[0.015, 0.025, 0.002]} />
                    <meshStandardMaterial color="#1e293b" />
                </instancedMesh>
            )}
        </group>
    );
};

const InstancedStorageBays = ({ count, positions, color }) => {
    const meshRef = useRef();
    const detailRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
        if (detailRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x + 0.03, positions[i].y, positions[i].z + 0.003);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                detailRef.current.setMatrixAt(i, dummy.matrix);
            }
            detailRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count, positions, dummy]);

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.095, 0.028, 0.005]} />
                <meshStandardMaterial color={color || '#334155'} metalness={0.6} roughness={0.4} />
            </instancedMesh>
            <instancedMesh ref={detailRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.02, 0.015, 0.002]} />
                <meshStandardMaterial color="#000" />
            </instancedMesh>
        </group>
    );
};

const InstancedRJ45Ports = ({ count, positions, statuses, frontZ }) => {
    const meshRef = useRef();
    const innerRef = useRef();
    const tabRef = useRef();
    const ledRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y + 0.012, frontZ + 0.006);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
        if (innerRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y + 0.012, frontZ + 0.007);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                innerRef.current.setMatrixAt(i, dummy.matrix);
            }
            innerRef.current.instanceMatrix.needsUpdate = true;
        }
        if (tabRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y + 0.015, frontZ + 0.008);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                tabRef.current.setMatrixAt(i, dummy.matrix);
            }
            tabRef.current.instanceMatrix.needsUpdate = true;
        }
        if (ledRef.current) {
            for (let i = 0; i < count; i++) {
                const status = statuses[i] || 'disconnected';
                const ledY = positions[i].y + (i % 2 === 0 ? 0.021 : -0.002);
                dummy.position.set(positions[i].x - 0.004, ledY, frontZ + 0.006);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                ledRef.current.setMatrixAt(i, dummy.matrix);
            }
            ledRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count, positions, statuses, frontZ, dummy]);

    const ledColors = useMemo(() => {
        return statuses.map(s => s !== 'disconnected' ? (s === 'fault' ? '#ef4444' : '#22c55e') : '#475569');
    }, [statuses]);

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.011, 0.011, 0.004]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </instancedMesh>
            <instancedMesh ref={innerRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.009, 0.009, 0.002]} />
                <meshStandardMaterial color="#000" />
            </instancedMesh>
            <instancedMesh ref={tabRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.007, 0.001, 0.001]} />
                <meshBasicMaterial color="#facc15" />
            </instancedMesh>
            <instancedMesh ref={ledRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.002, 0.002, 0.001]} />
                <meshBasicMaterial toneMapped={false} />
                <instancedBufferAttribute attach="geometry-attributes-color" args={[new Float32Array(count * 3), 3]} />
            </instancedMesh>
        </group>
    );
};

const InstancedSFPports = ({ count, positions, statuses, frontZ }) => {
    const meshRef = useRef();
    const innerRef = useRef();
    const connectorRef = useRef();
    const ledRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y, frontZ + 0.006);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
        if (innerRef.current) {
            for (let i = 0; i < count; i++) {
                dummy.position.set(positions[i].x, positions[i].y, frontZ + 0.009);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                innerRef.current.setMatrixAt(i, dummy.matrix);
            }
            innerRef.current.instanceMatrix.needsUpdate = true;
        }
        if (connectorRef.current) {
            for (let i = 0; i < count; i++) {
                const isConnected = statuses[i] !== 'disconnected';
                dummy.position.set(positions[i].x, positions[i].y, frontZ + 0.012);
                dummy.scale.set(isConnected ? 1 : 0.001, 1, 1);
                dummy.updateMatrix();
                connectorRef.current.setMatrixAt(i, dummy.matrix);
            }
            connectorRef.current.instanceMatrix.needsUpdate = true;
        }
        if (ledRef.current) {
            for (let i = 0; i < count; i++) {
                const isConnected = statuses[i] !== 'disconnected';
                dummy.position.set(positions[i].x, positions[i].y + 0.01, frontZ + 0.009);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                ledRef.current.setMatrixAt(i, dummy.matrix);
            }
            ledRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count, positions, statuses, frontZ, dummy]);

    const ledColors = useMemo(() => {
        return positions.map((_, i) => statuses[i] !== 'disconnected' ? '#22c55e' : '#475569');
    }, [positions, statuses]);

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.02, 0.015, 0.005]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
            </instancedMesh>
            <instancedMesh ref={innerRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.016, 0.011, 0.002]} />
                <meshStandardMaterial color="#1e293b" />
            </instancedMesh>
            <instancedMesh ref={connectorRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.01, 0.002, 0.008]} />
                <meshStandardMaterial color="#3b82f6" />
            </instancedMesh>
            <instancedMesh ref={ledRef} args={[undefined, undefined, count]}>
                <coneGeometry args={[0.002, 0.004, 3]} />
                <meshBasicMaterial />
            </instancedMesh>
        </group>
    );
};

const FirewallFace = ({ device, height, frontZ, isSelected }) => {
  const halfWidth = 0.4826 / 2;

  return (
      <group>
        <mesh position={[-halfWidth + 0.02, 0, frontZ + 0.006]}>
           <boxGeometry args={[0.01, height, 0.003]} />
           <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>

        <mesh position={[0, 0, frontZ + 0.0055]}>
            <boxGeometry args={[0.46, height - 0.004, 0.002]} />
            <meshStandardMaterial color="#2d3748" roughness={0.7} metalness={0.6} />
        </mesh>

        <group position={[-0.08, 0, frontZ + 0.007]}>
            <mesh>
                <boxGeometry args={[0.12, 0.03, 0.002]} />
                <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.8} />
            </mesh>
            <group position={[0, 0, 0.002]}>
                 <mesh>
                    <boxGeometry args={[0.10, 0.001, 0.001]} />
                    <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
                 </mesh>
            </group>
        </group>

        <group position={[0.1, 0, frontZ + 0.007]}>
            {!PERFORMANCE_MODE && Array.from({ length: 4 }).map((_, col) => (
                 <mesh key={col} position={[-0.03 + col * 0.02, 0, 0]}>
                    <circleGeometry args={[0.008, 6]} />
                    <meshBasicMaterial color="#1a202c" />
                 </mesh>
            ))}
            {!PERFORMANCE_MODE && (
                <pointLight position={[0, 0, -0.01]} color="#f97316" intensity={0.8} distance={0.2} />
            )}
        </group>

        <group position={[0.2, 0.01, frontZ + 0.008]}>
            {['#22c55e', '#22c55e', device.status === 'error' ? '#ef4444' : '#4b5563'].map((color, i) => (
                <mesh key={i} position={[0, -i * 0.01, 0]}>
                    <circleGeometry args={[0.002, 8]} />
                    <meshBasicMaterial color={color} />
                    {i === 2 && device.status === 'error' && (
                         <pointLight color="#ef4444" intensity={1} distance={0.05} />
                    )}
                </mesh>
            ))}
        </group>
      </group>
  );
};

const DeviceModel = ({ device, rackHeight, isSelected, onClick, onHover, uHeight: propUHeight, position, rackDepth, slideEnabled = true }) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [currentZ, setCurrentZ] = useState(0);
  
  // 使用传入的 uHeight (默认为 0.04445m)
  const uHeight = propUHeight || 0.04445;
  const depth = rackDepth || 1.0; // 机柜深度，默认1米

  // 滑轨动画 - 仅在展开时运行且slideEnabled为true
  useFrame(() => {
    if (!slideEnabled || (!isExtended && Math.abs(currentZ) < 0.01)) {
      if (currentZ !== 0) setCurrentZ(0);
      return;
    }
    const targetZ = isExtended ? 0.6 : 0;
    const lerpFactor = 0.1;
    setCurrentZ(prev => prev + (targetZ - prev) * lerpFactor);
  });

  // 尺寸定义 (适配标准 0.6m 机柜)
  // 标准19英寸机柜内部净宽约 0.45m，设备面板宽 0.4826m (19inch)
  const chassisWidth = 0.44; // 机身宽度 440mm
  const chassisDepth = 0.8; // 机身深度 800mm
  const panelWidth = 0.4826; // 前面板宽度 482.6mm (19英寸)
  const panelDepth = 0.02; // 前面板厚度 20mm
  
  // 计算实际位置（防止超出机柜）
  // 优先使用父组件传入的 position，如果未传入则内部计算（作为 fallback）
  // 注意：父组件 RackModel 已经计算好了 position=[0, yPos, 0]
  // 我们只需要处理设备的高度
  
  const dHeight = device.height || device.u_height || 1;
  const height = dHeight * uHeight;
  
  // 间隙调整：减少设备上下间隙，使其更饱满，减少视觉偏差
  const gap = 0.002; // 总间隙 2mm

  // Z轴定位
  // 假设机柜中心为0，前沿为 depth/2
  // 设备前面板应该贴近前沿
  const frontZ = depth / 2 - 0.02; 
  const panelZ = frontZ - panelDepth / 2;
  const chassisZ = frontZ - panelDepth - chassisDepth / 2;

  // 颜色定义 (参考 CSS 变量)
  const colors = {
    server: '#3b82f6', // --color-device-server
    switch: '#22c55e', // --color-device-switch
    router: '#f59e0b', // --color-device-router
    firewall: '#ef4444', // --color-device-firewall
    storage: '#8b5cf6', // --color-device-storage
    default: '#3b82f6',
    status: {
        running: '#10b981', // --color-status-running
        warning: '#f59e0b', // --color-status-warning
        error: '#ef4444',   // --color-status-error
        offline: '#6b7280'  // --color-status-offline
    },
    panelBg: '#1e293b', // 深色面板背景
    panelLight: '#334155',
    text: '#f1f5f9'
  };

  const getDeviceColor = (type) => {
      const t = type?.toLowerCase() || '';
      if (t.includes('server') || t.includes('服务器')) return colors.server;
      if (t.includes('switch') || t.includes('交换机')) return colors.switch;
      if (t.includes('router') || t.includes('路由器')) return colors.router;
      if (t.includes('firewall') || t.includes('防火墙')) return colors.firewall;
      if (t.includes('storage') || t.includes('存储')) return colors.storage;
      return colors.default;
  };

  const deviceColor = getDeviceColor(device.type);
  const statusColor = colors.status[device.status] || colors.status.running;

  // 渲染服务器前面板细节
  const renderServerFace = () => {
    const is2U = height > 0.08;
    const driveRows = is2U ? 2 : 1;
    const driveCols = PERFORMANCE_MODE ? 3 : 4;
    const driveWidth = 0.07;
    const driveHeight = 0.035;

    const drivePositions = [];
    for (let row = 0; row < driveRows; row++) {
        for (let col = 0; col < driveCols; col++) {
            if (!is2U && row > 0) continue;
            const xPos = (col - 1) * (driveWidth + 0.005);
            const yPos = is2U ? (row === 0 ? 0.02 : -0.02) : 0;
            drivePositions.push({ x: xPos, y: yPos, z: 0 });
        }
    }

    return (
      <group>
         <mesh position={[0, 0, frontZ + 0.0055]}>
            <boxGeometry args={[0.44, height - 0.004, 0.002]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.5} />
         </mesh>

         <group position={[-0.18, 0, frontZ + 0.006]}>
             <mesh position={[-0.02, 0, 0]}>
                 <boxGeometry args={[0.04, height - 0.01, 0.002]} />
                 <meshStandardMaterial color="#000000" roughness={0.2} />
             </mesh>
             <group position={[-0.025, 0.01, 0.002]}>
                 <mesh rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.004, 0.004, 0.002, 16]} />
                     <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
                 </mesh>
                 {!PERFORMANCE_MODE && (
                     <pointLight color="#22c55e" intensity={0.5} distance={0.05} />
                 )}
                 <mesh position={[0, 0, 0.0011]} rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.002, 0.002, 0.001, 16]} />
                     <meshBasicMaterial color={device.status === 'offline' ? '#4b5563' : '#22c55e'} />
                 </mesh>
             </group>
             <mesh position={[-0.015, 0.01, 0.002]} rotation={[Math.PI/2, 0, 0]}>
                 <cylinderGeometry args={[0.002, 0.002, 0.002, 16]} />
                 <meshStandardMaterial color="#3b82f6" />
             </mesh>
             <mesh position={[-0.02, -0.01, 0.002]}>
                 <boxGeometry args={[0.006, 0.012, 0.002]} />
                 <meshStandardMaterial color="#475569" />
             </mesh>
             <mesh position={[-0.02, -0.01, 0.001]}>
                 <boxGeometry args={[0.004, 0.01, 0.001]} />
                 <meshBasicMaterial color="#000" />
             </mesh>
         </group>

         <group position={[0.05, 0, frontZ + 0.006]}>
            <InstancedDriveBays 
                count={drivePositions.length} 
                positions={drivePositions} 
                color="#334155"
                hasDetail={!PERFORMANCE_MODE}
            />
         </group>
         
         <group position={[0.2, 0, frontZ + 0.006]}>
             <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/2]}>
                 <cylinderGeometry args={[0.005, 0.005, 0.002, 6]} />
                 <meshStandardMaterial color="#3b82f6" />
             </mesh>
             <mesh position={[0, 0, 0.003]}>
                 <boxGeometry args={[0.012, 0.006, 0.001]} />
                 <meshBasicMaterial color="#000" />
             </mesh>
         </group>
      </group>
    );
  };

  // 渲染存储设备前面板细节
  const renderStorageFace = () => {
    const rows = PERFORMANCE_MODE ? 2 : 3;
    const cols = PERFORMANCE_MODE ? 2 : 4;
    const bayWidth = 0.10;
    const bayHeight = 0.028;

    const bayPositions = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const xPos = (col - 1) * (bayWidth + 0.002);
            const yStep = (height - 0.02) / rows;
            const yPos = (rows - 1 - row) * yStep - (rows - 1) * yStep / 2;
            bayPositions.push({ x: xPos, y: yPos, z: 0 });
        }
    }

    return (
        <group>
            <mesh position={[0, 0, frontZ + 0.0055]}>
                <boxGeometry args={[0.44, height - 0.004, 0.002]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            
            <group position={[0, 0, frontZ + 0.008]}>
                <InstancedStorageBays 
                    count={bayPositions.length} 
                    positions={bayPositions} 
                    color="#334155"
                />
            </group>
        </group>
    );
  };

  // 渲染交换机前面板细节
  const renderSwitchFace = () => {
    const getPortStatus = (portName) => {
        if (!device.cables || !Array.isArray(device.cables)) return 'disconnected';
        const cable = device.cables.find(c => 
            (c.sourceDeviceId === device.deviceId && c.sourcePort === portName) ||
            (c.targetDeviceId === device.deviceId && c.targetPort === portName)
        );
        return cable ? (cable.status || 'normal') : 'disconnected';
    };

    const sfpCount = PERFORMANCE_MODE ? 2 : 4;
    const rj45GroupCount = PERFORMANCE_MODE ? 2 : 4;
    const rj45ColCount = PERFORMANCE_MODE ? 4 : 6;

    const sfpPositions = [];
    const sfpStatuses = [];
    for (let i = 0; i < sfpCount; i++) {
        sfpPositions.push({ x: -0.13 + i * 0.025, y: -0.005, z: 0 });
        sfpStatuses.push(getPortStatus(`SFP+ ${i + 1}`));
    }

    const rj45PortCount = rj45GroupCount * rj45ColCount * 2;
    const rj45Positions = [];
    const rj45Statuses = [];
    for (let groupIndex = 0; groupIndex < rj45GroupCount; groupIndex++) {
        const groupX = -0.02 + groupIndex * 0.09;
        for (let colIndex = 0; colIndex < rj45ColCount; colIndex++) {
            const portX = -0.03 + colIndex * 0.012;
            const globalCol = groupIndex * rj45ColCount + colIndex;
            const topPortNum = globalCol * 2 + 1;
            const bottomPortNum = globalCol * 2 + 2;
            const topStatus = getPortStatus(`Port ${topPortNum}`);
            const bottomStatus = getPortStatus(`Port ${bottomPortNum}`);
            rj45Positions.push({ x: groupX + portX, y: 0, z: 0 });
            rj45Statuses.push(topStatus);
            rj45Positions.push({ x: groupX + portX, y: -0.024, z: 0 });
            rj45Statuses.push(bottomStatus);
        }
    }

    return (
      <group>
        <mesh position={[0, 0, frontZ + 0.0055]}>
            <boxGeometry args={[0.44, height - 0.004, 0.002]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
        </mesh>

        <group position={[-0.19, 0, frontZ + 0.006]}>
             <mesh position={[0, 0, 0]}>
                 <boxGeometry args={[0.05, height - 0.015, 0.002]} />
                 <meshStandardMaterial color="#1e293b" />
             </mesh>
            <mesh position={[-0.015, 0.005, 0.002]}>
                <boxGeometry args={[0.012, 0.01, 0.002]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[-0.015, 0.012, 0.002]}>
                 <boxGeometry args={[0.012, 0.002, 0.001]} />
                 <meshBasicMaterial color="#3b82f6" />
            </mesh>

            <mesh position={[0.015, 0.005, 0.002]}>
                <boxGeometry args={[0.008, 0.012, 0.002]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            
            <group position={[0, -0.01, 0.002]}>
                 {['SYS', 'PWR'].map((label, idx) => (
                     <group key={label} position={[(idx - 0.5) * 0.02, 0, 0]}>
                        <mesh>
                            <circleGeometry args={[0.0015, 8]} />
                            <meshBasicMaterial color="#22c55e" />
                        </mesh>
                     </group>
                 ))}
            </group>
        </group>

        <group position={[-0.13, -0.005, 0]}>
            <InstancedSFPports 
                count={sfpCount} 
                positions={sfpPositions} 
                statuses={sfpStatuses} 
                frontZ={frontZ}
            />
        </group>

        <group position={[-0.02, 0, 0]}>
            <InstancedRJ45Ports 
                count={rj45PortCount} 
                positions={rj45Positions} 
                statuses={rj45Statuses} 
                frontZ={frontZ}
            />
        </group>
      </group>
    );
  };

  // 渲染设备背板
  const renderBackPanel = () => {
    // Back face Z position (flush with back of chassis)
    const backZ = chassisZ - chassisDepth / 2;
    
    // Rotate 180 deg to face backwards
    return (
        <group position={[0, 0, backZ]} rotation={[0, Math.PI, 0]}>
            {/* 基础背板 - 透明玻璃质感 (Reduced quality for performance) */}
            <mesh position={[0, 0, 0.001]}>
                <boxGeometry args={[chassisWidth, height - gap, 0.002]} />
                <meshStandardMaterial 
                    color="#94a3b8" 
                    transparent 
                    opacity={0.3}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* 电源模块 (PSU) - 左侧 (从背面看是右侧，但我们旋转了) */}
            {/* 2个 PSU 垂直排列或并排 */}
            <group position={[0.25, 0, 0.002]}>
                {[-0.02, 0.02].map((yOffset, i) => (
                     <group key={i} position={[0, height > 0.15 ? yOffset * 2 : 0, 0]}> 
                        {/* 如果高度够大(>1U)，垂直排列，否则只显示一个或者水平排列 */}
                        {/* 简化：1U设备只显示左边一个，2U显示两个 */}
                        {(height > 0.15 || i === 0) && (
                            <group position={[i === 1 && height <= 0.15 ? -0.06 : 0, 0, 0]}>
                                {/* PSU 面板 */}
                                <mesh>
                                    <boxGeometry args={[0.05, height > 0.15 ? 0.04 : 0.08, 0.004]} />
                                    <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
                                </mesh>
                                {/* 把手 */}
                                <mesh position={[0, 0, 0.004]}>
                                    <boxGeometry args={[0.01, 0.02, 0.004]} />
                                    <meshStandardMaterial color="#000000" />
                                </mesh>
                                {/* 电源插口 C13 */}
                                <mesh position={[0.015, 0, 0.002]}>
                                    <boxGeometry args={[0.012, 0.01, 0.002]} />
                                    <meshStandardMaterial color="#1a202c" />
                                </mesh>
                                {/* 状态灯 */}
                                <mesh position={[-0.015, 0.01, 0.002]}>
                                    <circleGeometry args={[0.002, 8]} />
                                    <meshBasicMaterial color="#22c55e" />
                                </mesh>
                            </group>
                        )}
                     </group>
                ))}
            </group>

            {/* 风扇模块 (Fan Modules) - 中间 */}
            {/* 3-4个风扇阵列 */}
            <group position={[0, 0, 0.002]}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <group key={i} position={[-0.1 + i * 0.1, 0, 0]}>
                         {/* 风扇网罩 */}
                        <mesh>
                            <boxGeometry args={[0.08, height - 0.03, 0.001]} />
                            <meshStandardMaterial color="#1e293b" />
                        </mesh>
                        {/* 风扇叶片模拟 (纹理) */}
                        <mesh position={[0, 0, 0.001]}>
                            <circleGeometry args={[Math.min(0.035, (height-0.03)/2), 8]} />
                            <meshBasicMaterial color="#334155" />
                        </mesh>
                         {/* 红色拉手 (热插拔) */}
                         <mesh position={[0, -0.01, 0.003]}>
                            <boxGeometry args={[0.01, 0.02, 0.002]} />
                            <meshStandardMaterial color="#ef4444" />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* 网卡/扩展模块 (PCIe/LOM) - 右侧 */}
            <group position={[-0.25, 0, 0.002]}>
                {/* 竖向 PCIe 挡板 */}
                {Array.from({ length: 2 }).map((_, i) => (
                     <group key={i} position={[i * 0.08, 0, 0]}>
                        <mesh>
                            <boxGeometry args={[0.02, height - 0.02, 0.001]} />
                            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                        </mesh>
                        {/* 端口 (SFP+ or RJ45) */}
                         <mesh position={[0, 0.01, 0.002]}>
                            <boxGeometry args={[0.012, 0.012, 0.002]} />
                            <meshStandardMaterial color="#000000" />
                        </mesh>
                        <mesh position={[0, -0.01, 0.002]}>
                            <boxGeometry args={[0.012, 0.012, 0.002]} />
                            <meshStandardMaterial color="#000000" />
                        </mesh>
                     </group>
                ))}
            </group>
        </group>
    );
  };
  const renderDeviceFace = () => {
    const type = device.type?.toLowerCase() || '';
    if (type.includes('server') || type.includes('服务器')) return renderServerFace();
    if (type.includes('switch') || type.includes('交换机')) return renderSwitchFace();
    if (type.includes('storage') || type.includes('存储')) return renderStorageFace();
    if (type.includes('firewall') || type.includes('防火墙') || type.includes('router') || type.includes('路由器')) {
        return <FirewallFace device={device} height={height} frontZ={frontZ} isSelected={isSelected} />;
    }
    
    // 默认通用设备样式
    return (
       <group>
           {/* 默认面板纹理 */}
           <mesh position={[0, 0, frontZ + 0.005]}>
              <boxGeometry args={[0.7, height - gap - 0.01, 0.002]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
           </mesh>
           {/* 装饰线 */}
           <mesh position={[0, 0, frontZ + 0.006]}>
               <boxGeometry args={[0.6, 0.005, 0.001]} />
               <meshStandardMaterial color={deviceColor} />
           </mesh>
       </group>
    );
  };

  return (
    <group position={position || [0, 0, 0]}>
      <group
        position={[0, 0, currentZ]}
        onClick={(e) => {
          e.stopPropagation();
          setIsExtended(!isExtended);
          onClick && onClick(device);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          onHover && onHover(device);
        }}
        onPointerOut={(e) => {
          setHover(false);
          onHover && onHover(null);
        }}
      >
        {/* 机身 (Chassis) - 深色金属 */}
        <mesh ref={mesh} position={[0, 0, chassisZ]}>
          <boxGeometry args={[chassisWidth, height - gap, chassisDepth]} />
          <meshStandardMaterial 
            color="#333333" // 深灰色哑光金属
            roughness={0.9} // 哑光
            metalness={0.3}
          />
        </mesh>

        {/* 前面板底座 (Front Panel Base) */}
        <mesh position={[0, 0, panelZ]}>
          <boxGeometry args={[panelWidth, height - gap, panelDepth]} />
          <meshStandardMaterial 
            color={hovered || isSelected ? "#666666" : "#555555"} // 稍浅的灰色塑料质感
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* 告警时的红色辉光 (设备两侧) */}
        {(device.status === 'error' || device.status === 'fault') && (
            <>
                <pointLight position={[-0.4, 0, frontZ]} color="#ff0000" intensity={0.8} distance={0.3} />
                <pointLight position={[0.4, 0, frontZ]} color="#ff0000" intensity={0.8} distance={0.3} />
            </>
        )}

        {/* 设备特定前面板细节 */}
        {renderDeviceFace()}

        {/* 设备背板细节 */}
        {renderBackPanel()}
      </group>
      
      {/* 设备名称 (悬浮显示，避免遮挡细节) - 暂时禁用 */}
      {/* {hovered && (
          <Text
            position={[0, height/2 + 0.02, frontZ + 0.05]}
            fontSize={0.04}
            color="white"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.002}
            outlineColor="#000000"
          >
            {device.name}
          </Text>
      )} */}

      {/* 状态指示灯 (统一位置) */}
      <group position={[panelWidth/2 - 0.03, 0, frontZ + 0.01]}>
         {/* 灯座 */}
         <mesh position={[0, 0, -0.002]}>
             <circleGeometry args={[0.01, 16]} />
             <meshStandardMaterial color="#333" />
         </mesh>
         {/* 发光体 */}
         <mesh>
            <circleGeometry args={[0.006, 16]} />
            <meshBasicMaterial color={statusColor} toneMapped={false} />
         </mesh>
         {/* 光晕效果 */}
         <pointLight color={statusColor} intensity={0.5} distance={0.1} />
      </group>
    </group>
  );
};

export default DeviceModel;
