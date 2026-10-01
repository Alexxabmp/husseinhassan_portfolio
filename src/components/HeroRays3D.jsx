import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroRays3D Component
 * Renders the exact luminous chromatic light rays from the reference template:
 * - Pure black background
 * - Horizontal undulating rays of electric cyan, azure, and deep turquoise
 * - Merging into a warm sunset amber / golden orange glow in the lower right
 * - Interactive mouse reaction with smooth physics inertia
 * - Floating luminous dust particles drifting along the ray path
 */
export default function HeroRays3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent so pure black background shows
    container.appendChild(renderer.domElement);

    // Mouse Tracking with smooth lerp
    const mouse = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = clientX / rect.width;
      mouse.targetY = 1.0 - (clientY / rect.height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Custom Shader for the Colored Rays matching the uploaded sample photo
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Pseudo-noise helper
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = vUv;
        
        // Aspect ratio correction
        float aspect = uResolution.x / uResolution.y;
        vec2 p = uv;
        p.x *= aspect;

        // Base flow direction: from left-center across to the right
        float t = uTime * 0.4;
        
        // Interactive mouse distortion
        vec2 mouseP = uMouse;
        mouseP.x *= aspect;
        float distToMouse = length(p - mouseP);
        float mouseInfluence = smoothstep(0.8, 0.0, distToMouse) * 0.25;

        // Multi-frequency wave calculation for the horizontal ribbon rays
        // The rays emanate primarily on the right half (x > 0.3)
        float wave1 = sin(uv.x * 4.5 - t * 1.5 + mouseInfluence) * 0.08;
        float wave2 = cos(uv.x * 7.0 + t * 0.9) * 0.04;
        float wave3 = sin(uv.x * 12.0 - t * 2.2) * 0.02;
        float combinedWave = wave1 + wave2 + wave3;

        // Vertical centerline of the primary ray beam
        // Flows gently upwards towards the right or horizontally across mid-height
        float rayCenterY = 0.52 + combinedWave + (uv.x - 0.5) * 0.08;

        // Horizontal masking: rays emerge around x=0.32 and stream strongly across the right
        float xFadeIn = smoothstep(0.25, 0.45, uv.x);
        float xFadeOut = smoothstep(1.05, 0.85, uv.x);
        float xMask = xFadeIn * (0.85 + 0.15 * xFadeOut);

        // Calculate distance to the main ray path
        float distToRay = abs(uv.y - rayCenterY);

        // Ray intensity bands (core stream + ethereal outer halo)
        float coreBeam = exp(-distToRay * 32.0);
        float midGlow = exp(-distToRay * 14.0) * 0.7;
        float ambientGlow = exp(-distToRay * 4.5) * 0.35;
        
        // Fine filament streaks
        float filamentNoise = noise(vec2(uv.x * 24.0 - t * 3.0, uv.y * 40.0));
        float filaments = pow(filamentNoise, 3.0) * exp(-distToRay * 20.0) * 0.6;

        float totalIntensity = (coreBeam * 1.2 + midGlow + ambientGlow + filaments) * xMask;

        // Secondary lower warm amber / sunset horizon glow (matches right-bottom of template)
        float sunsetDist = length(vec2((uv.x - 0.82) * 1.2, (uv.y - 0.38) * 1.8));
        float sunsetGlow = exp(-sunsetDist * 3.2) * smoothstep(0.4, 0.75, uv.x) * 0.75;

        // Color definitions matching the template:
        // Top & Core: Electric Cyan, Neon Turquoise, Sky Azure
        vec3 colorCyanCore = vec3(0.0, 0.94, 1.0);    // #00f0ff
        vec3 colorTealMid   = vec3(0.04, 0.75, 0.85);  // #0bc0d9
        vec3 colorDeepSky   = vec3(0.06, 0.45, 0.95);  // #0f73f2
        vec3 colorViolet    = vec3(0.35, 0.25, 0.85);  // soft violet haze

        // Lower / Horizon: Sunset Amber & Warm Golden Orange
        vec3 colorAmberWarm  = vec3(0.98, 0.62, 0.15); // #fb9e26
        vec3 colorSunsetGold = vec3(0.85, 0.35, 0.05); // #d9590d

        // Vertical chromatic gradient: Upper is cyan/blue, Lower is amber/gold
        float vertBlend = smoothstep(0.44, 0.58, uv.y);
        vec3 rayColorUpper = mix(colorDeepSky, colorCyanCore, coreBeam * 0.8 + 0.2);
        rayColorUpper = mix(rayColorUpper, colorViolet, smoothstep(0.55, 0.75, uv.y) * 0.5);

        vec3 rayColorLower = mix(colorSunsetGold, colorAmberWarm, coreBeam);

        // Blended primary stream
        vec3 streamColor = mix(rayColorLower, rayColorUpper, vertBlend);

        // Combine stream with sunset orb glow
        vec3 finalColor = streamColor * totalIntensity + colorAmberWarm * sunsetGlow;

        // Subtle chromatic aberration on edges
        float edgeAb = smoothstep(0.05, 0.2, distToRay) * totalIntensity * 0.2;
        finalColor.r += edgeAb * 0.3;
        finalColor.b += edgeAb * 0.5;

        // Alpha calculation so it blends seamlessly over pitch black
        float alpha = clamp(totalIntensity * 1.1 + sunsetGlow * 0.9, 0.0, 1.0);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
    };

    const planeGeo = new THREE.PlaneGeometry(2, 2);
    const planeMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(planeGeo, planeMat);
    scene.add(mesh);

    // Drifting luminous dust particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Favor x from 0.3 to 1.0 and y from 0.3 to 0.7
      positions[i * 3] = (Math.random() * 0.8 + 0.2) * 2 - 1; // -0.6 to 1.0
      positions[i * 3 + 1] = (Math.random() * 0.45 + 0.3) * 2 - 1; // around centerline
      positions[i * 3 + 2] = 0.1;
      speeds[i] = Math.random() * 0.003 + 0.001;
      sizes[i] = Math.random() * 3 + 1.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 2.5,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Damped mouse movement (spring lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Animate particles along the stream
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        // Move horizontally right
        posAttr.array[i * 3] += speeds[i];
        // Slight undulation
        posAttr.array[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.0006;

        // Wrap around
        if (posAttr.array[i * 3] > 1.1) {
          posAttr.array[i * 3] = -0.5 + Math.random() * 0.2;
          posAttr.array[i * 3 + 1] = (Math.random() * 0.4 + 0.35) * 2 - 1;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Three.js Canvas for the dynamic rays & particles */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-auto" />

      {/* Layered CSS Glow Filter for seamless, silk-smooth dispersion over pure pitch black */}
      <div 
        className="absolute top-[28%] right-[5%] w-[55vw] h-[32vh] rounded-full opacity-65 pointer-events-none blur-[90px] mix-blend-screen"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.45) 0%, rgba(6, 182, 212, 0.3) 40%, rgba(14, 115, 242, 0.15) 70%, transparent 100%)'
        }}
      />
      <div 
        className="absolute top-[42%] right-[8%] w-[42vw] h-[30vh] rounded-full opacity-60 pointer-events-none blur-[110px] mix-blend-screen"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.45) 0%, rgba(245, 158, 11, 0.3) 45%, rgba(217, 89, 13, 0.15) 75%, transparent 100%)'
        }}
      />
    </div>
  );
}
