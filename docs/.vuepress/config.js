module.exports = {
    themeConfig: {
        nav: [
            { text: 'Webpack', link: '/blog/webpack/' },
            { text: '小程序', link: '/blog/smallapp/' },
            { text:'知识',link:'/blog/mianshi/'},
        ],
        //设置侧边栏
        sidebar: {
            '/blog/webpack/': [
                '',
                'webpack2',
                'webpack3',
                'webpack4',
            ],
            '/blog/smallapp/': [
                '',
                'one',
                'second',
                'three',
                'four'
            ],
            '/blog/mianshi/': [
                '',
                'one',
                'two',
                'three'
            ],
        },

    }
}