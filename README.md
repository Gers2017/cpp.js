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
# compiles main.cpp to main.rs
node main.js main.cpp

# compiles main.cpp to main.asm
# run node main.js --target list for valid targets
node main.js main.cpp --target x86_64-fasm-linux-gnu

# for more details
node main.js --help
```

## Makefile

Build main.rs and run

```sh
make build-rs
make run
```

Build main.asm and run

```sh
make build-fasm
make run-fasm
```

## Test rust code manually

```sh
# rustc <file>.rs -o <file>.out
rustc main.rs -o main.out
```

## Support

-   [ ] `//` comments
-   [ ] `printf("...");` it doesn't support more arguments (`printf("%d", 10)` doesn't work)
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
