export interface LoginForm {
  username?: string
  password?: string
  repassword?: string
  pic?: string
}

export interface SigninForm {
  phoneNumber: string
  password: string
  nickName: string
  gender: '女' | '男'
  age: number
}

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

export interface picIfo {
  img?: string
  captchaEnabled?: boolean
  uuid?: string
}

export interface PhoneNumForm {
  phoneNumber?: number | null
  code?: string
  tempKey?: string
  data?: string
}

export interface wechatQRCode {
  qrUrl?: string
  tempUserId?: string
}
