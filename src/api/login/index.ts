import type { PhoneNumForm, SigninForm, picIfo, wechatQRCode } from '@/type/login'
import { get, post } from '@/utils'
/**
 * 获得图形验证码
 * @returns {Promise<picIfo | undefined>} 返回验证码data或undefined
 */
export const getNumPiC = async (): Promise<picIfo | undefined> => {
  const [, data] = await get<picIfo>('/captchaImage')
  // 在此处本应需错误进行处理
  return data?.data
}
/**
 * 提交手机号和验证码
 * @param {PhoneNumForm} formData 电话号码表单
 * @returns {Promise<PhoneNumForm | undefined>} 返回表单数据或undefined
 */
export const submitPhoneNumber = async (formData: PhoneNumForm): Promise<PhoneNumForm | undefined> => {
  const [, data] = await post<PhoneNumForm>(
    '/user/verifyCode',
    {
      ...formData
    }
  )
  // 在此处本应需错误进行处理
  if (data?.code === 403) {
    return undefined
  } else {
    return data?.data
  }
}
/**
 * 提交注册表单
 * @param {SigninForm} formData 注册表单
 * @returns {Promise<SigninForm | undefined>} 返回表单或undefined
 */
export const checkPhoneNum = async (formData: SigninForm): Promise< SigninForm | undefined> => {
  const [, data] = await post<SigninForm>(
    '/user/register',
    {
      ...formData
    }
  )
  // 在此处本应需错误进行处理
  if (data?.code === 409) {
    return undefined
  } else {
    return data?.data
  }
}

/**
 * 获取二维码
 * @returns {Promise<wechatQRCode | undefined>} 返回二维码data或undefined
 */
export const getQRcod = async (): Promise< wechatQRCode | undefined> => {
  const [, data] = await get<wechatQRCode>('/wxUser/wxQr')
  // 在此处本应需错误进行处理
  return data?.data
}
