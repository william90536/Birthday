window.svgFxReady = new Promise(resolve => {
    window.__resolveSvgFx = resolve;
});
// 設定區
const CFG = {
    loop: 40, // 長度（s）
    build: 3.4, // 蛋糕組裝完成時間

    // at 出現秒數 row 垂直位置 color 顏色編號
    words: [
        // 生日文字(到12s)
        { text: "HAPPY", at: 7.65, row: 0.10, color: [14] },
        { text: "BIRTHDAY", at: 8.25, row: 0.21, color: [14] },
        // (12s~19s)
        { text: "祝妳生日快樂！", at: 12, row: 0.15, color: [28] },
        // (20s~23.5s)
        { text: "又長大一歲了！", at: 20, row: 0.38, color: [28] },
        // 結尾生日祝福(30s~35s)
        { text: "生日快樂！", at: 27, row: 0.25, color: [28] },
        { text: "祝妳新的一歲每天都開心", at: 28, row: 0.39, color: [14] },
        { text: "少一點煩惱", at: 29, row: 0.51, color: [28] },
        { text: "課業和想做的事情都能順順利利", at: 30, row: 0.63, color: [14] },
        //(到結束)
        { text: "HAPPY", at: 35, row: 0.40, color: [14, 16], size: 1.5 },
        { text: "BIRTHDAY", at: 36, row: 0.64, color: [14, 16], size: 1.5 },
    ],

};

//主程式物件淡出時間
const OBJECT_TIMELINE = {
    cake: 12.0,
    plate: 12.0,
    candle: 12.0,
    sprinkles: 12.0,
    decorations: 12.0,
    flame: 12.0,
    sparkles: 11.5,
    confetti: 12.0,
    words: 30.0
};

// 顏色表
const COLORS = [
    [236, 160, 52], [150, 84, 36], [255, 250, 238], [255, 246, 232], // 0海綿 1邊 2奶油 3糖霜
    [240, 50, 70], [255, 140, 150], [232, 222, 206], [228, 176, 84], // 4蠟燭 5蠟燭亮 6盤 7金
    [255, 250, 228], [255, 158, 52], [255, 184, 96], [90, 70, 60],  // 8焰心 9火焰 10光暈 11燭芯
    [255, 184, 72], [255, 226, 168], [255, 212, 138], [255, 176, 204], // 12亮海綿 13亮糖霜 14字 15(備用)
    [255, 96, 160], [70, 160, 255], [60, 200, 110], [255, 214, 50], [255, 128, 40], [245, 245, 255], // 16~21彩紙
    [255, 80, 80], [120, 220, 255], // 22紅 23青

    [255, 175, 210], // 24: 櫻花粉白（溫柔亮眼）
    [150, 225, 255], // 25: 史迪奇冰藍（呼應主題）
    [200, 170, 255], // 26: 夢幻薰衣草紫
    [90, 240, 255], // 27: 亮眼青綠
    [255, 120, 200], // 28: 粉紅桃紅
];

// rnd(): 0~1 亂數, n: 點數，color: 顏色編號或 [r,g,b]
// 座標：x 右、y 上、z 朝向鏡頭；蛋糕中心在 x=1
const SHAPES = [
    { // 愛心
        pos: [-2.6, 2.2, 1.0],
        n: 1600,
        color: 22,
        bob: 0.08,
        gen(r) {
            const t = r() * 6.2832;
            const k = Math.sqrt(r()) * 0.028;
            return [
                16 * Math.pow(Math.sin(t), 3) * k,
                (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k,
                (r() - 0.5) * 0.14
            ];
        }
    },

    { // 五角星
        pos: [3.3, 2.2, 1.0],
        n: 1400,
        color: 19,
        bob: 0.1,
        gen(r) {
            const a = r() * 6.2832;
            const rad = (0.32 + 0.18 * Math.cos(5 * a)) * 1.5 * Math.sqrt(r()) * 0.75;
            return [
                rad * Math.cos(a),
                rad * Math.sin(a),
                (r() - 0.5) * 0.12
            ];
        }
    },

];

// 引擎
const TAU = Math.PI * 2, CW0 = 9, CH0 = 14;
const POOLS = ["1il!;:", "rtfjcvxz=+", "aeoun0{}[]<>", "08B$#&%Q"];
const SP = 0, CR = 1, CRM = 2, FR = 3, RED = 4, REDH = 5, PL = 6, GD = 7, CORE = 8, FL = 9, GLW = 10, WK = 11, LS = 12, LF = 13, HAP = 14;
const DOTS = [16, 17, 18, 19, 20, 21];

const sm = x => {
    x = Math.min(1, Math.max(0, x));
    return x * x * (3 - 2 * x);
};

const rng = s => () => {
    s |= 0;
    s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

//相機
const isDesktop = window.innerWidth >= 768;

const eye = [
    1,
    2.6,
    isDesktop ? 10.5 : 7
];

const tgt = [1, 1.45, 0];
const nrm = v => {
    const l = Math.hypot(...v);
    return v.map(a => a / l);
};
const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
];
const fwd = nrm(tgt.map((a, i) => a - eye[i]));
const right = nrm(cross(fwd, [0, 1, 0]));
const up = cross(right, fwd);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const view = fwd.map(a => -a);
const F = isDesktop ? 2.5 : 2.9; // 動態調整焦距 F（越大物體越小）

// 蛋糕（中心 x=1）
const CX = 1; // 中心 x
const R = 1.15, FT = 0.08, TOP = 0.98, PR = 1.6; // 半徑、糖霜厚、高度、盤子半徑
const CANDLE = [CX, 0, 0]; // 蠟燭

const frosting = (x, z) => {
    const dx = x - CX, r = Math.hypot(dx, z), a = Math.atan2(-z, dx);
    const edge = 0.15 * Math.exp(-(((r - (R - 0.28)) / 0.24) ** 2)) * (0.55 + 0.45 * Math.sin(a * 22 - r * 14));
    const d = Math.hypot(x - CANDLE[0], z - CANDLE[2]);
    const sw = 0.2 * Math.exp(-((d / 0.34) ** 2)) * (0.6 + 0.4 * Math.sin(Math.atan2(z, x - CANDLE[0]) * 3 + d * 30));
    return TOP + 0.04 + edge + sw;
};

const PTS = [];
let WICK_TOP = 0;

(function build() {
    const rnd = rng(7);
    const U = (a, b) => a + (b - a) * rnd();
    const add = (x, y, z, nx, ny, nz, t, k) => PTS.push([x, y, z, nx, ny, nz, t, k]);

    // 側面（海綿/奶油/糖霜）
    for (let i = 0; i < 16000; i++) {
        const a = U(0, TAU), y = U(0, TOP + 0.04), rad = R + FT + 0.025 * Math.sin(a * 40 + y * 9);
        const crust = y < 0.05 || (y > 0.37 && y < 0.42) || (y > 0.56 && y < 0.6) || (y > 0.9 && y < 0.95);
        const cream = y > 0.42 && y < 0.56, frost = y >= 0.95;
        const t = frost ? FR : cream ? CRM : crust ? CR : (rnd() < 0.55 ? FR : SP);
        add(CX + rad * Math.cos(a), y, -rad * Math.sin(a), Math.cos(a), 0, -Math.sin(a), t, t === FR ? 3 : t === CRM ? 2 : 1);
    }

    // 頂面糖霜
    for (let i = 0; i < 14000; i++) {
        const r = (R + FT) * Math.sqrt(rnd()), a = U(0, TAU), x = CX + r * Math.cos(a), z = -r * Math.sin(a), e = 0.01, y = frosting(x, z);
        const n = nrm([-(frosting(x + e, z) - y) / e, 1, -(frosting(x, z + e) - y) / e]);
        add(x, y, z, n[0], n[1], n[2], FR, 3);
    }

    // 蠟燭
    const base = frosting(CANDLE[0], CANDLE[2]) - 0.05;
    for (let i = 0; i < 2500; i++) {
        const a = U(0, TAU), y = U(0, 0.62), c = Math.cos(a), s = Math.sin(a);
        add(CANDLE[0] + 0.075 * c, base + y, CANDLE[2] + 0.075 * s, c, 0, s, Math.sin(a + y * 16) > 0.45 ? REDH : RED, 4);
    }
    for (let i = 0; i < 30; i++) {
        add(CANDLE[0], base + 0.62 + 0.07 * i / 29, CANDLE[2], 0, 0, 1, WK, 4);
    }
    WICK_TOP = base + 0.69;

    // 盤子
    for (let i = 0; i < 9000; i++) {
        const a = U(0, TAU), u = Math.sqrt(rnd()), r = u * (PR + 0.06 * Math.sin(a * 12));
        add(CX + r * Math.cos(a), -0.02 + 0.06 * u ** 4, r * Math.sin(a), 0, 1, 0, u > 0.93 ? GD : PL, 0);
    }
    for (let i = 0; i < 3000; i++) {
        const a = U(0, TAU), y = U(-0.1, 0.04), rim = PR + 0.06 * Math.sin(a * 12);
        add(CX + rim * Math.cos(a), y, rim * Math.sin(a), Math.cos(a), 0, Math.sin(a), GD, 0);
    }

    // 彩色糖粒(頂面/盤子邊)
    for (let i = 0; i < 200; i++) {
        let c;
        if (i < 130) {
            const r = Math.sqrt(U(0.04, (R - 0.06) ** 2)), a = U(0, TAU);
            c = [CX + r * Math.cos(a), 0, -r * Math.sin(a)];
            if (Math.hypot(c[0] - CANDLE[0], c[2] - CANDLE[2]) < 0.14) continue;
            c[1] = frosting(c[0], c[2]) + 0.05;
        } else if (i < 180) {
            const a = U(0, TAU), y = U(0.08, TOP), rad = R + FT + 0.05;
            c = [CX + rad * Math.cos(a), y, -rad * Math.sin(a)];
        } else {
            const a = U(0, TAU), r = U(R + 0.2, PR - 0.12);
            c = [CX + r * Math.cos(a), 0, r * Math.sin(a)];
        }
        const d = nrm([rnd() * 2 - 1, (rnd() * 2 - 1) * 0.3, rnd() * 2 - 1]), col = DOTS[Math.floor(rnd() * 6)];
        for (let j = 0; j < 10; j++) {
            const s = -0.08 + 0.16 * j / 9;
            add(c[0] + s * d[0], c[1] + s * d[1], c[2] + s * d[2], 0, 1, 0, col, 5);
        }
    }
})();

function start() {
    // SVG 載入設定

    const SHAPE_AT = [];
    SHAPES.forEach((sh, si) => {
        const rnd = rng(100 + si);
        SHAPE_AT.push([PTS.length, sh]);

        let col = sh.color;
        if (Array.isArray(col)) {
            COLORS.push(col);
            col = COLORS.length - 1;
        }

        for (let i = 0; i < sh.n; i++) {
            const p = sh.gen(rnd);
            const n = nrm([p[0] || 0.01, p[1], p[2] + 0.3]);

            PTS.push([
                sh.pos[0] + p[0],
                sh.pos[1] + p[1],
                sh.pos[2] + p[2],
                n[0], n[1], n[2],
                col,
                10 + si,
                p[0], p[1], p[2]
            ]);
        }
    });

    const NP = PTS.length;
    const P0 = new Float32Array(NP * 3);
    const N0 = new Float32Array(NP * 3);
    const T0 = new Uint8Array(NP);
    const K0 = new Uint8Array(NP);
    const ORD = new Float32Array(NP);
    const FLY = new Float32Array(NP * 3);
    const GR = new Float32Array(NP);

    (function () {
        const rnd = rng(5);
        PTS.forEach((p, i) => {
            P0.set(p.slice(0, 3), i * 3);
            N0.set(p.slice(3, 6), i * 3);
            T0[i] = p[6];
            K0[i] = p[7];
            ORD[i] = (p[1] + 0.12) / 2.3 + rnd() * 0.1;
            if (rnd() < 1 / 30) {
                for (let j = 0; j < 3; j++) {
                    FLY[i * 3 + j] = (rnd() + rnd() + rnd() - 1.5) * 2.2;
                }
            }
            GR[i] = (T0[i] === SP || T0[i] === CR) ? 0.6 + 0.4 * rnd() : 1;
        });
    })();

    /* ---- 畫布 ---- */
    const cv = document.getElementById("c");
    const gl = document.getElementById("glow");
    const hud = document.getElementById("hud");
    const tm = document.getElementById("tm");
    const ctx = cv.getContext("2d");
    const gctx = gl.getContext("2d");

    let cols, rows, cw, ch, asp, dpr, buf = {};

    function resize() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = innerWidth, h = innerHeight;

        const isMobile = w < 768;
        cols = isMobile ? 240 : 280;
        cw = w / cols;
        ch = cw * (CH0 / CW0);
        rows = Math.floor(h / ch);
        asp = (cols * cw) / (rows * ch);

        for (const c of [cv, gl]) {
            c.width = w * dpr;
            c.height = h * dpr;
        }

        const N = rows * cols;
        buf = {
            part: new Int8Array(N),
            depth: new Float32Array(N),
            lum: new Float32Array(N),
            tag: new Uint8Array(N),
            ch: new Array(N),
            h: new Int32Array(N)
        };

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                buf.h[r * cols + c] = (r * 7919 + c * 104729) % 9973;
            }
        }
        TEXT.clear();
    }

    const TEXT = new Map();
    const off = document.createElement("canvas");
    const small = document.createElement("canvas");

    function cover(text, scale, cy) {
        const key = text + cols + rows + scale.toFixed(2) + cy;
        if (!TEXT.has(key)) {
            off.width = cols * 9;
            off.height = rows * 14;
            small.width = cols;
            small.height = rows;

            const o = off.getContext("2d");
            const s = small.getContext("2d", { willReadFrequently: true });

            o.clearRect(0, 0, off.width, off.height);
            o.fillStyle = "#fff";
            o.textAlign = "center";
            o.textBaseline = "middle";
            o.font = `900 ${Math.round(cols * 9 * 0.07 * scale)}px "Arial Black",Impact,"PingFang TC","Microsoft JhengHei","Noto Sans TC",sans-serif`;

            // 限制文字最大寬度，避免長句超出畫布
            o.fillText(
                text,
                cols * 4.5,
                cy * 14,
                cols * 8.2
            );

            s.clearRect(0, 0, cols, rows);
            s.drawImage(off, 0, 0, cols, rows);

            const d = s.getImageData(0, 0, cols, rows).data;
            const a = new Float32Array(cols * rows);
            for (let i = 0; i < a.length; i++) {
                a[i] = d[i * 4 + 3] / 255;
            }
            TEXT.set(key, a);
            if (TEXT.size > 60) TEXT.delete(TEXT.keys().next().value);
        }
        return TEXT.get(key);
    }

    const pop = p => {
        const c1 = 1.70158, q = p - 1;
        return 1 + (c1 + 1) * q ** 3 + c1 * q * q;
    };

    const flick = t => 0.82 + 0.1 * Math.sin(t * 13) + 0.06 * Math.sin(t * 29 + 1) + 0.04 * Math.sin(t * 47 + 2);

    const outline = (gx, gy) => {
        const ax = Math.abs(gx), ay = Math.abs(gy);
        if (ax + ay === 0) return "+";
        return ax > 2 * ay ? "|" : ay > 2 * ax ? (gy > 0 ? "_" : "-") : (gx * gy > 0 ? "/" : "\\");
    };

    const CRUMB = "o0ae.:o0";
    const key = nrm([-0.5, 0.8, 0.6]), rimL = nrm([0.8, 0.3, -0.5]);
    const hk = nrm(key.map((a, i) => a + view[i]));
    const hr = nrm(rimL.map((a, i) => a + view[i]));

    function frame(t) {
        const { part, depth, lum, tag, ch: chr, h } = buf;
        part.fill(-1);
        depth.fill(99);
        lum.fill(0);
        tag.fill(0);

        const turn = 0.95 + 0.08 * Math.sin(t * 0.5);
        const c = Math.cos(turn), s = Math.sin(turn);
        const head = (t - 0.2) / (CFG.build - 0.2) * 1.25;
        const on = sm((t - 4.4) / 0.8);
        const f = flick(t);
        const grow = sm((t - 4.3) / 0.7);

        const cx0 = CANDLE[0] - 1;
        const tip = [c * cx0 + s * CANDLE[2] + 1, WICK_TOP, -s * cx0 + c * CANDLE[2]];
        const light = [tip[0] + 0.03 * Math.sin(t * 2.3), tip[1] + 0.18, tip[2] + 0.05];
        let count = 0;

        const plot = (x, y, z, l, tg, k) => {
            const rx = x - eye[0], ry = y - eye[1], rz = z - eye[2];
            const X = rx * right[0] + ry * right[1] + rz * right[2];
            const Y = rx * up[0] + ry * up[1] + rz * up[2];
            const Z = rx * fwd[0] + ry * fwd[1] + rz * fwd[2];

            if (Z < 0.2) return;
            const ix = Math.floor((0.5 + X / Z * F * 0.5) * cols);
            const iy = Math.floor((0.5 - Y / Z * F * 0.5 * asp + 0.045) * rows);

            if (ix < 0 || ix >= cols || iy < 0 || iy >= rows) return;
            const id = iy * cols + ix;
            if (Z < depth[id]) {
                depth[id] = Z;
                part[id] = k;
                lum[id] = l;
                tag[id] = tg;
            }
        };

        for (let i = 0; i < NP; i++) {
            const k = K0[i];
            const sh = k >= 10 ? SHAPES[k - 10] : null;

            // 到達指定時間，直接隱藏物件
            if (k === 0 && t >= OBJECT_TIMELINE.plate) continue;

            if (k >= 1 && k <= 3 &&
                t >= OBJECT_TIMELINE.cake) continue;

            if (k === 4 &&
                t >= OBJECT_TIMELINE.candle) continue;

            if (k === 5 &&
                t >= OBJECT_TIMELINE.sprinkles) continue;

            if ((k === 10 || k === 11) &&
                t >= OBJECT_TIMELINE.decorations) continue;

            const rev = sm((head - ORD[i]) / 0.12);
            if (rev < 0.01) continue;

            let px = P0[i * 3] - 1;
            let py = P0[i * 3 + 1];
            let pz = P0[i * 3 + 2];

            if (sh && sh.bob) {
                py += sh.bob * Math.sin(t * 2 + k);
            }

            const x = c * px + s * pz + 1 + (1 - rev) * FLY[i * 3];
            const y = py + (1 - rev) * FLY[i * 3 + 1];
            const z = -s * px + c * pz + (1 - rev) * FLY[i * 3 + 2];

            const n0 = N0[i * 3], n1 = N0[i * 3 + 1], n2 = N0[i * 3 + 2];
            const nx = c * n0 + s * n2;
            const nz = -s * n0 + c * n2;
            const nv = [nx, n1, nz];

            let dissolveAlpha = 1;

            const diff = Math.max(0, dot(nv, key));
            const spec = Math.max(0, dot(nv, hk)) ** 24 + 0.7 * Math.max(0, dot(nv, hr)) ** 18;
            const dx = light[0] - x, dy = light[1] - y, dz = light[2] - z;
            const dist = Math.hypot(dx, dy, dz);
            const glow = on * f * (0.3 + 0.7 * Math.min(1, Math.max(0, (nx * dx + n1 * dy + nz * dz) / dist))) * Math.exp(-((dist / 1.6) ** 2)) * 1.3;
            const l = (0.3 + 0.45 * diff + 0.12 * spec + 0.45 * glow) * rev * GR[i] * (k === 0 ? 0.6 : 1);

            let tg = T0[i];
            if (glow > 0.3) tg = (tg === SP || tg === CR) ? LS : tg === FR ? LF : tg;
            plot(x, y, z, l, tg, k);

        }

        if (grow > 0 && t < OBJECT_TIMELINE.flame) {
            const rnd = rng(3);
            for (let i = 0; i < 900; i++) {
                const u = rnd() * 2 - 1, v = rnd();
                const w = 0.15 * Math.sin(Math.PI * v ** 0.75) * (1 - 0.35 * v);
                const lean = 0.05 * Math.sin(t * 2.3) + 0.02 * Math.sin(t * 7);
                const core = Math.abs(u) < 0.5 && v < 0.62;

                plot(
                    tip[0] + u * w * grow + lean * v * v,
                    tip[1] + (v - 0.12) * 0.6 * f * grow,
                    tip[2] + 0.05,
                    (core ? 1 : 0.82) * (0.6 + 0.4 * grow),
                    core ? CORE : FL,
                    6
                );
            }
        }

        const ch2 = chr;
        const ti = Math.floor(t * 4);

        for (let r = 0; r < rows; r++) {
            for (let q = 0; q < cols; q++) {
                const id = r * cols + q;
                const pk = part[id];
                if (pk < 0) {
                    ch2[id] = " ";
                    continue;
                }
                count++;

                let gx = 0, gy = 0, edge = false;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (!dx && !dy) continue;
                        const yy = r + dy, xx = q + dx;
                        const out = yy < 0 || yy >= rows || xx < 0 || xx >= cols || part[yy * cols + xx] < 0 ||
                            (part[yy * cols + xx] !== pk && depth[yy * cols + xx] > depth[id] + 0.035);
                        if (out) {
                            gx += dx;
                            gy += dy;
                            if (!dx || !dy) edge = true;
                        }
                    }
                }

                const hh = h[id];
                if (edge) {
                    ch2[id] = outline(gx, gy);
                    lum[id] = Math.max(0.5, lum[id]);
                    continue;
                }

                lum[id] = Math.min(1, lum[id]);
                const lv = Math.min(3, Math.max(0, Math.floor(lum[id] * 3.2)));
                const tg = tag[id];
                let chx = POOLS[lv][((hh + ti + hh % 11) % 12) % POOLS[lv].length];

                if (tg === SP || tg === LS) {
                    chx = CRUMB[(hh + Math.floor(t * 2) * (hh % 3 === 0 ? 1 : 0)) % 8];
                } else if (tg === CR || tg === GD) {
                    chx = "=";
                } else if (tg === CRM) {
                    chx = "~";
                    lum[id] = Math.max(lum[id], 0.85);
                } else if (tg === FR || tg === LF) {
                    chx = hh % 5 === 0 ? "^" : "~";
                } else if (tg === PL) {
                    chx = hh % 4 === 0 ? ":" : ".";
                    lum[id] *= 0.8;
                }
                ch2[id] = chx;
            }
        }

        const cy = Math.floor((0.5 - (() => {
            const rx = light[0] - eye[0], ry = light[1] - eye[1], rz = light[2] - eye[2];
            return (rx * up[0] + ry * up[1] + rz * up[2]) / (rx * fwd[0] + ry * fwd[1] + rz * fwd[2]);
        })() * F * 0.5 * asp) * rows);

        const cx = Math.floor((0.5 + (() => {
            const rx = light[0] - eye[0], ry = light[1] - eye[1], rz = light[2] - eye[2];
            return (rx * right[0] + ry * right[1] + rz * right[2]) / (rx * fwd[0] + ry * fwd[1] + rz * fwd[2]);
        })() * F * 0.5) * cols);

        if (on > 0 && t < OBJECT_TIMELINE.flame) {
            const rg = (6 + 1.5 * f) * on;
            for (let r = Math.max(0, cy - 9); r < Math.min(rows, cy + 10); r++) {
                for (let q = Math.max(0, cx - 16); q < Math.min(cols, cx + 17); q++) {
                    const id = r * cols + q;
                    const fall = 1 - Math.hypot(r - cy, (q - cx) * 9 / 14) / rg;
                    if (ch2[id] === " " && fall > 0 && (h[id] + Math.floor(t * 9)) % 3 !== 0) {
                        ch2[id] = fall < 0.4 ? "." : fall < 0.7 ? ":" : "+";
                        lum[id] = 0.6 * fall * on * f;
                        tag[id] = GLW;
                    }
                }
            }
        }

        const put = (y, x, chx, l, tg, only) => {
            if (y < 0 || y >= rows || x < 0 || x >= cols) return false;
            const id = y * cols + x;
            if (only && !(ch2[id] === " " || tag[id] === GLW)) return false;
            ch2[id] = chx;
            lum[id] = l;
            tag[id] = tg;
            return true;
        };

        if (t > 4.3 && t < 5.4) {
            const k = (t - 4.3) / 1.1;
            for (let i = 0; i < 14; i++) {
                const a = i * 2.4 + k * 3;
                put(
                    Math.floor(cy + 2 - k * 7 * (0.6 + 0.4 * (i % 3)) + Math.sin(a) * 2),
                    Math.floor(cx + Math.cos(a) * (2 + k * 9)),
                    i % 2 ? "*" : "+",
                    1 - k,
                    CORE,
                    true
                );
            }
        }

        let pieces = 0;
        if (t > 6.2) {
            const rnd = rng(11);
            const U = (a, b) => a + (b - a) * rnd();
            for (let i = 0; i < 110; i++) {
                const x0 = U(0, cols), sp = U(4, 9), dl = U(0, 5), amp = U(1, 4), w = U(1, 2.5), ph = U(0, TAU);
                const col = DOTS[Math.floor(rnd() * 6)];
                const age = t - 6.2 - dl;
                if (age < 0) continue;

                const y = Math.floor(age * sp % (rows + 4)) - 2;
                const x = Math.floor(x0 + amp * Math.sin(w * t + ph));
                const spin = i % 7 ? "-/|\\"[Math.floor(t * w * 3 + ph) & 3] : "o";

                if (put(y, x, spin, 0.85, col, true)) pieces++;
            }
        }

        const isMobile = innerWidth < 768;
        const normalWdSize = isMobile ? 1.8 : 1;
        for (const wd of CFG.words) {
            if (wd.at < 10 && t >= 12) continue;

            if (wd.at < 15 && t > 19) continue;

            if (wd.at < 21 && t >= 23) continue;

            if (wd.at <= 30 && t >= 35) continue;

            if (wd.at <= 35 && t >= CFG.loop) continue;

            const p = Math.min(1, Math.max(0, (t - wd.at) / 0.8));
            if (p <= 0) continue;

            const cov = cover(
                wd.text,
                (1.55 - 0.55 * pop(p)) * (wd.size ?? 1) * normalWdSize,
                rows * wd.row
            );
            const g = (r, q) => (r < 0 || r >= rows || q < 0 || q >= cols) ? 0 : cov[r * cols + q];

            for (let r = 0; r < rows; r++) {
                for (let q = 0; q < cols; q++) {
                    const id = r * cols + q;
                    if (cov[id] <= 0.45 || (h[id] % 997) / 997 >= sm(p * 1.6)) continue;

                    const u = g(r - 1, q), d = g(r + 1, q), l = g(r, q - 1), rr = g(r, q + 1);
                    const edge = u < 0.45 || d < 0.45 || l < 0.45 || rr < 0.45;

                    ch2[id] = edge ? outline(-(rr - l) * 10, -(d - u) * 10) : POOLS[3][((h[id] + Math.floor(t * 4) + h[id] % 11) % 12) % 8];
                    lum[id] = Math.min(1, (0.8 + 0.2 * Math.sin(t * 3 - q * 0.12)) * (1 + 0.5 * (1 - p)));

                    if (Array.isArray(wd.color)) {
                        const stripeWidth = 12; // 色帶粗細
                        const speed = 3; // 流動速度

                        const pos = Math.floor(((q + r * 2) - t * speed) / stripeWidth); // 斜向座標 (q + r * 2) 
                        const colorIndex = ((pos % wd.color.length) + wd.color.length) % wd.color.length;

                        tag[id] = wd.color[colorIndex];
                    } else {
                        tag[id] = wd.color;
                    }
                }
            }
        }

        if (t > 9.6) {
            const lit = [];
            for (let i = 0; i < rows * cols; i++) {
                if (tag[i] === HAP) lit.push(i);
            }
            for (let n = 0; n < 2 && lit.length; n++) {
                const q = Math.floor(t * 1.3 + n * 0.5);
                const id = lit[(q * 7919 + n * 104729) % lit.length];
                const sy = Math.floor(id / cols), sx = id % cols;
                const reach = Math.floor(2 + 4 * Math.sin(((t * 1.3 + n * 0.5) % 1) * Math.PI));

                for (let d = 1; d <= reach; d++) {
                    const fd = 1 - d / (reach + 1);
                    for (const [dy, dx, cc] of [[0, 1, "-"], [0, -1, "-"], [1, 0, "|"], [-1, 0, "|"]]) {
                        const yy = sy + dy * d, xx = sx + dx * d * 2;
                        if (yy >= 0 && yy < rows && xx >= 0 && xx < cols && lum[yy * cols + xx] < fd) {
                            put(yy, xx, cc, fd, CORE);
                        }
                    }
                    if (d <= reach / 2) {
                        for (const [dy, dx, cc] of [[1, 1, "\\"], [-1, -1, "\\"], [1, -1, "/"], [-1, 1, "/"]]) {
                            const yy = sy + dy * d, xx = sx + dx * d;
                            if (yy >= 0 && yy < rows && xx >= 0 && xx < cols && lum[yy * cols + xx] < fd * 0.7) {
                                put(yy, xx, cc, fd * 0.7, CORE);
                            }
                        }
                    }
                }
                put(sy, sx, "*", 1, CORE);
            }
        }
        return { count, info: `蠟燭 ${on > 0.5 ? "已點燃" : "未點燃"}   火焰 ${(f * on).toFixed(2)}   彩紙 ${pieces}` };
    }

    function draw(t) {
        const { count, info } = frame(t);
        const { ch: chr, lum, tag } = buf;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        ctx.font = `${Math.round(ch * 0.98)}px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let r = 0; r < rows; r++) {
            for (let q = 0; q < cols; q++) {
                const id = r * cols + q;
                const chx = chr[id];
                if (chx === " ") continue;

                const col = COLORS[Math.min(tag[id], COLORS.length - 1)];
                const l = Math.min(1, Math.max(0, lum[id]));
                ctx.fillStyle = `rgb(${col[0] * l | 0},${col[1] * l | 0},${col[2] * l | 0})`;
                ctx.fillText(chx, q * cw + cw / 2, r * ch + ch / 2);
            }
        }

        // 時間進度條
        const barH = 3; // 粗細（px）
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(0, 0, innerWidth, barH); // 底軌
        ctx.fillStyle = "rgb(255,176,204)";
        ctx.fillRect(0, 0, innerWidth * (t / CFG.loop), barH); // 進度

        gctx.clearRect(0, 0, gl.width, gl.height);
        gctx.drawImage(cv, 0, 0);

    }

    let t = 0, paused = false, last = performance.now();

    window.getBirthdayTime = () => t; // 提供動畫時間給 SVG動畫系統

    function loop(now) {
        const dt = Math.min((now - last) / 1000, 1 / 15);
        last = now;
        if (!paused) {
            t = (t + dt) % CFG.loop;
        }
        draw(t);

        if (typeof window.svgFx?.renderAt === "function") {
            window.svgFx.renderAt(t);
        }

        requestAnimationFrame(loop);
    }

    addEventListener("resize", resize);
    addEventListener("keydown", e => {
        if (e.code === "Space") {
            paused = !paused;
            e.preventDefault();
        }
        if (e.key === "r" || e.key === "R") t = 0;
    });
    cv.addEventListener("pointerdown", () => {
        paused = !paused;
    });

    resize();
    window.svgFxReady.then(() => {
        last = performance.now();
        requestAnimationFrame(loop);
    });
}

try {
    start();
} catch (error) {
    console.error("生日動畫初始化失敗：", error);
    window.__resolveSvgFx?.();
}
