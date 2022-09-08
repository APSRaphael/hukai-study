type Partial<T> = {
	[P in keyof T]?: T[P];
};

type Required<T> = {
	[P in keyof T]-?: T[P];
};

type Readonly<T> = {
	readonly [P in keyof T]: T[P];
};

type Record<K extends keyof any, T> = {
	[P in K]: T;
};

type Pick<T, K extends keyof T> = {
	[P in K]: T[P];
};

type Exclude<T, U> = T extends U ? never : T;

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type TODO = "completed" | "createdAT" | "description";

type TodoInfo = Omit<TODO, "completed" | "createdAT">;

type Extract<T, U> = T extends U ? T : never;

type NonNullable<T> = T extends null | undefined ? never : T;

declare function f1(arg: { a: number; b: string }): void;

type D0 = Parameters<() => string>; // D0 = [] 没有参数

type D1 = Parameters<(s: string) => void>; // D1 = [s:string]

type D2 = Parameters<<T>(arg: T) => T>; // D2 = [arg: unknow]

type D3 = Parameters<typeof f1>; // D3 = [arg: {a: number; b: string;}]

type Parameters<T extends (...args: any) => any> = T extends (
	...args: infer P
) => any
	? P
	: never;


class C { x = 0; y = 0}

type E0 = InstanceType<typeof C>
