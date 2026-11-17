//SVG PARTICLE SYSTEM

// 基本設定
const SVG_FX = {
    particleCount: 1000000,
    sampleSize: 512,
    particleSize: 1.0,// 粒子基礎大小
    maxFPS: 30,// 最大 FPS
    maxDPR: 2,// 手機 DPR
};

function quantize216(r, g, b) {
    return {
        r: Math.min(5, Math.round(r / 51)) * 51,
        g: Math.min(5, Math.round(g / 51)) * 51,
        b: Math.min(5, Math.round(b / 51)) * 51
    };
}

function hexToRgb(hex) {
    const value = hex.replace("#", "");

    return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16)
    };
}

// ASCII字元規則
const SVG_ASCII = {
    pools: [
        "1il!;:",
        "rtfjcvxz=+",
        "aeoun0{}[]<>",
        "08B$#&%Q"
    ],
    outline(gx, gy) {

        const ax = Math.abs(gx);
        const ay = Math.abs(gy);

        if (ax + ay === 0) return "+";

        return ax > 2 * ay
            ? "|"
            : ay > 2 * ax
                ? (gy > 0 ? "_" : "-")
                : (gx * gy > 0 ? "/" : "\\");

    }
};


// 顏色設定
const SVG_FX_STYLE = {
    brightness: 1.42, // 載入素材基礎顏色亮度
    globalBrightness: 1.0, // 共同顯示亮度
    saturation: 1.3, // 飽和度
    contrast: 1.12, // 對比度
    hueRotate: 0, // 色相旋轉
    opacity: 1, // 整體透明度
    red: 1.0,
    green: 1.0,
    blue: 1.18,
    blueBoost: 1.12, // 藍色額外亮度
    edgeBrightness: 1.12, // 邊緣粒子亮度
    edgeSize: 1.2, // 邊緣粒子大小倍率
    thinEdgeMinLum: 0.85
};

// SVG 素材
function generateSVGFrames(
    folder,
    prefix,
    count,
    extension = ".svg"
) {

    const frames = [];

    for (let i = 0; i < count; i++) {

        frames.push(
            `${folder}/${prefix}${i}${extension}`
        );

    }

    return frames;

}

const SVG_FX_ASSETS = {

    stitch: {

        frames: generateSVGFrames(
            "assets/stitch",
            "stitch",
            32
        ),
        step: 2

    },

    stitch1: {
        svg: "assets/stitch1.svg",
        step: 2
    },

    stitch2: {
        frames: generateSVGFrames(
            "assets/stitch2",
            "stitch2",
            19
        ),
        step: 2

    },

    cat: {

        frames: generateSVGFrames(
            "assets/cat",
            "cat",
            15
        ),
        step: 2

    },

    cat1: {
        frames: generateSVGFrames(
            "assets/cat1",
            "cat1",
            36
        ),
        step: 2
    },

    scorpio: {
        svg: "assets/scorpio.svg",
        color: "#3a8be8",
        brightness: 0.5,
    },

    scorpioSymbol: {
        svg: "assets/scorpioSymbol.svg",
        step: 1
    },

    birthdayDate: {
        svg: `
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 140">

            <text
                x="300"
                y="100"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="100"
                font-weight="bold"
                letter-spacing="5"
                fill="#d9edff">
                2026.11.18
            </text>

        </svg>`,
        step: 2

    },

    heart: {

        svg: `
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 200 200">

            <path
                d="M100 175
                   C80 150 20 110 20 65
                   C20 15 85 10 100 55
                   C115 10 180 15 180 65
                   C180 110 120 150 100 175Z"
                fill="#ff5d9e"/>

        </svg>
        `

    },

};

// 動畫時間軸
const SVG_FX_TIMELINE = [
    {
        start: 12.0,
        duration: 2.0,

        effect: "assemble",
        target: "stitch",

        x: 0.5,
        y: 0.57,
        scale: 0.78
    },

    {
        start: 14.0,
        duration: 5.0,

        effect: "frame",
        target: "stitch",

        fps: 5,

        x: 0.5,
        y: 0.57,
        scale: 0.78
    },

    {

    },

    {
        start: 19.0,
        duration: 2.0,

        effect: "splitMorph",
        from: "stitch",

        x: 0.5,
        y: 0.57,
        scale: 0.78,

        targets: [
            {
                name: "birthdayDate",
                x: 0.5,
                y: 0.15,
                scale: 1.3
            },

            {
                name: "scorpioSymbol",
                x: 0.5,
                y: 0.7,
                scale: 1.3
            }
        ]
    },

    {
        start: 21.0,
        duration: 2.0,

        effect: "hold",

        target: "birthdayDate",

        x: 0.5,
        y: 0.15,
        scale: 1.3
    },

    {
        start: 21.0,
        duration: 2.0,

        effect: "hold",

        target: "scorpioSymbol",

        x: 0.5,
        y: 0.7,
        scale: 1.3
    },

    {
        start: 23.0,
        duration: 1.0,

        effect: "dissolve",

        from: "birthdayDate",

        x: 0.5,
        y: 0.15,
        scale: 0.78
    },

    {
        start: 23.0,
        duration: 1.0,

        effect: "dissolve",

        from: "scorpioSymbol",

        x: 0.5,
        y: 0.7,
        scale: 0.25
    },

    {
        start: 24.0,
        duration: 0.5,

        effect: "assemble",

        target: "heart",

        x: 0.5,
        y: 0.52,
        scale: 0.78
    },

    {
        start: 24.5,
        duration: 1.0,

        effect: "hold",

        target: "heart",

        x: 0.5,
        y: 0.52,
        scale: 0.78
    },

    {
        start: 25.5,
        duration: 1.5,

        effect: "splitMorph",

        from: "heart",

        x: 0.5,
        y: 0.52,
        scale: 0.78,

        targets: [
            {
                name: "cat",
                x: 0.90,
                y: 0.80,
                scale: 0.4
            },

            {
                name: "stitch1",
                x: 0.10,
                y: 0.18,
                scale: 0.45
            },

            {
                name: "scorpio",
                x: 0.5,
                y: 0.78,
                scale: 0.75,
                flipX: true
            }
        ]
    },

    {
        start: 27.0,
        duration: 8,

        effect: "frame",
        target: "cat",

        fps: 10,
        x: 0.90,
        y: 0.80,
        scale: 0.4
    },

    {
        start: 27.0,
        duration: 8,

        effect: "hold",
        target: "stitch1",

        x: 0.1,
        y: 0.18,
        scale: 0.45
    },

    {
        start: 27.0,
        duration: 11,

        effect: "hold",
        target: "scorpio",

        x: 0.5,
        y: 0.78,
        scale: 0.75,
        flipX: true
    },

    {
        start: 35.0,
        duration: 0.7,
        effect: "splitMorph",

        from: "stitch1",

        x: 0.1,
        y: 0.18,
        scale: 0.45,

        targets: [
            {
                name: "cat1",
                x: 0.1,
                y: 0.78,
                scale: 0.6
            }
        ]
    },

    {
        start: 35.0,
        duration: 0.7,
        effect: "splitMorph",

        from: "cat",
        x: 0.90,
        y: 0.80,
        scale: 0.4,
        
        targets: [
            {
                name: "stitch2",
                x: 0.85,y: 0.30,
                scale: 0.7,
                flipX: true
            }
        ]
    },

    {
        start: 35.7,
        duration: 4.3,

        effect: "frame",
        target: "cat1",

        fps: 10,

        x: 0.1,
        y: 0.78,
        scale: 0.6
    },

    {
        start: 35.7,
        duration:4.3,

        effect: "frame",
        target: "stitch2",

        fps: 10,

        x: 0.85,
        y: 0.30,
        scale: 0.7,
        flipX: true
    },
];


//工具函式
function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}

function lerp(a, b, t) {

    return a + (b - a) * t;

}

function easeOut(t) {

    return 1 - Math.pow(1 - t, 3);

}

function easeInOut(t) {

    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

}

function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;

    const l = (max + min) / 2;

    if (max !== min) {

        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {

            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

            case g:
                h = (b - r) / d + 2;
                break;

            case b:
                h = (r - g) / d + 4;
                break;

        }

        h /= 6;

    }

    return { h, s, l };

}

function hslToRgb(h, s, l) {

    let r, g, b;

    if (s === 0) {

        r = g = b = l;

    } else {

        const hue2rgb = (p, q, t) => {

            if (t < 0) t += 1;
            if (t > 1) t -= 1;

            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

            return p;

        };

        const q = l < 0.5
            ? l * (1 + s)
            : l + s - l * s;

        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);

    }

    return {

        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)

    };

}

// SVG 粒子系統
class SVGParticleSystem {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d", {
            alpha: true
        });

        this.assets = {};
        this.images = {};

        this.ready = false;

        this.lastRender = 0;

        this.resize();

        this.resizeHandler = () => this.resize();

        window.addEventListener(
            "resize",
            this.resizeHandler
        );

    }

    // Canvas 尺寸
    resize() {

        const rect = this.canvas.getBoundingClientRect();

        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            SVG_FX.maxDPR
        );

        this.width = width;
        this.height = height;
        this.dpr = dpr;

        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        this.lastRender = 0;

    }

    // 載入 SVG
    async loadImage(source) {

        return new Promise((resolve, reject) => {

            const img = new Image();

            let objectURL = null;

            img.onload = () => {

                if (objectURL) {
                    URL.revokeObjectURL(objectURL);
                }

                resolve(img);

            };

            img.onerror = () => {

                if (objectURL) {
                    URL.revokeObjectURL(objectURL);
                }

                reject(
                    new Error("SVG 載入失敗：" + source)
                );

            };

            if (
                typeof source === "string" &&
                source.trim().startsWith("<svg")
            ) {

                const blob = new Blob(
                    [source],
                    { type: "image/svg+xml" }
                );

                objectURL = URL.createObjectURL(blob);

                img.src = objectURL;

            } else {

                img.src = source;

            }

        });

    }

    // 載入一般 SVG 圖片，不轉換成粒子
    async loadDirectImages() {

        for (const [name, config] of Object.entries(SVG_FX_ASSETS)) {

            if (!config.image) continue;

            try {

                this.images[name] = await this.loadImage(
                    config.image
                );

                console.log(
                    `[SVG FX] ${name} 圖片載入完成`
                );

            } catch (error) {

                console.error(
                    `[SVG FX] ${name} 圖片載入失敗`,
                    error
                );

            }

        }

    }

    // 顏色調整 僅在載入 SVG 時執行
    adjustColor(r, g, b) {

        const style = SVG_FX_STYLE;

        // RGB 色彩調整
        r *= style.red;
        g *= style.green;
        b *= style.blue;

        // 亮度
        r *= style.brightness;
        g *= style.brightness;
        b *= style.brightness;

        // 對比
        r = (r - 128) * style.contrast + 128;
        g = (g - 128) * style.contrast + 128;
        b = (b - 128) * style.contrast + 128;

        r = clamp(r, 0, 255);
        g = clamp(g, 0, 255);
        b = clamp(b, 0, 255);

        // 飽和度
        const hsl = rgbToHsl(r, g, b);

        hsl.s = clamp(
            hsl.s * style.saturation,
            0,
            1
        );

        hsl.h = (
            hsl.h + style.hueRotate / 360 + 1
        ) % 1;

        let color = hslToRgb(
            hsl.h,
            hsl.s,
            hsl.l
        );

        // 藍色加強
        // 主要提高藍色的可辨識度
        color.b = clamp(
            color.b * style.blueBoost,
            0,
            255
        );

        return color;

    }

    // SVG 取樣
    async sampleSVG(source, forcedColor = null, forcedBrightness = null, step = 3) {
        const img = await this.loadImage(source);
        const size = SVG_FX.sampleSize; // 512

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });

        const fitScale = Math.min(480 / img.width, 480 / img.height);
        const w = img.width * fitScale;
        const h = img.height * fitScale;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(
            img,
            (size - w) / 2,
            (size - h) / 2,
            w,
            h
        );

        const data = ctx.getImageData(0, 0, size, size).data;
        const sampled = [];
        const fixedColor = forcedColor ? hexToRgb(forcedColor) : null;

        for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
                const index = (y * size + x) * 4;
                const alpha = data[index + 3];

                if (alpha < 100) continue;

                sampled.push({
                    x: (x - size / 2) / size,
                    y: (y - size / 2) / size,
                    fixedColor: !!fixedColor,
                    brightness: forcedBrightness ?? 1.0,
                    r: fixedColor ? fixedColor.r : data[index],
                    g: fixedColor ? fixedColor.g : data[index + 1],
                    b: fixedColor ? fixedColor.b : data[index + 2],
                    a: 1
                });
            }
        }

        if (sampled.length === 0) {
            throw new Error("SVG 沒有可見內容");
        }

        return sampled;
    }

    // 載入所有素材
    async loadAssets() {

        for (const [name, config] of Object.entries(SVG_FX_ASSETS)) {

            this.assets[name] = [];

            const sources = config.frames
                ? config.frames
                : config.svg
                    ? [config.svg]
                    : [];

            for (let i = 0; i < sources.length; i++) {

                try {

                    const particles = await this.sampleSVG(sources[i], config.color, config.brightness, config.step);

                    this.assets[name].push({
                        particles
                    });

                } catch (error) {

                    console.error(
                        `[SVG FX] ${name} 第 ${i} 張載入失敗`,
                        error
                    );

                }

                // 每 4 張讓出一次執行權
                if (i % 4 === 3) {

                    await new Promise(resolve => {
                        setTimeout(resolve, 0);
                    });

                }

            }

            console.log(
                `[SVG FX] ${name} 已載入 ${this.assets[name].length} 張`
            );

        }

        // 載入不經過粒子系統的圖片
        await this.loadDirectImages();
        this.ready = true;

        console.log(
            "[SVG FX] 素材載入完成"
        );

    }

    // 取得影格
    getFrame(name, index = 0) {

        const frames = this.assets[name];

        if (!frames || frames.length === 0) {
            return null;
        }

        return frames[
            clamp(index, 0, frames.length - 1)
        ];

    }

    getShape(name) {

        return this.getFrame(name, 0);

    }



    // 多目標粒子分配
    createSplitTargets(targetConfigs, count) {

        const targets = targetConfigs.map(config => {

            const frame = this.getShape(config.name);

            if (!frame || !frame.particles?.length) {
                console.warn(`[SVG FX] 找不到目標：${config.name}`);
                return null;
            }

            return {
                name: config.name,
                particles: frame.particles,

                // 目標在畫面上的位置
                x: config.x ?? 0.5,
                y: config.y ?? 0.5,

                // 目標圖案大小
                scale: config.scale ?? 0.3,
                flipX: !!config.flipX
            };

        }).filter(Boolean);

        if (targets.length === 0) {
            return [];
        }

        const total = count;
        const result = [];

        for (let i = 0; i < total; i++) {

            // 交錯分配原始粒子，避免愛心被切成上下兩半
            const targetIndex = i % targets.length;

            const target = targets[targetIndex];

            // 每個目標各自取得完整圖案的均勻取樣
            const groupIndex = Math.floor(
                i / targets.length
            );

            const groupCount = Math.ceil(
                total / targets.length
            );

            const localIndex = Math.floor(
                groupIndex / groupCount *
                target.particles.length
            );

            const particle = target.particles[
                Math.min(localIndex, target.particles.length - 1)
            ];

            result.push({

                targetName: target.name,

                // 目標圖案的原始粒子座標
                targetX: particle.x,
                targetY: particle.y,

                targetFlipX: target.flipX,

                // 目標圖案的顏色
                targetR: particle.r,
                targetG: particle.g,
                targetB: particle.b,
                targetA: particle.a,

                targetBrightness: particle.brightness ?? 1.0,

                // 目標在畫面上的位置與大小
                targetCenterX: target.x,
                targetCenterY: target.y,
                targetScale: target.scale

            });

        }

        return result;

    }



    // 統一粒子繪製核心
    drawParticles(particles, event, options = {}) {

        if (!particles) return;

        const ctx = this.ctx;

        const centerX = this.width * (event.x ?? 0.5);
        const centerY = this.height * (event.y ?? 0.5);

        const size =
            Math.min(this.width, this.height) *
            (event.scale || 1);

        const progress = options.progress ?? 1;
        const mode = options.mode || "normal";

        const fromParticles = options.from || null;
        const toParticles = options.to || null;

        const amount = easeInOut(progress);

        let total = particles.length;
        // Morph 結束時必須使用完整目標圖案的粒子數量
        if (mode === "morph" && toParticles) {
            total = Math.max(fromParticles.length, toParticles.length);
        }

        // 1. 欄數與主程式完全一致（手機 110，電腦 260）
        const cols = window.innerWidth < 768 ? 110 : 260;
        const cw = this.width / cols;
        const ch = cw * (14 / 9);
        const rows = Math.floor(this.height / ch);

        const grid = new Array(rows * cols).fill(null);

        const ti = Math.floor(
            (window.getBirthdayTime?.() || 0) * 4
        );

        for (let i = 0; i < total; i++) {

            const p = particles[Math.min(i, particles.length - 1)];

            let x = p.x;
            let y = p.y;

            let r = p.r;
            let g = p.g;
            let b = p.b;
            let alpha = p.a;
            let brightness = p.brightness ?? 1.0;

            // 組裝
            if (mode === "assemble") {

                const rnd = ((i * 2654435761) >>> 0) / 4294967296;
                const delay = rnd * 0.5;

                const localProgress = clamp(
                    (progress - delay) / (1 - delay),
                    0,
                    1
                );

                const reveal = easeOut(localProgress);

                // 起點：往外偏移一小段，而非縮到中心
                const angle = rnd * 6.2832 * 7;
                const spread = (1 - reveal) * 0.08;

                x += Math.cos(angle) * spread;
                y += Math.sin(angle) * spread;

                // alpha 不要從 0 開始，否則還沒出現的粒子等於空洞
                alpha *= 0.15 + 0.85 * reveal;
            }

            // 一般 Morph
            else if (mode === "morph") {

                const fromIndex = Math.floor(
                    i / total * fromParticles.length
                );

                const toIndex = Math.floor(
                    i / total * toParticles.length
                );

                const a = fromParticles[fromIndex];
                const target = toParticles[toIndex];

                if (!a || !target) continue;

                // 位置平滑插值
                x = lerp(a.x, target.x, amount);
                y = lerp(a.y, target.y, amount);

                // 顏色平滑插值
                r = lerp(a.r, target.r, amount);
                g = lerp(a.g, target.g, amount);
                b = lerp(a.b, target.b, amount);

                brightness = lerp(
                    a.brightness ?? 1.0,
                    target.brightness ?? 1.0,
                    amount
                );

                // 透明度維持穩定
                alpha = lerp(a.a, target.a, amount);

            }

            // 消散
            else if (mode === "scatter") {

                const angle = i * 2.399;
                const distance = progress * 1.1;

                x += Math.cos(angle) * distance;
                y += Math.sin(angle) * distance;

                alpha *= 1 - progress;

            }

            // 多目標 Morph

            // 多目標 Morph
            else if (mode === "splitMorph") {

                const from = fromParticles[i];
                const to = toParticles[i];

                if (!from || !to) continue;

                // 起點：原始圖案在畫面上的位置
                const startX =
                    centerX + from.x * size;

                const startY =
                    centerY + from.y * size;

                // 終點：目標圖案在畫面上的位置
                const minSize = Math.min(
                    this.width,
                    this.height
                );

                const endX =
                    this.width * to.targetCenterX +
                    (to.targetFlipX ? -to.targetX : to.targetX) *
                    minSize * to.targetScale;

                const endY =
                    this.height * to.targetCenterY +
                    to.targetY * minSize * to.targetScale;

                // 平滑移動
                const t = easeInOut(progress);

                x = lerp(startX, endX, t);
                y = lerp(startY, endY, t);

                // 顏色同步轉換
                r = lerp(from.r, to.targetR, t);
                g = lerp(from.g, to.targetG, t);
                b = lerp(from.b, to.targetB, t);

                brightness = lerp(
                    from.brightness ?? 1.0,
                    to.targetBrightness,
                    t
                );

                alpha = lerp(from.a, to.targetA, t);

            }


            if (alpha <= 0.01) continue;

            // splitMorph 已經是畫面座標，不再重複投影
            let px;
            let py;

            if (mode === "splitMorph") {

                px = x;
                py = y;

            } else {

                const directionX = event.flipX ? -x : x;
                px = centerX + directionX * size;
                py = centerY + y * size;

            }

            const col = Math.floor(px / cw);
            const row = Math.floor(py / ch);

            if (
                col < 0 || col >= cols ||
                row < 0 || row >= rows
            ) continue;

            const id = row * cols + col;

            if (!grid[id] || alpha > grid[id].alpha) {

                grid[id] = {
                    r, g, b, alpha, brightness, fixedColor: p.fixedColor
                };

            }

        }

        // ASCII 字元渲染（完全對齊 script.js 史迪奇演算法）
        ctx.save();
        ctx.font = `${Math.round(ch * 0.98)}px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const id = row * cols + col;
                const p = grid[id];
                if (!p) continue;

                let gx = 0;
                let gy = 0;
                let edge = false;
                let filled = 0; // 8 鄰域中有粒子的數量

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (!dx && !dy) continue;
                        const yy = row + dy;
                        const xx = col + dx;
                        const out =
                            yy < 0 ||
                            yy >= rows ||
                            xx < 0 ||
                            xx >= cols ||
                            !grid[yy * cols + xx];

                        if (out) {
                            gx += dx;
                            gy += dy;
                            if (!dx || !dy) edge = true;
                        } else {
                            filled++;
                        }
                    }
                }

                const hh = (row * 7919 + col * 104729) % 9973;
                let char;
                let lum;

                let thin = false;

                if (edge) {
                    char = SVG_ASCII.outline(gx, gy);

                    // 鄰居越少 = 線條越細 → 亮度越接近 1.0
                    // 鄰居滿 8 個（粗圖形邊緣）→ 維持 0.5
                    const thickness = filled / 8;
                    thin = filled <= 4;
                    lum = p.fixedColor ? 1.0 : lerp(1.0, 0.5, thickness);
                } else {
                    lum = 1.0;
                    const lv = 3;
                    const pool = SVG_ASCII.pools[lv];
                    char = pool[((hh + ti + (hh % 11)) % 12) % pool.length];
                }

                let finalLum =
                    lum *
                    SVG_FX_STYLE.globalBrightness *
                    p.brightness *
                    clamp(p.alpha, 0, 1);

                // 細線條不讓亮度低於下限（略過素材本身的低 brightness，例如 scorpio 的 0.5）
                if (thin) {
                    finalLum = Math.max(finalLum, SVG_FX_STYLE.thinEdgeMinLum * clamp(p.alpha, 0, 1));
                }

                ctx.globalAlpha = 1;
                ctx.fillStyle = `rgb(${(p.r * finalLum) | 0},${(p.g * finalLum) | 0},${(p.b * finalLum) | 0})`;
                ctx.fillText(
                    char,
                    col * cw + cw / 2,
                    row * ch + ch / 2
                );
            }
        }

        ctx.restore();

    }


    // 動畫效果

    // 組裝
    drawAssemble(frame, event, progress) {

        if (!frame) return;

        this.drawParticles(
            frame.particles,
            event,
            {
                progress,
                mode: "assemble"
            }
        );

    }

    // 逐格動畫
    drawFrame(frame, event) {

        if (!frame) return;

        this.drawParticles(
            frame.particles,
            event,
            {
                mode: "normal"
            }
        );

    }

    // 變形
    drawMorph(fromFrame, toFrame, event, progress) {

        if (!fromFrame || !toFrame) return;

        this.drawParticles(
            fromFrame.particles,
            event,
            {
                progress,
                mode: "morph",
                from: fromFrame.particles,
                to: toFrame.particles
            }
        );

    }

    // 消散
    drawDissolve(fromFrame, toFrame, event, progress) {

        if (fromFrame) {

            this.drawParticles(
                fromFrame.particles,
                event,
                {
                    progress,
                    mode: "scatter"
                }
            );

        }

        if (toFrame) {

            this.drawParticles(
                toFrame.particles,
                event,
                {
                    progress,
                    mode: "assemble"
                }
            );

        }

    }

    // 執行事件
    playEvent(event, time) {

        const localTime = time - event.start;

        const progress = clamp(
            localTime / event.duration,
            0,
            1
        );

        if (event.effect === "assemble") {

            const frame = this.getShape(
                event.target
            );

            this.drawAssemble(
                frame,
                event,
                progress
            );

        } else if (event.effect === "frame") {

            const frames = this.assets[event.target];

            if (!frames || frames.length === 0) {
                return;
            }

            const fps = event.fps || 8;

            const frameIndex = Math.floor(
                localTime * fps
            ) % frames.length;

            const frame = frames[frameIndex];

            this.drawFrame(
                frame,
                event
            );

        } else if (event.effect === "morph") {

            const from = this.getShape(event.from);
            const to = this.getShape(event.to);

            this.drawMorph(
                from,
                to,
                event,
                progress
            );

        } else if (event.effect === "dissolve") {

            const from = this.getShape(event.from);
            const to = this.getShape(event.to);

            this.drawDissolve(
                from,
                to,
                event,
                progress
            );

        } else if (event.effect === "hold") {

            const frame = this.getShape(
                event.target
            );

            if (!frame) {
                return;
            }

            this.drawFrame(
                frame,
                event
            );

        } else if (event.effect === "splitMorph") {

            // 取得起始圖案
            const fromFrame = this.getShape(event.from);

            if (!fromFrame || !fromFrame.particles.length) {
                return;
            }

            // 快取目標粒子，避免每一幀重新分配
            if (!event._splitTargets) {
                event._splitTargets = this.createSplitTargets(
                    event.targets,
                    fromFrame.particles.length
                );
            }

            const targets = event._splitTargets;

            if (!targets.length) {
                return;
            }

            this.drawParticles(
                fromFrame.particles,
                event,
                {
                    mode: "splitMorph",
                    progress,

                    from: fromFrame.particles,
                    to: targets
                }
            );

        }

    }

    // 時間軸渲染
    renderAt(time) {

        if (!this.ready) return;

        const now = performance.now();

        const interval = 1000 / SVG_FX.maxFPS;

        if (
            this.lastRender &&
            now - this.lastRender < interval
        ) {

            return;

        }

        this.lastRender = now;

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        for (const event of SVG_FX_TIMELINE) {

            const end =
                event.start + event.duration;

            // 使用小於，避免前一個事件在交界時重複繪製
            if (
                time >= event.start &&
                time < end
            ) {

                this.playEvent(
                    event,
                    time
                );

            }

        }

    }


    // 清理
    destroy() {

        window.removeEventListener(
            "resize",
            this.resizeHandler
        );

        this.assets = {};

        this.ready = false;

    }

}


// 初始化
window.SVGParticleSystem = SVGParticleSystem;

async function initSVGFX() {

    const canvas = document.getElementById("svgFx");

    if (!canvas) {

        console.warn(
            "[SVG FX] 找不到 svgFx canvas"
        );

        return;

    }

    try {

        const system = new window.SVGParticleSystem(
            canvas
        );

        window.svgFx = system;

        await system.loadAssets();

        const time = window.getBirthdayTime
            ? window.getBirthdayTime()
            : 0;

        system.renderAt(time);

        console.log(
            "[SVG FX] 統一粒子繪製版本初始化完成"
        );

    } catch (error) {

        console.error(
            "[SVG FX] 初始化失敗",
            error
        );

    }

}

initSVGFX();
