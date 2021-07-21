/*
 * @Author: wb-hk750148@alibaba-inc.com
 * @Date: 2021-07-15 14:46:39
 * @LastEditTime: 2021-07-15 17:09:05
 * @LastEditors: wb-hk750148@alibaba-inc.com
 * @Description:
 */
import Vue from "vue";
import { AxiosInstance } from "axios";

declare module "*.vue" {
  export default Vue;
}

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosInstance;
  }
}
