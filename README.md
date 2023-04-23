# Cpp.js

> ## C++ compiler written in Vanilla Javascript

## Features

-   [x] Compiles c++ to Rust
-   [ ] Compiles c++ to Php (Not yet)

## Motivation

Because I had no other choice.

## Example

```sh
# node main.js <file>.cpp
node main.js main.cpp # compiles a main.cpp file to rust
```

## Test rust code

```sh
# rustc <file>.rs -o <file>.out
rustc main.rs -o main.out
```

## Support

-   [ ] `//` comments
-   [ ] `printf("...");`
-   [ ] `return`

```cpp
#include <cstdio>

int main()
{
    // This is comment
    printf("Hello from c++\n");
    return 0;
}
```
