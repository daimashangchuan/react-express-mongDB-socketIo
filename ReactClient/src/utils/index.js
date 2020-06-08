/**
 * 包含多个工具函数的模块
 */
       


/**
 * 用户主界面路由
 *      dashen： /dashen
 *      laoban： /laoban
 * 用户信息完善见面路由
 *      dashen： /dasheninfo
 *      loaban： /laobaninfo
 * 判断用户的类型/用户信息是否完善
 */
export function getRedirectTo(type, header) {
    let path 
    //  判断用户的类型
    if(type === 'laoban') {
        path = '/laoban'
    } else if(type === 'dashen') {
        path = '/dashen'
    }
    //  没有完善用户信息跳转到完善用户信息页面
    if(!header) {
        path += 'info'
    }
    return path
}







