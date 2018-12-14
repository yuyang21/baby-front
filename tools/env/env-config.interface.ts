// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  /**
   * 域名
   */
  DOMAIN?: string;

  API?: string;
  ENV?: string;
  /**
   * 公众号id
   */
  WECHAT_ID?: string;
  /**
   * 公众号appid
   */
  WECHAT_APPID?: string;

  /**
   * 文件路径
   */
  FILE_PATH?:string;
}
