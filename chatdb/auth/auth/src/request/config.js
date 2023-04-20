/*
 * @Description: 网络请求配置
 * @Autor: GuluGuluu
 * @Date: 2022-08-14 01:46:36
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-10-18 20:07:06
 */
import URL from '../env'
const DOMAIN = URL;
const serverConfig = {
    baseURL: DOMAIN, // 请求基础地址,可根据环境自定义
    useTokenAuthorization: false, // 是否开启 token 认证
};
export default serverConfig;