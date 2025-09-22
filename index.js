const fs = require('fs');
const path = require('path');

class FontManager {
  constructor() {
    this.fontsPath = path.join(__dirname, 'fonts');
    this.registeredFonts = new Map();
    this.loadAvailableFonts();
  }

  loadAvailableFonts() {
    const chineseFontsPath = path.join(this.fontsPath, 'chineseFint');
    const englishFontsPath = path.join(this.fontsPath, 'englishFonts');

    if (fs.existsSync(chineseFontsPath)) {
      const chineseFonts = fs.readdirSync(chineseFontsPath);
      chineseFonts.forEach(fontFile => {
        if (fontFile.endsWith('.otf') || fontFile.endsWith('.ttf')) {
          const fontName = fontFile.replace(/\.(otf|ttf)$/i, '');
          this.registeredFonts.set(fontName, {
            path: path.join(chineseFontsPath, fontFile),
            type: 'chinese',
            fileName: fontFile
          });
        }
      });
    }

    if (fs.existsSync(englishFontsPath)) {
      const englishFonts = fs.readdirSync(englishFontsPath);
      englishFonts.forEach(fontFile => {
        if (fontFile.endsWith('.otf') || fontFile.endsWith('.ttf')) {
          const fontName = fontFile.replace(/\.(otf|ttf)$/i, '');
          this.registeredFonts.set(fontName, {
            path: path.join(englishFontsPath, fontFile),
            type: 'english',
            fileName: fontFile
          });
        }
      });
    }
  }

  getAvailableFonts() {
    return Array.from(this.registeredFonts.keys());
  }

  getFontInfo(fontName) {
    return this.registeredFonts.get(fontName);
  }

  generateFontCSS(fontName, options = {}) {
    const fontInfo = this.getFontInfo(fontName);
    if (!fontInfo) {
      throw new Error('Font not found: ' + fontName);
    }

    const {
      fontWeight = 'normal',
      fontStyle = 'normal',
      fontDisplay = 'swap'
    } = options;

    const fontFamily = fontName.replace(/[^a-zA-Z0-9\-_]/g, '');
    
    return '@font-face {\n  font-family: \'' + fontFamily + '\';\n  src: url(\'' + fontInfo.path + '\') format(\'' + (fontInfo.fileName.endsWith('.otf') ? 'opentype' : 'truetype') + '\');\n  font-weight: ' + fontWeight + ';\n  font-style: ' + fontStyle + ';\n  font-display: ' + fontDisplay + ';\n}';
  }

  generateCSSFile(fontNames, options = {}) {
    if (!Array.isArray(fontNames)) {
      fontNames = [fontNames];
    }

    let css = '';
    fontNames.forEach(fontName => {
      try {
        css += this.generateFontCSS(fontName, options);
        css += '\n\n';
      } catch (error) {
        console.warn('Warning: ' + error.message);
      }
    });

    return css.trim();
  }

  writeCSSFile(fontNames, outputPath, options = {}) {
    const css = this.generateCSSFile(fontNames, options);
    fs.writeFileSync(outputPath, css, 'utf8');
    console.log('CSS file generated: ' + outputPath);
  }
}

const fontManager = new FontManager();

module.exports = {
  FontManager,
  fontManager,
  getAvailableFonts: () => fontManager.getAvailableFonts(),
  getFontInfo: (fontName) => fontManager.getFontInfo(fontName),
  generateFontCSS: (fontName, options) => fontManager.generateFontCSS(fontName, options),
  generateCSSFile: (fontNames, options) => fontManager.generateCSSFile(fontNames, options),
  writeCSSFile: (fontNames, outputPath, options) => fontManager.writeCSSFile(fontNames, outputPath, options)
};
