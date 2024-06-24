import {defineConfig} from 'vitepress'
import {getFiles} from "../utils/utils";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "仙门中走出的男人",
    description: "人如代码，规矩灵活；代码如诗，字句精伦。",
    srcDir: './src',
    lang: 'zh',
    themeConfig: {
        outline: {
            label: '页面导航'
        },

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '首页', link: '/'},
            {
                text: '技术分享',
                link: '/document'
            },
            {text: '随心笔记', link: '/notes'},
        ],
        sidebar: {
            "/document": {
                text: '技术分享',
                items: getFiles('document')
            }
        },
        search: {
            provider: 'local',
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },
        footer: {
            copyright: 'Copyright © 2023-present 仙门中走出的男人'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/aweixin/aweixin.github.io'}
        ],
    }
})

