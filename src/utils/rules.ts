import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Email phải có ít nhất 5 ký tự')
    .max(160, 'Email không được vượt quá 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Password phải có ít nhất 6 ký tự')
    .max(160, 'Password không được vượt quá 160 ký tự'),
})

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Email phải có ít nhất 5 ký tự')
    .max(160, 'Email không được vượt quá 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Password phải có ít nhất 6 ký tự')
    .max(160, 'Password không được vượt quá 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Confirm password là bắt buộc')
    .oneOf([yup.ref('password')], 'Confirm password không khớp'),
})

export type LoginSchema = yup.InferType<typeof loginSchema>
export type RegisterSchema = yup.InferType<typeof registerSchema>
