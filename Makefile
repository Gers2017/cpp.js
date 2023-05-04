CC=rustc


default: build-rs

build-rs:
	node main.js main.cpp && $(CC) main.rs -o main.out

run:
	./main.out

clean:
	rm *.out 

