# HQVT Font Manager

一个简单易用的字体管理包，支持中英文字体注册和CSS生成。

## 安装

`ash
npm install hqvt-font-manager
`

## 功能特性

- 支持中英文字体管理
- 自动生成CSS字体声明
- 支持多种字体格式（OTF、TTF）
- 简单易用的API

## 快速开始

### 1. 基本使用

`javascript
const { getAvailableFonts, generateFontCSS, writeCSSFile } = require('./index.js');

// 获取可用字体
const fonts = getAvailableFonts();

// 生成单个字体CSS
const css = generateFontCSS('OpenSans-Regular', { fontWeight: 'bold' });

// 生成CSS文件
writeCSSFile(['OpenSans-Regular', 'OpenSans-Bold'], 'output.css');
`

### 2. 获取所有可用字体

`javascript
const { getAvailableFonts } = require('./index.js');

// 获取所有可用字体
const fonts = getAvailableFonts();
console.log('可用字体:', fonts);
// 输出: ['1635950212302373', '1635950212489300', 'OpenSans-Bold', 'OpenSans-Regular', ...]
`

### 3. 生成单个字体CSS

`javascript
const { generateFontCSS } = require('./index.js');

// 生成单个字体的CSS
const css = generateFontCSS('OpenSans-Regular');
console.log(css);
// 输出: @font-face { font-family: 'OpenSans-Regular'; src: url('...') format('truetype'); ... }
`

### 4. 生成CSS文件

`javascript
const { writeCSSFile } = require('./index.js');

// 生成包含多个字体的CSS文件
writeCSSFile(
  ['OpenSans-Regular', 'OpenSans-Bold', '1635950212302373'],
  './fonts.css'
);
`

## API 文档

### 便捷方法

包提供了一些便捷的导出方法，可以直接使用：

`javascript
const {
  getAvailableFonts,
  getFontInfo,
  generateFontCSS,
  generateCSSFile,
  writeCSSFile
} = require('./index.js');
`

### getAvailableFonts()
获取所有可用的字体名称列表。

**返回值:** Array<string> - 字体名称数组

### getFontInfo(fontName)
获取指定字体的详细信息。

**参数:**
- fontName (string): 字体名称

**返回值:** Object - 字体信息对象
`javascript
{
  path: '字体文件路径',
  type: 'chinese' | 'english',
  fileName: '字体文件名'
}
`

### generateFontCSS(fontName, options)
生成单个字体的CSS声明。

**参数:**
- fontName (string): 字体名称
- options (Object, 可选): 配置选项
  - fontWeight (string): 字体粗细，默认 'normal'
  - fontStyle (string): 字体样式，默认 'normal'
  - fontDisplay (string): 字体显示方式，默认 'swap'

**返回值:** string - CSS字符串

### generateCSSFile(fontNames, options)
生成包含多个字体的完整CSS内容。

**参数:**
- fontNames (string|Array<string>): 字体名称或字体名称数组
- options (Object, 可选): 配置选项

**返回值:** string - 完整CSS内容

### writeCSSFile(fontNames, outputPath, options)
将CSS内容写入文件。

**参数:**
- fontNames (string|Array<string>): 字体名称或字体名称数组
- outputPath (string): 输出文件路径
- options (Object, 可选): 配置选项

## 字体文件结构

包中的字体文件按以下结构组织：

`
hqvt-font-manager/
 index.js
 fonts/
    chineseFint/          # 中文字体目录
       1635950212302373.otf
       1635950212489300.otf
       ...
    englishFonts/         # 英文字体目录
        OpenSans-Regular.ttf
        OpenSans-Bold.ttf
        ...
 README.md
`

## 使用示例

### 在Web项目中使用

`javascript
const { writeCSSFile } = require('./index.js');

// 生成字体CSS文件
writeCSSFile(['OpenSans-Regular', 'OpenSans-Bold'], './public/fonts.css');
`

然后在HTML中引入：

`html
<link rel="stylesheet" href="./public/fonts.css">
<style>
  body {
    font-family: 'OpenSans-Regular', sans-serif;
  }
  h1 {
    font-family: 'OpenSans-Bold', sans-serif;
  }
</style>
`

### 在Node.js项目中使用

`javascript
const { generateFontCSS } = require('./index.js');

// 生成CSS并写入到响应中
app.get('/fonts.css', (req, res) => {
  const css = generateFontCSS('OpenSans-Regular');
  res.setHeader('Content-Type', 'text/css');
  res.send(css);
});
`

## 注意事项

1. 字体文件会随包一起发布，请确保字体文件有合法的使用授权
2. 字体名称会自动清理特殊字符以确保CSS兼容性
3. 支持 .otf 和 .ttf 格式的字体文件
4. 如果字体不存在，会抛出错误或显示警告

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### 1.0.0
- 初始版本发布
- 支持中英文字体管理
- 支持CSS生成和文件输出
