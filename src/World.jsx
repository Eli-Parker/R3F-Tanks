/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Component } from 'react';

/**
 * World class represents the game world and manages the entities within it.
 * It handles adding and removing entities, starting and stopping the game loop,
 * and updating and rendering the game state.
 *
 * @extends Component
 */
class World extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entities: [],
            isRunning: false,
        };
    }

    addEntity(entity) {
        this.setState((prevState) => ({
            entities: [...prevState.entities, entity],
        }));
    }

    removeEntity(entity) {
        this.setState((prevState) => ({
            entities: prevState.entities.filter((e) => e !== entity),
        }));
    }

    start() {
        this.setState({ isRunning: true });
        this.gameLoop();
    }

    stop() {
        this.setState({ isRunning: false });
    }

    gameLoop() {
        if (!this.state.isRunning) return;

        // Update game state
        this.update();

        // Render game state
        this.renderWorld();

        // Continue the loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        // Update all entities
        this.state.entities.forEach((entity) => {
            if (entity.update) {
                entity.update();
            }
        });
    }

    renderWorld() {
        // Render all entities
        this.state.entities.forEach((entity) => {
            if (entity.render) {
                entity.render();
            }
        });
    }

    render() {
        return (
            <Canvas
                className="r3f"
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 20,
                    dpr: 2, // TODO dynamic DPR
                    position: [-3, 1.5, 6],
                }}
            >
                <OrbitControlsSnippet />
                <mesh>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color='blue' />
                </mesh>
            </Canvas>
        );
    }
}

export default World;

/**
 * Orbit controls snippet to hide away unnececary code.
 * @returns Orbit controls
 */
const OrbitControlsSnippet = () => {
    return (
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    );
  };