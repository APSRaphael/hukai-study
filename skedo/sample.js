class IDGen {
	private constructor() {}
	static inst = new IDGen();
	static get() {
		return this.inst;
	}
}
