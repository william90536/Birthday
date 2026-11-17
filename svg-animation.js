//SVG PARTICLE SYSTEM

// 基本設定
const SVG_FX = {
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
            30
        ),
        step: 1

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
        scale: 1.2
    },

    {
        start: 14.0,
        duration: 5.0,

        effect: "frame",
        target: "stitch",

        fps: 5,

        x: 0.5,
        y: 0.57,
        scale: 1.2
    },

    {
        start: 19.0,
        duration: 2.0,

        effect: "splitMorph",
        from: "stitch",

        x: 0.5,
        y: 0.57,
        scale: 1.2,

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
                name: "cat1",
                x: 0.90,
                y: 0.90,
                scale: 0.6,
                flipX: true
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
        target: "cat1",

        fps: 10,
        x: 0.90,
        y: 0.90,
        scale: 0.6
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
        duration: 13,

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
                name: "cat",
                x: 0.1,
                y: 0.83,
                scale: 0.4,
                flipX: true
            }
        ]
    },

    {
        start: 35.0,
        duration: 0.7,
        effect: "splitMorph",

        from: "cat1",
        x: 0.90,
        y: 0.90,
        scale: 0.6,

        targets: [
            {
                name: "stitch2",
                x: 0.85,
                y: 0.30,
                scale: 0.7,
                flipX: true
            }
        ]
    },

    {
        start: 35.7,
        duration: 4.3,

        effect: "frame",
        target: "cat",

        fps: 10,

        x: 0.1,
        y: 0.83,
        scale: 0.4,
        flipX: true
    },

    {
        start: 35.7,
        duration: 4.3,

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
        const size = SVG_FX.sampleSize;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const fitScale = Math.min(480 / img.width, 480 / img.height);
        const w = img.width * fitScale;
        const h = img.height * fitScale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

        const data = ctx.getImageData(0, 0, size, size).data;
        const fixed = forcedColor ? hexToRgb(forcedColor) : null;

        const maxN = Math.ceil(size / step) ** 2;
        const xs = new Float32Array(maxN);
        const ys = new Float32Array(maxN);
        const rgb = new Uint8Array(maxN * 3);
        let n = 0;

        for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
                const idx = (y * size + x) * 4;
                if (data[idx + 3] < 100) continue;

                xs[n] = (x - size / 2) / size;
                ys[n] = (y - size / 2) / size;
                rgb[n * 3] = fixed ? fixed.r : data[idx];
                rgb[n * 3 + 1] = fixed ? fixed.g : data[idx + 1];
                rgb[n * 3 + 2] = fixed ? fixed.b : data[idx + 2];
                n++;
            }
        }

        if (n === 0) throw new Error("SVG 沒有可見內容");

        // slice 會複製成剛好大小，大緩衝區就能被回收
        return {
            count: n,
            x: xs.slice(0, n),
            y: ys.slice(0, n),
            rgb: rgb.slice(0, n * 3),
            brightness: forcedBrightness ?? 1.0,   // 每張共用一個值，不必每粒子存
            fixedColor: !!fixed
        };
    }

    // 載入所有素材
    updateLoading(loaded, total) {
        const pct = total ? Math.round(loaded / total * 100) : 100;
        const fill = document.getElementById("loadFill");
        const label = document.getElementById("loadPct");
        if (fill) fill.style.width = pct + "%";
        if (label) label.textContent = `${loaded} / ${total}（${pct}%）`;
    }

    async loadAssets() {
        let total = 0;
        for (const c of Object.values(SVG_FX_ASSETS)) {
            total += c.frames ? c.frames.length : c.svg ? 1 : 0;
        }
        let loaded = 0;
        this.updateLoading(0, total);

        for (const [name, config] of Object.entries(SVG_FX_ASSETS)) {
            this.assets[name] = [];
            const sources = config.frames ? config.frames : config.svg ? [config.svg] : [];

            for (let i = 0; i < sources.length; i++) {
                try {
                    const frame = await this.sampleSVG(
                        sources[i], config.color, config.brightness, config.step
                    );
                    this.assets[name].push(frame);
                } catch (error) {
                    console.error(`[SVG FX] ${name} 第 ${i} 張載入失敗`, error);
                }

                loaded++;
                this.updateLoading(loaded, total);

                if (i % 2 === 1) await new Promise(r => setTimeout(r, 0));
            }
        }

        await this.loadDirectImages();

        for (const ev of SVG_FX_TIMELINE) {
            if (ev.effect !== "splitMorph") continue;
            const from = this.getShape(ev.from);
            if (from) ev._splitTargets = this.createSplitTargets(ev.targets, from.count);
        }

        this.ready = true;
        console.log("[SVG FX] 素材載入完成");
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
            if (!frame || !frame.count) {
                console.warn(`[SVG FX] 找不到目標：${config.name}`);
                return null;
            }
            return {
                frame,
                x: config.x ?? 0.5,
                y: config.y ?? 0.5,
                scale: config.scale ?? 0.3,
                flip: !!config.flipX
            };
        }).filter(Boolean);

        if (!targets.length) return null;

        const idx = new Uint8Array(count);
        const tx = new Float32Array(count);
        const ty = new Float32Array(count);
        const rgb = new Uint8Array(count * 3);
        const br = new Float32Array(count);

        const groupCount = Math.ceil(count / targets.length);

        for (let i = 0; i < count; i++) {
            const ti = i % targets.length;
            const t = targets[ti];
            const groupIndex = Math.floor(i / targets.length);
            const local = Math.min(
                Math.floor(groupIndex / groupCount * t.frame.count),
                t.frame.count - 1
            );

            idx[i] = ti;
            tx[i] = t.frame.x[local];
            ty[i] = t.frame.y[local];
            rgb[i * 3] = t.frame.rgb[local * 3];
            rgb[i * 3 + 1] = t.frame.rgb[local * 3 + 1];
            rgb[i * 3 + 2] = t.frame.rgb[local * 3 + 2];
            br[i] = t.frame.brightness;
        }

        return {
            count, idx, x: tx, y: ty, rgb, br,
            table: targets.map(t => ({ x: t.x, y: t.y, scale: t.scale, flip: t.flip }))
        };
    }

    _getGrid(n) {
        if (!this._grid || this._grid.n !== n) {
            this._grid = {
                n,
                a: new Float32Array(n),
                r: new Float32Array(n),
                g: new Float32Array(n),
                b: new Float32Array(n),
                br: new Float32Array(n),
                fix: new Uint8Array(n)
            };
        }
        return this._grid;
    }

    drawParticles(frame, event, options = {}) {
        if (!frame || !frame.count) return;

        const ctx = this.ctx;
        const centerX = this.width * (event.x ?? 0.5);
        const centerY = this.height * (event.y ?? 0.5);
        const minSize = Math.min(this.width, this.height);
        const size = minSize * (event.scale || 1);

        const progress = options.progress ?? 1;
        const mode = options.mode || "normal";
        const from = options.from || null;
        const to = options.to || null;
        const amount = easeInOut(progress);

        let total = frame.count;
        if (mode === "morph" && to) total = Math.max(from.count, to.count);

        const cols = window.innerWidth < 768 ? 110 : 260;
        const cw = this.width / cols;
        const ch = cw * (14 / 9);
        const rows = Math.floor(this.height / ch);

        const G = this._getGrid(rows * cols);
        G.a.fill(0);

        const ti = Math.floor((window.getBirthdayTime?.() || 0) * 4);

        const fx = frame.x, fy = frame.y, frgb = frame.rgb;
        const baseBr = frame.brightness;
        const fixed = frame.fixedColor ? 1 : 0;

        for (let i = 0; i < total; i++) {
            const pi = Math.min(i, frame.count - 1);

            let x = fx[pi], y = fy[pi];
            let r = frgb[pi * 3], g = frgb[pi * 3 + 1], b = frgb[pi * 3 + 2];
            let alpha = 1;
            let brightness = baseBr;
            let screen = false;

            if (mode === "assemble") {
                const rnd = ((i * 2654435761) >>> 0) / 4294967296;
                const delay = rnd * 0.5;
                const lp = clamp((progress - delay) / (1 - delay), 0, 1);
                const reveal = easeOut(lp);
                const angle = rnd * 6.2832 * 7;
                const spread = (1 - reveal) * 0.08;
                x += Math.cos(angle) * spread;
                y += Math.sin(angle) * spread;
                alpha *= 0.15 + 0.85 * reveal;

            } else if (mode === "morph") {
                const fi = Math.floor(i / total * from.count);
                const tj = Math.floor(i / total * to.count);
                x = lerp(from.x[fi], to.x[tj], amount);
                y = lerp(from.y[fi], to.y[tj], amount);
                r = lerp(from.rgb[fi * 3], to.rgb[tj * 3], amount);
                g = lerp(from.rgb[fi * 3 + 1], to.rgb[tj * 3 + 1], amount);
                b = lerp(from.rgb[fi * 3 + 2], to.rgb[tj * 3 + 2], amount);
                brightness = lerp(from.brightness, to.brightness, amount);

            } else if (mode === "scatter") {
                const angle = i * 2.399;
                const distance = progress * 1.1;
                x += Math.cos(angle) * distance;
                y += Math.sin(angle) * distance;
                alpha *= 1 - progress;

            } else if (mode === "splitMorph") {
                const tab = to.table[to.idx[i]];

                const startX = centerX + x * size;
                const startY = centerY + y * size;
                const endX = this.width * tab.x +
                    (tab.flip ? -to.x[i] : to.x[i]) * minSize * tab.scale;
                const endY = this.height * tab.y + to.y[i] * minSize * tab.scale;

                const t = amount;
                x = lerp(startX, endX, t);
                y = lerp(startY, endY, t);
                r = lerp(r, to.rgb[i * 3], t);
                g = lerp(g, to.rgb[i * 3 + 1], t);
                b = lerp(b, to.rgb[i * 3 + 2], t);
                brightness = lerp(baseBr, to.br[i], t);
                screen = true;
            }

            if (alpha <= 0.01) continue;

            let px, py;
            if (screen) {
                px = x; py = y;
            } else {
                px = centerX + (event.flipX ? -x : x) * size;
                py = centerY + y * size;
            }

            const col = Math.floor(px / cw);
            const row = Math.floor(py / ch);
            if (col < 0 || col >= cols || row < 0 || row >= rows) continue;

            const id = row * cols + col;
            if (alpha > G.a[id]) {
                G.a[id] = alpha;
                G.r[id] = r; G.g[id] = g; G.b[id] = b;
                G.br[id] = brightness;
                G.fix[id] = fixed;
            }
        }

        // ASCII 字元渲染
        ctx.save();
        ctx.font = `${Math.round(ch * 0.98)}px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const id = row * cols + col;
                const a = G.a[id];
                if (a <= 0) continue;

                let gx = 0, gy = 0, edge = false, filled = 0;

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (!dx && !dy) continue;
                        const yy = row + dy, xx = col + dx;
                        const out = yy < 0 || yy >= rows || xx < 0 || xx >= cols ||
                            G.a[yy * cols + xx] <= 0;
                        if (out) {
                            gx += dx; gy += dy;
                            if (!dx || !dy) edge = true;
                        } else {
                            filled++;
                        }
                    }
                }

                const hh = (row * 7919 + col * 104729) % 9973;
                const isFixed = G.fix[id] === 1;
                let char, lum, thin = false;

                if (edge) {
                    char = SVG_ASCII.outline(gx, gy);
                    thin = filled <= 4;
                    lum = isFixed ? 1.0 : lerp(1.0, 0.5, filled / 8);
                } else {
                    lum = 1.0;
                    const pool = SVG_ASCII.pools[3];
                    char = pool[((hh + ti + (hh % 11)) % 12) % pool.length];
                }

                const ca = clamp(a, 0, 1);
                let finalLum = lum * SVG_FX_STYLE.globalBrightness * G.br[id] * ca;
                if (thin) finalLum = Math.max(finalLum, SVG_FX_STYLE.thinEdgeMinLum * ca);

                ctx.fillStyle =
                    `rgb(${(G.r[id] * finalLum) | 0},${(G.g[id] * finalLum) | 0},${(G.b[id] * finalLum) | 0})`;
                ctx.fillText(char, col * cw + cw / 2, row * ch + ch / 2);
            }
        }

        ctx.restore();
    }

    // 動畫效果
    // 組裝
    drawAssemble(frame, event, progress) {
        if (!frame) return;
        this.drawParticles(frame, event, { progress, mode: "assemble" });
    }

    // 逐格動畫
    drawFrame(frame, event) {
        if (!frame) return;
        this.drawParticles(frame, event, { mode: "normal" });
    }

    // 變形
    drawMorph(fromFrame, toFrame, event, progress) {
        if (!fromFrame || !toFrame) return;
        this.drawParticles(fromFrame, event, {
            progress, mode: "morph", from: fromFrame, to: toFrame
        });
    }

    // 消散
    drawDissolve(fromFrame, toFrame, event, progress) {
        if (fromFrame) this.drawParticles(fromFrame, event, { progress, mode: "scatter" });
        if (toFrame) this.drawParticles(toFrame, event, { progress, mode: "assemble" });
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
            const fromFrame = this.getShape(event.from);
            if (!fromFrame || !fromFrame.count) return;

            if (event._splitTargets === undefined) {
                event._splitTargets = this.createSplitTargets(event.targets, fromFrame.count);
            }
            if (!event._splitTargets) return;

            this.drawParticles(fromFrame, event, {
                mode: "splitMorph",
                progress,
                to: event._splitTargets
            });
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
        console.warn("[SVG FX] 找不到 svgFx canvas");
        window.__resolveSvgFx?.();
        return;
    }

    try {
        const system = new window.SVGParticleSystem(canvas);
        window.svgFx = system;
        await system.loadAssets();
        system.renderAt(0);
    } catch (error) {
        console.error("[SVG FX] 初始化失敗", error);
    } finally {
        const el = document.getElementById("loading");
        if (el) {
            el.classList.add("done");
            setTimeout(() => el.remove(), 700);
        }
        window.__resolveSvgFx?.();   // 無論成功失敗都要放行，否則會永遠卡在載入畫面
    }
}

initSVGFX();

initSVGFX();
