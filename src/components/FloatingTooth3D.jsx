import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * FloatingTooth3D
 * An interactive 3D holographic geometric model representing Dental Health & Precision Billing.
 * Features:
 * - Geometric sculpted 3D mesh with translucent frosted glass and glowing neon wireframe edges
 * - Interactive mouse rotation and drag
 * - Ambient floating animation
 */
export default function FloatingTooth3D({ className = "w-72 h-72" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects
    const group = new THREE.Group();
    scene.add(group);

    // Create a stylized 3D tooth / molar geometry using combined lathed/extruded primitives
    // Crown
    const crownGeo = new THREE.CylinderGeometry(1.2, 0.9, 1.4, 6, 4, true);
    // Top dome (cusps)
    const domeGeo = new THREE.SphereGeometry(1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
    domeGeo.translate(0, 0.5, 0);

    // Roots (bifurcated roots)
    const root1Geo = new THREE.ConeGeometry(0.42, 1.4, 6);
    root1Geo.translate(-0.45, -1.2, 0);
    const root2Geo = new THREE.ConeGeometry(0.42, 1.4, 6);
    root2Geo.translate(0.45, -1.2, 0);

    // Glass / Translucent material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x002b3d,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75,
      wireframe: false,
    });

    // Wireframe glowing material
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    // Amber accent core
    const amberCoreGeo = new THREE.OctahedronGeometry(0.5, 1);
    const amberCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfb923c,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7,
    });
    const amberCore = new THREE.Mesh(amberCoreGeo, amberCoreMat);
    group.add(amberCore);

    const crownMesh = new THREE.Mesh(crownGeo, glassMaterial);
    const crownWire = new THREE.Mesh(crownGeo, wireMaterial);
    const domeMesh = new THREE.Mesh(domeGeo, glassMaterial);
    const domeWire = new THREE.Mesh(domeGeo, wireMaterial);
    const root1Mesh = new THREE.Mesh(root1Geo, glassMaterial);
    const root1Wire = new THREE.Mesh(root1Geo, wireMaterial);
    const root2Mesh = new THREE.Mesh(root2Geo, glassMaterial);
    const root2Wire = new THREE.Mesh(root2Geo, wireMaterial);

    group.add(crownMesh);
    group.add(crownWire);
    group.add(domeMesh);
    group.add(domeWire);
    group.add(root1Mesh);
    group.add(root1Wire);
    group.add(root2Mesh);
    group.add(root2Wire);

    // Orbital ring around the tooth representing billing accuracy & cycle
    const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.4;
    group.add(ring);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4, 15);
    cyanLight.position.set(3, 3, 3);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3, 15);
    amberLight.position.set(-3, -2, -2);
    scene.add(amberLight);

    // Interactive Drag / Tilt
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Continuous slow rotation if not dragging
      if (!isDragging) {
        targetRotationY += 0.006;
      }

      // Smooth lerp rotation
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.08;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.08;

      // Gentle floating bob
      group.position.y = Math.sin(time * 1.5) * 0.12;

      // Pulse ring & amber core
      ring.rotation.z = time * 0.4;
      amberCore.rotation.x = time * 0.6;
      amberCore.rotation.y = time * 0.8;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container && domEl) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] tracking-wider uppercase text-cyan-400/60 font-mono pointer-events-none whitespace-nowrap">
        ✦ Drag 3D Model to Rotate
      </div>
    </div>
  );
}
