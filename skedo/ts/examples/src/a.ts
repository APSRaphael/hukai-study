type A = string & number; // A = never
type B = string | number;

// type Flatterned<T> = T extends Array<T> ? T : T;

// type Flatterned<T> = T extends Array<infer V> ? V : T;
type Flatterned<T> = T extends Array<infer V> ? Flatterned<V> : T;

type D = Flatterned<Array<number>>;
type F = Flatterned<Array<Array<number>>>;

type Atom = string | number | boolean | bigint;
type Nested<T> = (T | (T | T[])[])[];

// type Nested = Array<Atom | Nested>

function flattern<T extends Atom>(arr: Nested<Atom>): Atom[] {
	return new Array<Atom>().concat(
		...arr.map((x) => (Array.isArray(x) ? flattern(x) : x))
	);
}

type Unwrap<T> = T extends Promise<infer U>
	? Unwrap<U>
	: //  ? U
	T extends Array<infer V>
	? UnwrapArray<T>
	: T;

type UnwrapArray<T> = T extends Array<infer R>
	? { [P in keyof T]: Unwrap<T[P]> }
	: T;

type T0 = Unwrap<Promise<Promise<number>>[]>;

type Unwrapped<T> = T extends Array<infer U> ? U : T;

type T1 = Unwrapped<Promise<string>[]>; // T1 = Promise<string>

type Unwrapped1<T> = T extends Array<infer U>
	? U extends Promise<infer R>
		? R[]
		: U
	: T;

type T2 = Unwrapped1<Promise<string>[]>; // T2 = string[]
