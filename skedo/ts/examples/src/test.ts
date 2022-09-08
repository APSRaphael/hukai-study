type Flatterned1<T> = T extends (infer V)[] ? V : T;

type J = Flatterned1<Array<number>>; // number

type K = Flatterned1<Array<Array<number>>>; // Array<number>

type Flatterned2<T> = T extends (infer V)[] ? Flatterned2<V> : T;

type J1 = Flatterned2<Array<number>>; // number

type K2 = Flatterned2<Array<Array<number>>>; // number

function flattern1<T extends Array<Flatterned2<[]>>>(arr: T): Array<Flatterned2<T>> {
	return (new Array<Flatterned2<T>>()).concat(
		...arr.map((x) => (Array.isArray(x) ? flattern1(x) : x))
	);
}
