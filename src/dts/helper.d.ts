/**
 * 元组长度计数器
 *
 * @description
 * 由于 TypeScript 无法直接对数字进行加法运算（如 `1 + 1`），
 * 本类型通过在传入的元组 `A` 末尾追加一个 `unknown` 元素，利用元组的 `length` 属性来模拟数值加 1。
 *
 * @example
 * Increment<[]>        => 长度为 1 的元组 [unknown]
 * Increment<[unknown]> => 长度为 2 的元组 [unknown, unknown]
 */
type Increment<A extends unknown[]> = [...A, unknown]

/**
 * 限制递归深度的深层可选类型
 *
 * @template T - 需要处理的目标对象类型。
 * @template D - 最大递归深度限制（默认值为 3 层），防止极端情况下的编译器性能崩溃或因循环引用导致的死循环。
 * @template C - 内部递归计数器（元组类型，默认从空元组 `[]` 开始计算）。
 *
 * @returns 返回一个所有深层属性都变为可选（`?`）的新类型。当达到最大深度 `D` 时停止向下递归。
 *
 * @example
 * // 基础用法（默认 3 层）：
 * type Config = { a: { b: { c: { d: string } } } }
 * type PartialConfig = DeepPartial<Config>
 * // 结果：{ a?: { b?: { c?: { d: string } } } } -> 注意：第 4 层的 d 没有变成可选
 *
 * // 突破限制（显式指定支持 4 层）：
 * type DeepConfig = DeepPartial<Preferences, 4>
 */
type DeepPartial<T, D extends number = 3, C extends unknown[] = []> =
  C['length'] extends D ? T
  : T extends object ?
    {
      [P in keyof T]?: DeepPartial<T[P], D, Increment<C>>
    }
  : T
