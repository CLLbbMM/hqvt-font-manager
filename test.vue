<template>
    <div class="data-overview">
        数据总览
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { FontManager } from 'hqvt-font-manager'

const fontManager = new FontManager()

onMounted(() => {
    try {
        console.log('开始设置字体...')

        // 只注册和注入CSS，不预加载
        fontManager.registerFont('OpenSans-Bold', {
            url: '/fonts/OpenSans-Bold.ttf',
            type: 'english',
            format: 'truetype',
            weight: 'bold',
            display: 'swap'
        })
        console.log('字体注册成功')

        fontManager.injectCSS('OpenSans-Bold', {
            id: 'auto-opensans-bold'
        })
        console.log('CSS注入成功')
        console.log('字体设置完成！')

    } catch (error) {
        console.error('字体设置失败：', error)
    }
})
</script>

<style scoped lang="less">
.data-overview {
    font-family: 'OpenSans-Bold', Arial, sans-serif;
    font-size: 32px;
    font-weight: bold;
    color: #1a1a1a;
    padding: 30px;
    text-align: center;
}
</style>