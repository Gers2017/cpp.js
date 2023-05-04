CC=rustc
ASM=fasm

default: build-rs

build-rs:
	node main.js main.cpp --target rust && $(CC) main.rs -o main.out

build-fasm:
	node main.js main.cpp --target x86_64-fasm-linux-gnu && $(ASM) main.asm main.elf && chmod +x main.elf

run:
	./main.out

run-fasm:
	./main.elf

clean:
	rm *.out 

