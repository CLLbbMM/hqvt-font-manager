class FontManager {
    constructor(fonts = []) {
        this.registeredFonts = new Map();

        // 如果提供了字体配置，则初始化
        if (fonts.length > 0) {
            this.initializeFonts(fonts);
        }
    }

    /**
     * 初始化字体列表
     * @param {Array} fonts - 字体配置数组
     * 示例: [
     *   { name: 'MyFont', url: '/fonts/MyFont.woff2', type: 'chinese', format: 'woff2' },
     *   { name: 'Arial', url: '/fonts/Arial.ttf', type: 'english', format: 'truetype' }
     * ]
     */
    initializeFonts(fonts) {
        fonts.forEach(font => {
            this.registerFont(font.name, font);
        });
    }

    /**
     * 注册单个字体
     * @param {string} fontName - 字体名称
     * @param {Object} fontInfo - 字体信息
     */
    registerFont(fontName, fontInfo) {
        const {
            url,
            type = 'unknown',
            format = this.detectFormat(url),
            weight = 'normal',
            style = 'normal',
            display = 'swap'
        } = fontInfo;

        if (!url) {
            throw new Error(`字体 "${fontName}" 缺少 URL 参数`);
        }

        this.registeredFonts.set(fontName, {
            url,
            type,
            format,
            weight,
            style,
            display
        });
    }

    /**
     * 从URL推断字体格式
     * @param {string} url - 字体文件URL
     * @returns {string} 字体格式
     */
    detectFormat(url) {
        const extension = url.split('.').pop().toLowerCase();
        const formatMap = {
            'woff2': 'woff2',
            'woff': 'woff',
            'ttf': 'truetype',
            'otf': 'opentype',
            'eot': 'embedded-opentype',
            'svg': 'svg'
        };
        return formatMap[extension] || 'truetype';
    }

    /**
     * 批量注册字体
     * @param {Array} fonts - 字体配置数组
     */
    registerFonts(fonts) {
        fonts.forEach(font => {
            this.registerFont(font.name, font);
        });
    }

    /**
     * 移除字体
     * @param {string} fontName - 字体名称
     */
    unregisterFont(fontName) {
        return this.registeredFonts.delete(fontName);
    }

    /**
     * 获取所有可用字体名称
     * @returns {Array} 字体名称数组
     */
    getAvailableFonts() {
        return Array.from(this.registeredFonts.keys());
    }

    /**
     * 获取字体信息
     * @param {string} fontName - 字体名称
     * @returns {Object|undefined} 字体信息对象
     */
    getFontInfo(fontName) {
        return this.registeredFonts.get(fontName);
    }

    /**
     * 根据类型获取字体
     * @param {string} type - 字体类型 (chinese, english, etc.)
     * @returns {Array} 匹配类型的字体名称数组
     */
    getFontsByType(type) {
        return Array.from(this.registeredFonts.entries())
            .filter(([, info]) => info.type === type)
            .map(([name]) => name);
    }

    /**
     * 生成单个字体的CSS @font-face 规则
     * @param {string} fontName - 字体名称
     * @param {Object} options - 选项 (可覆盖字体默认设置)
     * @returns {string} CSS @font-face 规则
     */
    generateFontCSS(fontName, options = {}) {
        const fontInfo = this.getFontInfo(fontName);
        if (!fontInfo) {
            throw new Error(`字体未找到: ${fontName}`);
        }

        const {
            fontWeight = fontInfo.weight,
            fontStyle = fontInfo.style,
            fontDisplay = fontInfo.display,
            fontFamily = fontName.replace(/[^a-zA-Z0-9\-_\u4e00-\u9fff]/g, '')
        } = options;

        return `@font-face {
  font-family: '${fontFamily}';
  src: url('${fontInfo.url}') format('${fontInfo.format}');
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  font-display: ${fontDisplay};
}`;
    }

    /**
     * 生成多个字体的CSS规则
     * @param {string|Array} fontNames - 字体名称或字体名称数组
     * @param {Object} options - 选项
     * @returns {string} 完整的CSS字符串
     */
    generateCSSFile(fontNames, options = {}) {
        if (!Array.isArray(fontNames)) {
            fontNames = [fontNames];
        }

        const cssRules = [];
        fontNames.forEach(fontName => {
            try {
                cssRules.push(this.generateFontCSS(fontName, options));
            } catch (error) {
                console.warn(`警告: ${error.message}`);
            }
        });

        return cssRules.join('\n\n');
    }

    /**
     * 将CSS规则插入到页面中
     * @param {string|Array} fontNames - 字体名称或字体名称数组
     * @param {Object} options - 选项
     * @returns {HTMLStyleElement} 创建的style元素
     */
    injectCSS(fontNames, options = {}) {
        if (typeof document === 'undefined') {
            throw new Error('injectCSS 只能在浏览器环境中使用');
        }

        const css = this.generateCSSFile(fontNames, options);
        const styleElement = document.createElement('style');
        styleElement.textContent = css;

        // 添加标识符以便后续管理
        const id = options.id || `font-manager-${Date.now()}`;
        styleElement.setAttribute('id', id);
        styleElement.setAttribute('data-font-manager', 'true');

        document.head.appendChild(styleElement);
        return styleElement;
    }

    /**
     * 移除之前注入的CSS
     * @param {string} id - style元素的ID
     */
    removeInjectedCSS(id) {
        if (typeof document === 'undefined') {
            throw new Error('removeInjectedCSS 只能在浏览器环境中使用');
        }

        const element = document.getElementById(id);
        if (element && element.getAttribute('data-font-manager') === 'true') {
            element.remove();
            return true;
        }
        return false;
    }

    /**
     * 清除所有由FontManager注入的CSS
     */
    clearAllInjectedCSS() {
        if (typeof document === 'undefined') {
            throw new Error('clearAllInjectedCSS 只能在浏览器环境中使用');
        }

        const elements = document.querySelectorAll('style[data-font-manager="true"]');
        elements.forEach(element => element.remove());
        return elements.length;
    }

    /**
     * 预加载字体文件
     * @param {string|Array} fontNames - 字体名称或字体名称数组
     * @returns {Promise<Array>} 预加载结果的Promise数组
     */
    async preloadFonts(fontNames) {
        if (typeof document === 'undefined') {
            throw new Error('preloadFonts 只能在浏览器环境中使用');
        }

        if (!Array.isArray(fontNames)) {
            fontNames = [fontNames];
        }

        const preloadPromises = fontNames.map(fontName => {
            const fontInfo = this.getFontInfo(fontName);
            if (!fontInfo) {
                return Promise.reject(new Error(`字体未找到: ${fontName}`));
            }

            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'font';
                link.type = `font/${fontInfo.format}`;
                link.href = fontInfo.url;
                link.crossOrigin = 'anonymous';

                link.onload = () => resolve(fontName);
                link.onerror = () => reject(new Error(`预加载字体失败: ${fontName}`));

                document.head.appendChild(link);
            });
        });

        return Promise.allSettled(preloadPromises);
    }

    /**
     * 检查字体是否已加载
     * @param {string} fontName - 字体名称
     * @param {string} testText - 测试文本
     * @returns {Promise<boolean>} 字体是否已加载
     */
    async isFontLoaded(fontName, testText = 'Test') {
        if (typeof document === 'undefined') {
            return false;
        }

        const fontInfo = this.getFontInfo(fontName);
        if (!fontInfo) {
            return false;
        }

        try {
            const font = new FontFace(fontName, `url(${fontInfo.url})`);
            await font.load();
            return document.fonts.check(`12px "${fontName}"`, testText);
        } catch (error) {
            console.warn(`检查字体加载状态失败: ${fontName}`, error);
            return false;
        }
    }
}

// 创建默认实例
const fontManager = new FontManager();

// 导出模块 - 支持 CommonJS 和 ES Modules
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = {
        FontManager,
        fontManager,
        getAvailableFonts: () => fontManager.getAvailableFonts(),
        getFontInfo: (fontName) => fontManager.getFontInfo(fontName),
        registerFont: (fontName, fontInfo) => fontManager.registerFont(fontName, fontInfo),
        generateFontCSS: (fontName, options) => fontManager.generateFontCSS(fontName, options),
        generateCSSFile: (fontNames, options) => fontManager.generateCSSFile(fontNames, options),
        injectCSS: (fontNames, options) => fontManager.injectCSS(fontNames, options)
    };
} else if (typeof window !== 'undefined') {
    // 浏览器环境
    window.FontManager = FontManager;
    window.fontManager = fontManager;
}

// ES Modules 导出 (如果支持)
if (typeof exports !== 'undefined') {
    exports.FontManager = FontManager;
    exports.fontManager = fontManager;
}
