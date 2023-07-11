import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass"
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


/////////////////////////////////////////////////
//                     Base                    //
/////////////////////////////////////////////////

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()
const scene3 = new THREE.Scene()

// scene.background = new THREE.Color( 0xff0000 );
// scene.background = cubeMapLoader

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
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0
}

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}


if ("ontouchstart" in document.documentElement) {
	let touchHandler = (event) => {

		if (event.touches && event.touches[0]) {
			cursor.x = (event.touches[0].clientX - (window.innerWidth * 0.5)) / 100
			cursor.y = (event.touches[0].clientY - (window.innerWidth * 0.5)) / 100
		} else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
			cursor.x = (event.originalEvent.changedTouches[0].clientX - (window.innerWidth * 0.5)) / 100
			cursor.y = (event.originalEvent.changedTouches[0].clientY - (window.innerWidth * 0.5)) / 100
		} else if (event.clientX && event.clientY) {
			cursor.x = (event.clientX - (window.innerWidth * 0.5)) / 100
			cursor.y = (event.clientY - (window.innerWidth * 0.5)) / 100
		}

	}

	window.addEventListener('touchstart', touchHandler, false)
	window.addEventListener('touchmove', touchHandler, false)
	window.addEventListener('touchend', touchHandler, false)

} else {
	window.addEventListener(
		'mousemove',
		(event) => {
			cursor.x = (event.clientX - (window.innerWidth * 0.5)) / 100
			cursor.y = (event.clientY - (window.innerHeight * 0.5)) / 100
		})
}



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
}


/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x404040)
scene1.add(ambientLight)
scene2.add(ambientLight)
scene3.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(0, 0, 1)
scene1.add(directionalLight)
scene2.add(directionalLight)
scene3.add(directionalLight)



window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
	camera2.aspect = sizes.width / sizes.height
	camera2.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

scene1.add(camera)
scene2.add(camera)
scene3.add(camera2)


/**
 * Renderer
 */



const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)
const renderPass1 = new RenderPass(scene1, camera)
const renderPass2 = new RenderPass(scene2, camera)
const renderPass3 = new RenderPass(scene3, camera2)
// effectComposer.addPass(renderPass1)

const fog = new THREE.Fog('#262837', 1, 5)
scene3.fog = fog

const renderPixelatedPass = new RenderPixelatedPass(7, scene3, camera2);
renderPixelatedPass.normalEdgeStrength = 0
renderPixelatedPass.depthEdgeStrength = 0
const dotScreenPass = new DotScreenPass(new THREE.Vector2(0, 0), 0, 0.7)
// effectComposer.addPass(dotScreenPass)
console.log(effectComposer)

export const getDroneScene = () => {
	// effectComposer.removePass(renderPass1)
	// effectComposer.removePass(renderPass2)
	// effectComposer.removePass(dotScreenPass)
	disposeAll()
	effectComposer.addPass(renderPass1)
	effectComposer.addPass(dotScreenPass)
	console.log(effectComposer);
	console.log('drone');
}

export const getCubeScene = () => {
	// effectComposer.removePass(renderPass1)
	// effectComposer.removePass(renderPass2)
	// effectComposer.removePass(dotScreenPass)
	disposeAll()
	console.log(effectComposer);
	effectComposer.addPass(renderPass2)
	effectComposer.addPass(dotScreenPass)
	console.log('cube');

}

export const getShedScene = () => {
	// effectComposer.removePass(renderPass1)
	// effectComposer.removePass(renderPass2)
	// effectComposer.removePass(dotScreenPass)
	disposeAll()
	console.log(effectComposer)
	effectComposer.addPass(renderPass3)
	effectComposer.addPass(renderPixelatedPass)
	console.log('shed');

}

const disposeAll = () => {
	for (var i = effectComposer.passes.length - 1; i >= 0; i--) {
		effectComposer.passes[i].dispose();
		effectComposer.removePass(effectComposer.passes[i])
	}
}

getDroneScene()


/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () => {

	const elapsedTime = clock.getElapsedTime()

	// Update controls
	camera.position.x += (cursor.x - camera.position.x) * 0.02;
	camera.position.y += (- cursor.y - camera.position.y) * 0.02;
	camera.position.z = 5 - sizes.width / sizes.height

	camera2.position.x += ((cursor.x)/4 - camera2.position.x);
	camera2.position.y += (- (cursor.y)/6 - camera2.position.y);
	camera2.position.z = 5 - sizes.width / sizes.height

	camera.lookAt(0, 0, 0);
	camera2.lookAt(0, 0, 0);

	// Render
	// renderer.render(scene, camera)
	effectComposer.render()



	// Call tick again on the next frame
	window.requestAnimationFrame(tick)

}
tick()











