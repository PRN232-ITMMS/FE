import * as yup from 'yup'
import { UserRole, Gender } from '@/types/user.type'

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Email phải có ít nhất 5 ký tự')
    .max(255, 'Email không được vượt quá 255 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Email phải có ít nhất 5 ký tự')
    .max(255, 'Email không được vượt quá 255 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: yup
    .string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được vượt quá 100 ký tự'),
  phoneNumber: yup
    .string()
    .optional()
    .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ'),
  gender: yup
    .number()
    .optional()
    .oneOf([Gender.Male, Gender.Female, Gender.Other], 'Giới tính không hợp lệ'),
  role: yup
    .number()
    .default(UserRole.Customer)
    .oneOf([UserRole.Customer, UserRole.Doctor, UserRole.Manager, UserRole.Admin], 'Vai trò không hợp lệ'),
  address: yup
    .string()
    .optional()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
  emergencyContactName: yup
    .string()
    .optional()
    .max(200, 'Tên người liên hệ khẩn cấp không được vượt quá 200 ký tự'),
  emergencyContactPhone: yup
    .string()
    .optional()
    .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại người liên hệ khẩn cấp không hợp lệ'),
  maritalStatus: yup
    .string()
    .optional()
    .max(50, 'Tình trạng hôn nhân không được vượt quá 50 ký tự'),
  occupation: yup
    .string()
    .optional()
    .max(200, 'Nghề nghiệp không được vượt quá 200 ký tự'),
})

export type LoginSchema = yup.InferType<typeof loginSchema>
export type RegisterSchema = yup.InferType<typeof registerSchema>
