// Qualia Fragment Shader - The atmosphere of perception
// Creates the ethereal, shifting quality of conscious experience

uniform float uTime;
uniform float uChaosLevel;
uniform float uEntropy;
uniform vec3 uComfortColor;
uniform float uTemperature;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Noise function
float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

// 3D Perlin-like noise
float perlin(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = noise(i);
    float n100 = noise(i + vec3(1.0, 0.0, 0.0));
    float n010 = noise(i + vec3(0.0, 1.0, 0.0));
    float n110 = noise(i + vec3(1.0, 1.0, 0.0));
    float n001 = noise(i + vec3(0.0, 0.0, 1.0));
    float n101 = noise(i + vec3(1.0, 0.0, 1.0));
    float n011 = noise(i + vec3(0.0, 1.0, 1.0));
    float n111 = noise(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);

    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);

    return mix(nxy0, nxy1, f.z);
}

// Fractal Brownian Motion
float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for(int i = 0; i < 5; i++) {
        value += amplitude * perlin(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}

void main() {
    // Animated position based on time and chaos
    vec3 animatedPos = vPosition + vec3(uTime * 0.1, uTime * 0.15, uTime * 0.08);

    // Multi-scale noise for complex patterns
    float n1 = fbm(animatedPos * 2.0 + uChaosLevel * 5.0);
    float n2 = fbm(animatedPos * 4.0 + uTime * 0.5);

    // Combine noise with entropy
    float pattern = mix(n1, n2, uEntropy);

    // Create swirling effect based on chaos
    float swirl = sin(vPosition.x * 3.0 + uTime + pattern * 5.0) *
                  cos(vPosition.y * 3.0 + uTime * 1.2 + pattern * 5.0);

    // Base color influenced by comfort level
    vec3 baseColor = uComfortColor;

    // Add temperature-based glow
    vec3 glowColor = vec3(1.0, 0.5, 0.2) * uTemperature;

    // Mix colors based on pattern and swirl
    vec3 finalColor = mix(baseColor, glowColor, pattern * 0.3);
    finalColor += vec3(swirl * 0.2);

    // Add fresnel effect for edge glow
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    finalColor += fresnel * uComfortColor * 0.5;

    // Alpha based on pattern complexity
    float alpha = 0.3 + pattern * 0.4 + fresnel * 0.3;

    gl_FragColor = vec4(finalColor, alpha);
}
