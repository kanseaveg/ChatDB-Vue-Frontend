import { ChromeFilled, UserOutlined, HistoryOutlined, MessageOutlined, CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';
import React from 'react';
import head from './head2.png'
const defaultProps = {
    title: 'chatdb',
    logo: head,
    route: {
        path: '/',
        routes: [
            {
                path: '/db',
                name: '数据库管理',
                icon: <TabletFilled />,
                access: 'canAdmin',
                // component: './Admin',
                routes: [
                    {
                        path: '/db/publicdb',
                        name: '公共数据库管理',
                        icon: <TabletFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/db/userdb',
                        name: '用户数据库管理',
                        icon: <UserOutlined />,
                        component: './Welcome',
                    },
                ],
            },
            {
                name: '用户管理',
                icon: <UserOutlined />,
                path: '/user',
                component: './ListTableList',
                routes: [
                    {
                        path: '/user/info',
                        name: '用户信息',
                        icon: <UserOutlined />,
                    },
                    {
                        path: '/user/history',
                        name: '用户提问历史',
                        icon: <HistoryOutlined />,
                        component: './Welcome',
                    },
                    {
                        path: '/user/feedback',
                        name: '用户反馈',
                        icon: <MessageOutlined />,
                        component: './Welcome',
                    },
                ],
            },
            // {
            //     path: 'https://ant.design',
            //     name: 'Ant Design 官网外链',
            //     icon: <ChromeFilled />,
            // },
        ],
    },
    location: {
        pathname: '/',
    },
    // appList: [
    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    //         title: 'Ant Design',
    //         desc: '杭州市较知名的 UI 设计语言',
    //         url: 'https://ant.design',
    //     },
    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
    //         title: 'AntV',
    //         desc: '蚂蚁集团全新一代数据可视化解决方案',
    //         url: 'https://antv.vision/',
    //         target: '_blank',
    //     },
    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
    //         title: 'Pro Components',
    //         desc: '专业级 UI 组件库',
    //         url: 'https://procomponents.ant.design/',
    //     },
    //     {
    //         icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
    //         title: 'umi',
    //         desc: '插件化的企业级前端应用框架。',
    //         url: 'https://umijs.org/zh-CN/docs',
    //     },

    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
    //         title: 'qiankun',
    //         desc: '可能是你见过最完善的微前端解决方案🧐',
    //         url: 'https://qiankun.umijs.org/',
    //     },
    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
    //         title: '语雀',
    //         desc: '知识创作与分享工具',
    //         url: 'https://www.yuque.com/',
    //     },
    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
    //         title: 'Kitchen ',
    //         desc: 'Sketch 工具集',
    //         url: 'https://kitchen.alipay.com/',
    //     },
    //     {
    //         icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
    //         title: 'dumi',
    //         desc: '为组件开发场景而生的文档工具',
    //         url: 'https://d.umijs.org/zh-CN',
    //     },
    // ],
};
export default defaultProps;