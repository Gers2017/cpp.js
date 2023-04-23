#!/bin/sh

node main.js main.cpp &&
rustc main.rs -o main.out &&
./main.out
