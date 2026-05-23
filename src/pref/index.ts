import type { Pref } from '@/pref/type.ts'

/**
 * 覆盖偏好
 */
export const overriddenPref = {
  app: {
    name: import.meta.env.VITE_APP_NAME,
  },
} satisfies DeepPartial<Pref>
