import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { scene1, scene2, scene3, scene4 } from './script'

const cubeMapLoader = new THREE.CubeTextureLoader()
	.setPath('/cubeMaps/')
	.load([
		'px.jpg',
		'nx.jpg',
		'py.jpg',
		'ny.jpg',
		'pz.jpg',
		'nz.jpg'
	])


/**
 * Update Materials
 */
const updateAllMaterial = () => {
	scene1.traverse((child) => {
		if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
			child.material.envMap = cubeMapLoader
		}
	})

	scene2.traverse((child) => {
		if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
			child.material.envMap = cubeMapLoader
		}
	})

    scene3.traverse((child) => {
		if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
			child.material.envMap = cubeMapLoader
		}
	})
}

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const manager = new THREE.LoadingManager(
    () => {
	
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
	}
);

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
	'/model/drone.glb',
	(gltf) => {
		gltf.scene.scale.set(0.25, 0.25, 0.25)
		gltf.scene.position.y = 1
		scene1.add(gltf.scene)

		updateAllMaterial()
	}
)

gltfLoader.load(
	'/model/robot.glb',
	(gltf) => {
		gltf.scene.scale.set(0.25, 0.25, 0.25)
		gltf.scene.position.y = -2
		scene2.add(gltf.scene)

		updateAllMaterial()
	}
)

gltfLoader.load(
	'/model/armory.glb',
	(gltf) => {
		// gltf.scene.scale.set(0.25, 0.25, 0.25)
		gltf.scene.rotateY(90)
		gltf.scene.position.y = -1
		gltf.scene.position.z = 2

		scene3.add(gltf.scene)

		updateAllMaterial()
	}
)

gltfLoader.load(
	'/model/city.glb',
	(gltf) => {
		// gltf.scene.scale.set(0.25, 0.25, 0.25)
		gltf.scene.rotateY(160)

		gltf.scene.position.y = -4
		gltf.scene.position.x = 25
		gltf.scene.position.z = -7

		scene4.add(gltf.scene)

		updateAllMaterial()
	}
)

function onTransitionEnd( event ) {

	event.target.remove();
	
}