import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { personalData } from '../data/portfolioData';

/**
 * LanyardCard3D
 * - 4K Ultra-Sharp Quality Card Texture (2048x2900 with anisotropic filtering)
 * - Scaled down 3D Card: sits high in upper-mid left area, moved further to the left
 * - Top anchor extends 10 units ABOVE the screen: lanyard top end is NEVER seen when stretching
 * - Dark green lanyard strap with NO text
 * - Draggable by both the lanyard strap AND the card
 * - Open animation: falls dramatically from above the top of the screen on load
 * - Auto-face front: card smoothly springs back to face front when released
 * - Hint pill badge positioned at the RIGHT side of the 3D card
 */
export default function LanyardCard3D({ className = "w-full h-full" }) {
  const mountRef = useRef(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    
    // Perspective camera setup
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 9.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // 4K Crisp Rendering
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 16;

    // Compute visible bounds in world space at z = 0
    const getVisibleTop = () => {
      const vFOV = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      return camera.position.y + visibleHeight / 2;
    };

    // CRITICAL USER INSTRUCTION: "move the 3D card a little to the left."
    const getRestX = () => {
      const aspect = width / height;
      if (aspect > 1.3) {
        return -3.3; // Desktop: shifted further to the left
      } else if (aspect > 0.9) {
        return -2.2; // Tablet: left side
      }
      return 0; // Mobile: centered
    };

    let restX = getRestX();
    // Card sits comfortably in the upper-mid area (0.45), so at rest it DOES NOT reach bottom name
    const restY = 0.45;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 7, 7);
    scene.add(keyLight);

    const greenRim = new THREE.PointLight(0x22c55e, 3.5, 18);
    greenRim.position.set(-5, -1, 4);
    scene.add(greenRim);

    const softFill = new THREE.PointLight(0xffffff, 1.2, 18);
    softFill.position.set(5, -3, 3);
    scene.add(softFill);

    // ==========================================
    // 1. GENERATE CARD FRONT CANVAS TEXTURE (4K RESOLUTION: 2048 x 2900)
    // ==========================================
    const canvasFront = document.createElement('canvas');
    canvasFront.width = 2048;
    canvasFront.height = 2900;
    const ctxF = canvasFront.getContext('2d');

    const textureFront = new THREE.CanvasTexture(canvasFront);
    textureFront.colorSpace = THREE.SRGBColorSpace;
    textureFront.generateMipmaps = true;
    textureFront.minFilter = THREE.LinearMipmapLinearFilter;
    textureFront.magFilter = THREE.LinearFilter;
    textureFront.anisotropy = maxAnisotropy;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = personalData.photoPath;

    const renderFrontCanvas = () => {
      // Dark sleek card surface
      ctxF.fillStyle = '#06080d';
      ctxF.fillRect(0, 0, 2048, 2900);

      // Card outer border (curved corners) - Primary Green Accent
      ctxF.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctxF.lineWidth = 36;
      ctxF.beginPath();
      ctxF.roundRect(48, 48, 1952, 2804, 120);
      ctxF.stroke();

      // Top slot hole for lanyard attachment
      ctxF.fillStyle = '#000000';
      ctxF.beginPath();
      ctxF.roundRect(844, 76, 360, 72, 36);
      ctxF.fill();
      ctxF.strokeStyle = '#4ade80';
      ctxF.lineWidth = 8;
      ctxF.stroke();

      // Top Badge Tag (Green Primary)
      ctxF.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctxF.beginPath();
      ctxF.roundRect(440, 190, 1168, 116, 58);
      ctxF.fill();
      ctxF.strokeStyle = 'rgba(34, 197, 94, 0.7)';
      ctxF.lineWidth = 6;
      ctxF.stroke();

      ctxF.fillStyle = '#4ade80';
      ctxF.font = 'bold 52px "Geist Mono", monospace';
      ctxF.textAlign = 'center';
      ctxF.fillText('OFFICIAL CREDENTIAL • DENTAL BILLING', 1024, 268);

      // Photo Frame
      const photoX = 424;
      const photoY = 350;
      const photoSize = 1200;

      ctxF.fillStyle = '#0e121a';
      ctxF.beginPath();
      ctxF.roundRect(photoX - 20, photoY - 20, photoSize + 40, photoSize + 40, 88);
      ctxF.fill();
      ctxF.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctxF.lineWidth = 10;
      ctxF.stroke();

      // Draw photo in high-definition
      if (img.complete && img.naturalWidth !== 0) {
        ctxF.save();
        ctxF.beginPath();
        ctxF.roundRect(photoX, photoY, photoSize, photoSize, 72);
        ctxF.clip();
        ctxF.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctxF.restore();
      }

      // Location Pill overlay on Photo
      ctxF.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctxF.beginPath();
      ctxF.roundRect(624, 1410, 800, 108, 54);
      ctxF.fill();
      ctxF.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctxF.lineWidth = 5;
      ctxF.stroke();

      ctxF.fillStyle = '#4ade80';
      ctxF.font = 'bold 52px "Geist Mono", monospace';
      ctxF.textAlign = 'center';
      ctxF.fillText('Davao City, PH', 1024, 1482);

      // Name: Hussein Hassan (Razor sharp 4K)
      ctxF.fillStyle = '#ffffff';
      ctxF.font = 'bold 156px "Geist Mono", sans-serif';
      ctxF.textAlign = 'center';
      ctxF.fillText('Hussein Hassan', 1024, 1770);

      // Role titles (Green Accent)
      ctxF.fillStyle = '#22c55e';
      ctxF.font = 'bold 64px "Geist Mono", monospace';
      ctxF.fillText('DENTAL BILLING SPECIALIST', 1024, 1890);
      ctxF.font = '600 52px "Geist Mono", monospace';
      ctxF.fillStyle = '#86efac';
      ctxF.fillText('& HEALTHCARE VIRTUAL ASSISTANT', 1024, 1976);

      // Divider Line
      ctxF.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctxF.lineWidth = 6;
      ctxF.beginPath();
      ctxF.moveTo(140, 2070);
      ctxF.lineTo(1908, 2070);
      ctxF.stroke();

      // Bottom Info Boxes
      // Box 1: FULL NAME
      ctxF.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctxF.beginPath();
      ctxF.roundRect(140, 2140, 840, 540, 56);
      ctxF.fill();
      ctxF.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctxF.lineWidth = 6;
      ctxF.stroke();

      ctxF.fillStyle = '#94a3b8';
      ctxF.font = 'bold 48px "Geist Mono", monospace';
      ctxF.textAlign = 'left';
      ctxF.fillText('FULL NAME', 220, 2270);

      ctxF.fillStyle = '#ffffff';
      ctxF.font = 'bold 64px "Geist Mono", monospace';
      ctxF.fillText('Abdul Hussein', 220, 2410);
      ctxF.fillText('P. Hassan', 220, 2510);

      // Box 2: STATUS
      ctxF.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctxF.beginPath();
      ctxF.roundRect(1068, 2140, 840, 540, 56);
      ctxF.fill();
      ctxF.strokeStyle = 'rgba(34, 197, 94, 0.4)';
      ctxF.lineWidth = 6;
      ctxF.stroke();

      ctxF.fillStyle = '#94a3b8';
      ctxF.font = 'bold 48px "Geist Mono", monospace';
      ctxF.textAlign = 'left';
      ctxF.fillText('STATUS', 1148, 2270);

      // Status indicator green dot
      ctxF.fillStyle = '#22c55e';
      ctxF.beginPath();
      ctxF.arc(1180, 2430, 28, 0, Math.PI * 2);
      ctxF.fill();

      ctxF.fillStyle = '#4ade80';
      ctxF.font = 'bold 76px "Geist Mono", monospace';
      ctxF.fillText('Active VA', 1248, 2456);

      ctxF.fillStyle = '#64748b';
      ctxF.font = '44px "Geist Mono", monospace';
      ctxF.fillText('Ready for US Practice', 1148, 2560);

      // Footer accent bar
      ctxF.fillStyle = '#22c55e';
      ctxF.fillRect(140, 2750, 1768, 20);

      textureFront.needsUpdate = true;
    };

    img.onload = renderFrontCanvas;
    renderFrontCanvas();

    // ==========================================
    // 2. GENERATE CARD BACK CANVAS TEXTURE (4K RESOLUTION: 2048 x 2900)
    // ==========================================
    const canvasBack = document.createElement('canvas');
    canvasBack.width = 2048;
    canvasBack.height = 2900;
    const ctxB = canvasBack.getContext('2d');

    const textureBack = new THREE.CanvasTexture(canvasBack);
    textureBack.colorSpace = THREE.SRGBColorSpace;
    textureBack.generateMipmaps = true;
    textureBack.minFilter = THREE.LinearMipmapLinearFilter;
    textureBack.magFilter = THREE.LinearFilter;
    textureBack.anisotropy = maxAnisotropy;

    const renderBackCanvas = () => {
      ctxB.fillStyle = '#06080d';
      ctxB.fillRect(0, 0, 2048, 2900);

      // Curved outer border
      ctxB.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctxB.lineWidth = 36;
      ctxB.beginPath();
      ctxB.roundRect(48, 48, 1952, 2804, 120);
      ctxB.stroke();

      // Top slot hole
      ctxB.fillStyle = '#000000';
      ctxB.beginPath();
      ctxB.roundRect(844, 76, 360, 72, 36);
      ctxB.fill();
      ctxB.strokeStyle = '#4ade80';
      ctxB.lineWidth = 8;
      ctxB.stroke();

      // Magnetic Stripe
      ctxB.fillStyle = '#111420';
      ctxB.fillRect(48, 240, 1952, 340);

      // Signature bar
      ctxB.fillStyle = '#e2e8f0';
      ctxB.fillRect(140, 680, 1240, 190);
      ctxB.fillStyle = '#0f172a';
      ctxB.font = 'italic bold 72px "Geist Mono", cursive';
      ctxB.fillText('Hussein Hassan (Authorized)', 180, 810);

      // HIPAA Seal Badge (Green)
      ctxB.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctxB.beginPath();
      ctxB.roundRect(1440, 680, 460, 190, 40);
      ctxB.fill();
      ctxB.strokeStyle = '#22c55e';
      ctxB.lineWidth = 6;
      ctxB.stroke();

      ctxB.fillStyle = '#4ade80';
      ctxB.font = 'bold 48px "Geist Mono", monospace';
      ctxB.textAlign = 'center';
      ctxB.fillText('HIPAA', 1670, 770);
      ctxB.fillText('COMPLIANT', 1670, 830);

      // Practice info
      ctxB.fillStyle = '#ffffff';
      ctxB.font = 'bold 84px "Geist Mono", monospace';
      ctxB.fillText('FAIRTRADE OUTSOURCING', 1024, 1060);

      ctxB.fillStyle = '#22c55e';
      ctxB.font = 'bold 56px "Geist Mono", monospace';
      ctxB.fillText('DENTAL BILLING VA (2022–2026)', 1024, 1180);

      ctxB.fillStyle = '#94a3b8';
      ctxB.font = '48px "Geist Mono", monospace';
      ctxB.fillText('Clearinghouses • CDT Coding • A/R Recovery', 1024, 1300);
      ctxB.fillText('Email: vinzhassan0114@gmail.com', 1024, 1400);
      ctxB.fillText('Phone: +63 916 462 1284', 1024, 1490);

      // Barcode
      ctxB.fillStyle = '#ffffff';
      const barcodeY = 1680;
      const barcodeH = 300;
      let barX = 240;
      const barPattern = [10, 20, 8, 28, 12, 10, 24, 14, 8, 32, 12, 20, 10, 28, 14, 10, 24, 12, 8, 32, 20, 10, 14, 28, 10, 20, 12, 24, 10, 32, 14, 10, 20, 12, 28, 10, 14, 20, 10, 28, 20, 10, 24];
      for (let i = 0; i < barPattern.length; i++) {
        const barW = barPattern[i];
        if (i % 2 === 0) {
          ctxB.fillRect(barX, barcodeY, barW, barcodeH);
        }
        barX += barW + 10;
      }

      ctxB.fillStyle = '#64748b';
      ctxB.font = 'bold 52px "Geist Mono", monospace';
      ctxB.fillText('* DENTAL-BILLER-VA-2026 *', 1024, 2120);

      ctxB.fillStyle = '#475569';
      ctxB.font = '44px "Geist Mono", monospace';
      ctxB.fillText('Official Credential of Hussein Hassan', 1024, 2320);
      ctxB.fillText('Davao City, Philippines • Remote US Operations', 1024, 2400);

      textureBack.needsUpdate = true;
    };

    renderBackCanvas();

    // ==========================================
    // 3. CREATE SMALLER 3D CARD MESH
    // ==========================================
    const cardW = 2.4;
    const cardH = 3.4;
    const cornerR = 0.22;

    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const shape = new THREE.Shape();
    const x = -cardW / 2;
    const y = -cardH / 2;
    shape.moveTo(x + cornerR, y);
    shape.lineTo(x + cardW - cornerR, y);
    shape.quadraticCurveTo(x + cardW, y, x + cardW, y + cornerR);
    shape.lineTo(x + cardW, y + cardH - cornerR);
    shape.quadraticCurveTo(x + cardW, y + cardH, x + cardW - cornerR, y + cardH);
    shape.lineTo(x + cornerR, y + cardH);
    shape.quadraticCurveTo(x, y + cardH, x, y + cardH - cornerR);
    shape.lineTo(x, y + cornerR);
    shape.quadraticCurveTo(x, y, x + cornerR, y);

    const extrudeSettings = {
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.012
    };

    const cardGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    cardGeo.center();

    // Map UVs for front and back
    const posAttr = cardGeo.attributes.position;
    const uvs = new Float32Array(posAttr.count * 2);
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      uvs[i * 2] = (px + cardW / 2) / cardW;
      uvs[i * 2 + 1] = (py + cardH / 2) / cardH;
    }
    cardGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const frontMat = new THREE.MeshStandardMaterial({
      map: textureFront,
      roughness: 0.25,
      metalness: 0.1,
    });
    const backMat = new THREE.MeshStandardMaterial({
      map: textureBack,
      roughness: 0.25,
      metalness: 0.1,
    });

    const cardMeshFront = new THREE.Mesh(cardGeo, frontMat);
    cardMeshFront.castShadow = true;
    cardGroup.add(cardMeshFront);

    const cardMeshBack = new THREE.Mesh(cardGeo, backMat);
    cardMeshBack.rotation.y = Math.PI;
    cardMeshBack.position.z = -0.01;
    cardGroup.add(cardMeshBack);

    // Realistic Metallic Clip
    const clipGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const clipMesh = new THREE.Mesh(clipGeo, clipMat);
    clipMesh.rotation.z = Math.PI / 2;
    clipMesh.position.set(0, cardH / 2 - 0.09, 0.02);
    cardGroup.add(clipMesh);

    // ==========================================
    // 4. LANYARD STRAP: DARK GREEN BACKGROUND, NO TEXT
    // ==========================================
    const lanyardCanvas = document.createElement('canvas');
    lanyardCanvas.width = 128;
    lanyardCanvas.height = 512;
    const lCtx = lanyardCanvas.getContext('2d');

    // CRITICAL USER INSTRUCTION: "change the color of the lanyard to a darker green."
    lCtx.fillStyle = '#021809'; // Very deep, dark forest green
    lCtx.fillRect(0, 0, 128, 512);

    // Subtle weave pattern
    lCtx.fillStyle = '#031f0d';
    lCtx.fillRect(8, 0, 112, 512);

    // Edge stitch lines in deep muted dark pine green
    lCtx.strokeStyle = '#063318';
    lCtx.lineWidth = 6;
    lCtx.strokeRect(4, 0, 120, 512);
    // (NO TEXT AT ALL on the lanyard)

    const lanyardTexture = new THREE.CanvasTexture(lanyardCanvas);
    lanyardTexture.wrapS = THREE.RepeatWrapping;
    lanyardTexture.wrapT = THREE.RepeatWrapping;
    lanyardTexture.repeat.set(1, 4);

    const lanyardMaterial = new THREE.MeshBasicMaterial({
      map: lanyardTexture,
      side: THREE.DoubleSide
    });

    const strapSegments = 28;
    const strapWidth = 0.36;
    const strapGeo = new THREE.PlaneGeometry(strapWidth, 1, 1, strapSegments);
    const strapMesh = new THREE.Mesh(strapGeo, lanyardMaterial);
    scene.add(strapMesh);

    // Invisible Hit Box Plane for the Lanyard to make dragging effortless
    const hitBoxGeo = new THREE.PlaneGeometry(0.85, 1, 1, strapSegments);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
    const lanyardHitMesh = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    scene.add(lanyardHitMesh);

    // CRITICAL USER INSTRUCTION:
    // "when stretching the 3D card, you can see the lanyard's end at the top. it shouldnt be seen, fix it."
    // Set the anchor 10.0 units ABOVE the top of the visible screen!
    // That way, the top end of the ribbon is ALWAYS far offscreen, so it is IMPOSSIBLE to ever see the end!
    let topAnchor = new THREE.Vector3(restX, getVisibleTop() + 10.0, 0);

    // Function to keep lanyard 100% connected extending into deep offscreen space
    const updateLanyardAttachment = () => {
      const cardSlotLocal = new THREE.Vector3(0, cardH / 2 - 0.05, 0);
      const cardSlotWorld = cardSlotLocal.clone();
      cardGroup.localToWorld(cardSlotWorld);

      topAnchor.x = restX;
      topAnchor.y = getVisibleTop() + 10.0; // 10 units ABOVE screen top: NEVER SEEN!

      const pos = strapGeo.attributes.position;
      const hitPos = hitBoxGeo.attributes.position;
      const totalRows = strapSegments + 1;

      const camPos = camera.position;

      for (let j = 0; j < totalRows; j++) {
        const t = j / strapSegments; // 0 = card, 1 = anchor

        const curX = cardSlotWorld.x * (1 - t) + topAnchor.x * t;
        const curY = cardSlotWorld.y * (1 - t) + topAnchor.y * t;
        const curZ = cardSlotWorld.z * (1 - t) + topAnchor.z * t;

        const center = new THREE.Vector3(curX, curY, curZ);
        const toCam = new THREE.Vector3().subVectors(camPos, center).normalize();
        const dir = new THREE.Vector3().subVectors(topAnchor, cardSlotWorld).normalize();
        const side = new THREE.Vector3().crossVectors(dir, toCam).normalize();

        if (side.lengthSq() < 0.01) {
          side.set(1, 0, 0);
        }

        const halfW = strapWidth / 2;
        const idxL = j * 2;
        const idxR = j * 2 + 1;

        pos.setXYZ(idxL, curX - side.x * halfW, curY - side.y * halfW, curZ - side.z * halfW);
        pos.setXYZ(idxR, curX + side.x * halfW, curY + side.y * halfW, curZ + side.z * halfW);

        // Hit box
        const hitHalfW = 0.45;
        hitPos.setXYZ(idxL, curX - side.x * hitHalfW, curY - side.y * hitHalfW, curZ - side.z * hitHalfW);
        hitPos.setXYZ(idxR, curX + side.x * hitHalfW, curY + side.y * hitHalfW, curZ + side.z * hitHalfW);
      }

      pos.needsUpdate = true;
      hitPos.needsUpdate = true;
      strapMesh.position.set(0, 0, 0);
      strapMesh.rotation.set(0, 0, 0);
      lanyardHitMesh.position.set(0, 0, 0);
      lanyardHitMesh.rotation.set(0, 0, 0);

      // Compute bounding spheres for reliable raycasting
      strapGeo.computeBoundingBox();
      strapGeo.computeBoundingSphere();
      hitBoxGeo.computeBoundingBox();
      hitBoxGeo.computeBoundingSphere();
    };

    // ==========================================
    // 5. OPEN ANIMATION & PHYSICS
    // ==========================================
    let cardPos = { x: restX, y: getVisibleTop() + 8.0, z: 0 }; // Starts high above screen
    let cardVelocity = { x: 0, y: -0.22, z: 0 }; // Fast downward plunge
    let cardRotation = { x: 0.15, y: 0.2, z: 0 };
    let rotVelocity = { x: 0, y: 0, z: 0 };

    let isDragging = false;
    let dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let raycaster = new THREE.Raycaster();
    let mouseNDC = new THREE.Vector2();
    let prevPointer = { x: 0, y: 0 };

    const getIntersection = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      const hit = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, hit);
      return hit;
    };

    const onPointerDown = (e) => {
      const rect = container.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);

      // Detect hit on Card OR Lanyard Strap
      const intersects = raycaster.intersectObjects([
        cardMeshFront, 
        cardMeshBack, 
        strapMesh, 
        lanyardHitMesh
      ]);

      if (intersects.length > 0) {
        isDragging = true;
        setHintVisible(false);
        prevPointer = { x: e.clientX, y: e.clientY };
        cardVelocity = { x: 0, y: 0, z: 0 };
      }
    };

    const onPointerMove = (e) => {
      if (isDragging) {
        const hit = getIntersection(e.clientX, e.clientY);
        if (hit) {
          const deltaX = e.clientX - prevPointer.x;
          const deltaY = e.clientY - prevPointer.y;

          cardPos.x += (hit.x - cardPos.x) * 0.45;
          cardPos.y += (hit.y - cardPos.y) * 0.45;

          rotVelocity.y = deltaX * 0.022;
          rotVelocity.x = deltaY * 0.016;

          cardRotation.y += rotVelocity.y;
          cardRotation.x += rotVelocity.x;

          prevPointer = { x: e.clientX, y: e.clientY };
        }
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0]);
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0]);
    };
    const onTouchEnd = () => onPointerUp();

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      restX = getRestX();
      topAnchor.x = restX;
      topAnchor.y = getVisibleTop() + 10.0;
    };
    window.addEventListener('resize', onResize);

    // ==========================================
    // 6. ANIMATION LOOP (Spring & Auto-Face Front)
    // ==========================================
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        const springK = 0.042;
        const damping = 0.88;

        const forceX = (restX - cardPos.x) * springK;
        const forceY = (restY - cardPos.y) * springK;

        cardVelocity.x = (cardVelocity.x + forceX) * damping;
        cardVelocity.y = (cardVelocity.y + forceY) * damping;

        cardPos.x += cardVelocity.x;
        cardPos.y += cardVelocity.y;

        const targetRotZ = -(cardPos.x - restX) * 0.18;
        cardRotation.z += (targetRotZ - cardRotation.z) * 0.08;

        // Auto-face front on release
        cardRotation.y += (0 - cardRotation.y) * 0.10;
        cardRotation.x += (0 - cardRotation.x) * 0.10;

        rotVelocity.y *= 0.82;
        rotVelocity.x *= 0.82;

        const time = clock.getElapsedTime();
        cardPos.y += Math.sin(time * 2.0) * 0.0015;
      }

      // Update card group transform
      cardGroup.position.set(cardPos.x, cardPos.y, cardPos.z);
      cardGroup.rotation.set(cardRotation.x, cardRotation.y, cardRotation.z);

      // Update lanyard connection
      updateLanyardAttachment();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cardGeo.dispose();
      clipGeo.dispose();
      strapGeo.dispose();
      hitBoxGeo.dispose();
      textureFront.dispose();
      textureBack.dispose();
      lanyardTexture.dispose();
    };
  }, []);

  return (
    <div className={`relative select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* CRITICAL USER INSTRUCTION: "put this at the right side of the 3D card." */}
      {hintVisible && (
        <div className="absolute top-[38%] left-1/2 md:left-[30%] lg:left-[27%] -translate-y-1/2 -translate-x-1/2 md:translate-x-0 px-4 py-2 rounded-full bg-black/90 backdrop-blur-md border border-green-500/50 text-[11px] font-mono text-green-400 pointer-events-none whitespace-nowrap shadow-[0_0_20px_rgba(34,197,94,0.25)] flex items-center gap-2 animate-bounce z-30">
          <span>✦ Drag Card or Lanyard to Stretch • 360° Spin (Returns Front)</span>
        </div>
      )}
    </div>
  );
}
