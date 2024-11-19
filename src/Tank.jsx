/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

function Tank({...props}) 
{

    // const [position, setPosition] = useState([0, 0, 0]);

    // Reference to tank so we can update position
    const tank = useRef()

    /*
        Keyboard Controls
    */
    const [, getKeys] = useKeyboardControls()

    // Animate controls
    useFrame(() => 
    {
        const {forward, back, left, right, fire} = getKeys()

        // If tank isn't defined don't do anything
        if(!tank.current) return;
        
        // Alter tank based on keys pressed
        if (forward) {
            tank.current.position.z -= 0.01;
        }
        if (back) {
            tank.current.position.z += 0.01;
        }
        if (left) {
            tank.current.position.x -= 0.01;
        }
        if (right) {
            tank.current.position.x += 0.01;
        }
        if (fire) {
            console.log('Fire!');
        }
    });
    
    return(
        <group {...props} ref={tank}>
        <mesh castShadow>
            <boxGeometry args={[0.7,0.3,1]} />
            <meshStandardMaterial color={'darkred'} />
        </mesh>
        <mesh position={[0,0.25,-0.2]} >
            <boxGeometry args={[0.3,0.25,0.7]} />
            <meshStandardMaterial color={'brown'} />
        </mesh>
        </group>
    )
}

export default Tank