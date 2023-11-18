import type { PhoneNumForm, SigninForm, picIfo, wechatQRCode } from '@/type/login'
import { get, post } from '@/utils'

// 校验图形验证码
export const getNumPiC = async (): Promise<picIfo | undefined> => {
  const [, data] = await get<picIfo>('/captchaImage')
  return data?.data
}

// 判断手机验证码是否正确
export const submitPhoneNumber = async (formData: PhoneNumForm): Promise<PhoneNumForm | undefined> => {
  const [, data] = await post<PhoneNumForm>(
    '/user/verifyCode',
    {
      ...formData
    }
  )
  if (data?.code === 403) {
    return undefined
  } else {
    return data?.data
  }
}

// 判断注册的手机号码是否已被注册
export const checkPhoneNum = async (formData: SigninForm): Promise< SigninForm | undefined> => {
  const [, data] = await post<SigninForm>(
    '/user/register',
    {
      ...formData
    }
  )
  if (data?.code === 409) {
    return undefined
  } else {
    return data?.data
  }
}

// 获得二维码
export const getQRcod = async (): Promise< wechatQRCode | undefined> => {
  const [, data] = await get<wechatQRCode>('/wxUser/wxQr')
  return data?.data
}
