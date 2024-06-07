import {defineConfig} from 'vitepress'
import {getFiles} from "../utils/utils";

// https://vitepress.dev/reference/site-config
export default defineConfig({

    title: "仙门中走出的男人",
    description: "人如代码，规矩灵活；代码如诗，字句精伦。",
    srcDir: './src',
    outDir: '../dist',
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
            provider: 'algolia',
            options: {
                appId: '36GSPPA91S',
                apiKey: '1dbf5640e959db30f21cfcef1922ce13',
                indexName: '仙门中走出的男人',
                locales: {
                    zh: {
                        placeholder: '搜索文档',
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                searchBox: {
                                    resetButtonTitle: '清除查询条件',
                                    resetButtonAriaLabel: '清除查询条件',
                                    cancelButtonText: '取消',
                                    cancelButtonAriaLabel: '取消'
                                },
                                startScreen: {
                                    recentSearchesTitle: '搜索历史',
                                    noRecentSearchesText: '没有搜索历史',
                                    saveRecentSearchButtonTitle: '保存至搜索历史',
                                    removeRecentSearchButtonTitle: '从搜索历史中移除',
                                    favoriteSearchesTitle: '收藏',
                                    removeFavoriteSearchButtonTitle: '从收藏中移除'
                                },
                                errorScreen: {
                                    titleText: '无法获取结果',
                                    helpText: '你可能需要检查你的网络连接'
                                },
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭',
                                    searchByText: '搜索提供者'
                                },
                                noResultsScreen: {
                                    noResultsText: '无法找到相关结果',
                                    suggestedQueryText: '你可以尝试查询',
                                    reportMissingResultsText: '你认为该查询应该有结果？',
                                    reportMissingResultsLinkText: '点击反馈'
                                }
                            }
                        }
                    }
                }
            }
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
        editLink: {
            pattern: 'https://github.com/aweixin/aweixin.github.io/edit/main/src/:path',
            text: '在 GitHub 上编辑此页'
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/aweixin/aweixin.github.io'}
        ],

    }
})

