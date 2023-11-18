// 登录接口
export interface LoginForm {
  username?: string
  password?: string
  repassword?: string
  pic?: string
}
// 注册接口
export interface SigninForm {
  phoneNumber: string
  password: string
  nickName: string
  gender: '女' | '男'
  age: number
}
// 注册返回接口
export interface signinReturn {
  userId: number
  userName: string
  nickName: string
  gender: '男' | '女'
  phoneNumber: string
  avatarUrl: null
  token: string
  age: number
  registerDays: null
}
// 图像验证吗接口
export interface picIfo {
  img?: string
  captchaEnabled?: boolean
  uuid?: string
}
// 电话号码登录接口
export interface PhoneNumForm {
  phoneNumber: number | null
  code?: string
  tempKey?: string
  data?: string
}
// 微信接口
export interface wechatQRCode {
  qrUrl?: string
  tempUserId?: string
}
