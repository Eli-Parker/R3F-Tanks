/* eslint-disable react/no-unknown-property */
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { folder, Leva, useControls } from 'leva';
import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import Tank from './Tank';

/**
 * World function represents the game world and manages the entities within it.
 * It handles adding and removing entities, starting and stopping the game loop,
 * and updating and rendering the game state.
 */
function World ()
{
    const [debug] = useState(window.location.hash === "#debug");
    

    const map = useMemo(()=>[
        { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
        { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
        { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
        { name: Controls.fire, keys: ['Space'] },
      ], [])

    const { wallPosX, wallPosY, wallPosZ } = useControls(
    "Main World Ctrls",
    {

        "Walls": folder(
        {
            wallPosX: { value: 0, step: 0.01 },
            wallPosY: { value: 1.45, step: 0.01 },
            wallPosZ: { value: -0.22, step: 0.001 },
        },
        { collapsed: true }
        ),
    },
    { collapsed: true }
  );

    return ( <>
        {/* Hide debug controls if we're not in debug mode */}
        {!debug && <Leva hidden />}
        <KeyboardControls map={map} >
        <Canvas
            className="r3f"
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                dpr: 2, // TODO dynamic DPR
                position: [0, 30, 20],
            }}
        >
            {/* Orbit controls, only if we're in debug mode */}
            {debug && <OrbitControlsSnippet />}

            {/* Lighting */}
            <ambientLight intensity={0.8} />

            <directionalLight
                castShadow
                intensity={2}
                position={[0, 5, -1]}
                shadow-mapSize={[1024, 1024]}
            >
                <orthographicCamera attach="shadow-camera" args={[-15, 15, 10, -10]} />
            </directionalLight>

            {/* Floor plane */}
            <mesh receiveShadow rotation={ [-Math.PI/2, 0, 0] }>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color='grey'/>
            </mesh>

            {/* Cube */}
            <Walls castShadow wide={28} tall={20} position={ [wallPosX, wallPosY, wallPosZ] }/>

            {/* Tank */}
            <Tank position={[0,0.5,0]}/>

        </Canvas>
        </KeyboardControls>
    </>);
}

export default World;

/**
 * Walls component creates the walls of the game world using instanced meshes.
 * It positions the walls around 0,0 based on the provided width and height,
 * and other basic props can be altered using the regular r3f params (eg position)
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {number} props.wide - The width of the walls.
 * @param {number} props.tall - The height of the walls.
 * @returns {JSX.Element} The rendered component.
 */
const Walls = ({wide, tall, ...props }) => {
    const temp = new THREE.Object3D()
    const instancedMeshRef = useRef()

    // Create the instanced mesh
    useEffect(() => 
    {
        // Set positions
        let index = 0;

        // Top and bottom walls
        for (let i = -1 * (wide / 2); i < (wide / 2); i++) {
            temp.position.set(i, 0, -tall / 2);
            temp.updateMatrix();
            instancedMeshRef.current.setMatrixAt(index++, temp.matrix);
        }
        for (let i = -1 * (wide / 2); i < (wide / 2); i++) {
            temp.position.set(i, 0, tall / 2);
            temp.updateMatrix();
            instancedMeshRef.current.setMatrixAt(index++, temp.matrix);
        }

        // Left and right walls
        for (let i = -1 * (tall / 2); i < (tall / 2); i++) {
            temp.position.set(-wide / 2, 0, i);
            temp.updateMatrix();
            instancedMeshRef.current.setMatrixAt(index++, temp.matrix);
        }
        for (let i = -1 * (tall / 2); i < (tall / 2); i++) {
            temp.position.set(wide / 2, 0, i);
            temp.updateMatrix();
            instancedMeshRef.current.setMatrixAt(index++, temp.matrix);
        }

      // Update the instance
      instancedMeshRef.current.instanceMatrix.needsUpdate = true
    },)

    return (
    <group {...props} >
        <instancedMesh castShadow ref={instancedMeshRef} args={[null, null, (2 * wide + 2 * tall)]}>
            <boxGeometry />
            <meshPhongMaterial />
        </instancedMesh>
    </group>
    )
};

Walls.propTypes = {
    wide: PropTypes.number.isRequired,
    tall: PropTypes.number.isRequired,
};


/**
 * Orbit controls snippet to hide away unnececary code.
 * @returns Orbit controls
 */
const OrbitControlsSnippet = () => {
    return (
      <OrbitControls
        enableZoom={true}
        // enablePan={true}
        enableRotate={true}
        // minAzimuthAngle={-Math.PI / 4}
        // maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    );
  };


const Controls = {
    forward: 'forward',
    back: 'back',
    left: 'left',
    right: 'right',
    fire: 'fire',
};