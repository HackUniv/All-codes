document.addEventListener("DOMContentLoaded", function () {
    // Original texture
    const textureURL1 = 
      
      "https://assets.codepen.io/9234665/barcupf.png"; 
    setupScene("container", textureURL1);
  
    // Additional textures
    const textureURL2 = 
  "https://assets.codepen.io/9234665/seacity3.png"; 
     
    setupScene("container2", textureURL2);
  
    const textureURL3 = 
     "https://assets.codepen.io/9234665/church3.png"; 
    setupScene("container3", textureURL3);
  
    const textureURL4 = "https://assets.codepen.io/9234665/city604.png";
    setupScene("container4", textureURL4);
  
    const textureURL5 = 
          "https://assets.codepen.io/9234665/suite.jpeg"; 
    setupScene("container5", textureURL5);
     
       const textureURL6 = "https://assets.codepen.io/9234665/blackcubes.webp";
    setupScene("container6", textureURL6);
  
    function setupScene(containerID, textureURL) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });
  
      const canvasWidth = window.innerWidth; // Set the desired width for the canvas
      const canvasHeight = 1.5 * window.innerHeight; // Set the desired height for the canvas
      renderer.setSize(`${canvasWidth}`, `${canvasHeight}`);
      document.getElementById(containerID).appendChild(renderer.domElement);
  
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(textureURL);
  
      const sphereGeometry = new THREE.SphereGeometry(50, 160, 80);
      sphereGeometry.scale(-1, 1, 1);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture,
      });
  
      const panoramicView = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(panoramicView);
  
      camera.position.set(0, 0, 0.1);
  
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.rotateSpeed = 0.5;
      controls.minDistance = 0.1;
      controls.maxDistance = 1000;
      controls.minPolarAngle = 0;
      controls.maxPolarAngle = Math.PI;
  
      animate();
  
      function animate() {
        requestAnimationFrame(animate);
  
        // Increment the rotation angle by a small value (adjust the speed as needed)
        panoramicView.rotation.y -= 0.0003;
        panoramicView.rotation.x -= 0.00001;
  
        controls.update();
        renderer.render(scene, camera);
      }
    }
  });
  
  