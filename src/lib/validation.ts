import { z } from 'zod';
import type { TFunction } from 'i18next';

export function makeLoginSchema(t: TFunction) {
  return z.object({
    login: z.string().min(1, t('auth.errors.loginRequired')),
    password: z.string().min(6, t('auth.errors.passwordMin')),
  });
}
export type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;

export function makeRegisterSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t('auth.errors.emailInvalid')),
    username: z
      .string()
      .min(3, t('auth.errors.usernameMin'))
      .regex(/^[a-zA-Z0-9_.]+$/, t('auth.errors.usernameFormat')),
    displayName: z.string().optional(),
    password: z.string().min(6, t('auth.errors.passwordMin')),
  });
}
export type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>;

export function makeEditProfileSchema(t: TFunction) {
  return z.object({
    displayName: z.string().max(50).optional(),
    username: z
      .string()
      .min(3, t('auth.errors.usernameMin'))
      .regex(/^[a-zA-Z0-9_.]+$/, t('auth.errors.usernameFormat')),
    bio: z.string().max(160).optional(),
  });
}
export type EditProfileFormValues = z.infer<ReturnType<typeof makeEditProfileSchema>>;

export function makeChangePasswordSchema(t: TFunction) {
  return z.object({
    currentPassword: z.string().min(1, t('auth.errors.loginRequired')),
    newPassword: z.string().min(6, t('auth.errors.passwordMin')),
  });
}
export type ChangePasswordFormValues = z.infer<ReturnType<typeof makeChangePasswordSchema>>;
