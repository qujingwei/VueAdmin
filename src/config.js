const is_debug = false
export const PAGE_BASEURL = is_debug ? 'http://www.firefilm.cc/' : 'http://firefilm.wan2sha.com/'
export const UPLOAD_BASEURL = is_debug ? 'http://192.168.3.110:18020' : 'http://admin.firefilm.wan2sha.com/upload'
export const DOWNLOAD_BASEURL = is_debug ? 'http://www.firefilm.cc/img/':'http://img.firefilm.wan2sha.com/'
export const API_BASEURL = is_debug ? 'http://192.168.3.110:18010' : 'http://admin.firefilm.wan2sha.com/api/' // http://admin.firefilm.wan2sha.com/api/

export const TAGS = {
    NATION: ['华语', '美国', '欧洲', '韩国', '日本', '泰国', '其它'],
    TYPE: ['喜剧', '悲剧', '爱情', '动作', '枪战', '犯罪', '惊悚', '恐怖', '悬疑', '动画', '家庭', '奇幻', '魔幻', '科幻', '战争', '青春'],
    YEAR: ['2017', '2016', '2015', '2014-2011', '2010-2000', '90年代', '80年代']
}
