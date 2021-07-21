<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p><input type="text" @keydown.enter="addFeature" /></p>
    <ul>
      <li v-for="feature in features" :key="feature.id">{{ feature.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { foo } from './ts-test';

console.log('foo :>> ', foo.setBar()); // hk-log
console.log('foo :>> ', foo.log()); // hk-log

type Feature = {
  id: number;
  name: string;
};

// let union: string | number;
// union = '1';
// union = 1;

type First = { first: number };
type Second = { second: number };

type FirstAndSecond = First & Second;

// 函数重载，利用形参的数量或者形参的类型或者返回值的类型来区别函数的不同使用方法，可以声明很多函数的重载

// function watch(cb1: () => void): void;

// function watch(cb1: () => void, cb2: (v1: any, v2: any) => void): void;

// function watch(cb1: () => void, cb2?: (v1: any, v2: any) => void) {
//   if (cb1 && cb2) {
//   } else {
//   }
// }

interface Result<T> {
  ok: 0 | 1;
  data: T;
}

function getResult<T>(): Promise<Result<T>> {
  const data: any = [
    { id: 1, name: '43555' },
    { id: 12, name: '8355569' },
  ];
  return Promise.resolve({
    ok: 1,
    data,
  });
}

@Component
export default class HelloWorld extends Vue {
  @Prop({ type: String, required: true }) private msg!: string;

  features: Feature[] = [];

  testUnion: FirstAndSecond = { first: 111, second: 777 };

  async created() {
    // this.features = (await getResult<Feature[]>()).data;
    getResult<Feature[]>().then((result) => {
      this.features = result.data;
    });

    this.$axios.get<Feature[]>('/api/list').then((res) => {
      this.features = res.data;
    });
  }

  addFeature(e: KeyboardEvent): void {
    // 用户确定变量的类型，可以使用断言
    const input = e.target as HTMLInputElement;
    const feature: Feature = {
      name: input.value,
      id: this.features.length + 1,
    };
    this.features.push(feature);
    input.value = '';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
