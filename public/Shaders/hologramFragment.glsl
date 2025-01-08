// hologramFragment.glsl
precision highp float;
uniform float uEffectIntensity;
// Uniforms
uniform sampler2D textureSampler;
uniform vec3 uColor;
uniform vec3 uBorderColor;
uniform float uCornerRadius;
uniform float uBorderThickness;
uniform float uGridThickness;
uniform float uGridSubdivisions;
uniform float uBandWidth;
uniform float uBandSpeed;
uniform float uTime;

// Varyings
varying vec2 vUV;

float roundedRectangle(vec2 uv, vec2 pos, vec2 size, float borderThickness) {
    return length(max(abs(uv - pos), size) - size) - (1.0 - borderThickness);
}

void main(void) {
       vec3 originalColor = texture2D(textureSampler, vUV).rgb;

    // Prepare grid effect
    float gridMask = smoothstep(1.0 - uGridThickness, 1.0, fract(vUV.x * uGridSubdivisions - 1.0 - uGridThickness * 0.25)) +
                     smoothstep(1.0 - uGridThickness, 1.0, fract(vUV.y * uGridSubdivisions - 1.0 - uGridThickness * 0.25));
    vec3 gridColor = clamp(uColor * 0.2, 0.0, 1.0);

    // Prepare band effect
    float bandMask = 1.0 - smoothstep(0.0, uBandWidth, abs(vUV.y - fract(uTime * uBandSpeed)));
    vec3 bandColor = clamp(uColor * 0.6, 0.0, 1.0);

    // Rounded border mask
    float s = (1.0 - uCornerRadius) / 2.0;
    vec2 size = vec2(s, s);
    float thickness = pow(uBorderThickness, 0.25);
    float borderSdf = roundedRectangle(vUV, vec2(0.5, 0.5), size, thickness);

    // Smooth step for anti-aliasing
    float pd = fwidth(borderSdf);
    float borderMask = clamp(borderSdf / pd, 0.0, 1.0);

    float inScreenMask = 1.0 - borderMask;
    float innerLight = roundedRectangle(vUV, vec2(0.5, 0.5), size - thickness / 8.0, thickness) * inScreenMask;

    // Combine all effects
    vec3 effectColor = uColor * inScreenMask +
                       uBorderColor * borderMask +
                       bandColor * bandMask * inScreenMask +
                       gridColor * gridMask * inScreenMask +
                       clamp(innerLight * uColor * 2.0, 0.0, 1.0);

    // Blend effect with original color based on intensity
    vec3 finalColor = mix(originalColor, effectColor, uEffectIntensity);

    gl_FragColor = vec4(finalColor, 1.0);
}
