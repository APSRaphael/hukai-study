/*
 * @Author: 益智
 * @Date: 2023-04-13 17:32:59
 * @LastEditTime: 2023-04-13 17:59:12
 * @LastEditors: 益智
 * @Description:
 */
/*****************************************************************
  > File Name:     1.getopt.c
  > Author:        Raphael
  > Cretated Date: 2023年04月11日
 *****************************************************************/

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
int main(int argc, char **argv){
    int opt;
    while((opt = getopt(argc, argv, "ab:c::")) != -1){
        switch(opt){
            case 'a':
                printf("opt a found!\n");
                printf("ind = %d\n", optind);
                break;
            case 'b':
                printf("opt b found!\n");
                printf("ind = %d\n", optind);
                printf("arg for b = %s\n", optarg);
                break;
            case 'c':
                printf("opt c found!\n");
                printf("ind = %d\n", optind);
                printf("arg for c = %s\n", optarg);
                break;
            default:
                printf(stderr, "Usage: %s -a -b barg -c[carg]!\n, argv[0]");
                exit(1);
        }

    }
    return 0;
}
