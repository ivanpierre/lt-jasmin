#Jasmin language plugin for Light Table

The official Jasmin language plugin for Light Table

## Goal

This plugin is a companion for the jvm-clj project to integer Jasmin language for JVM machine code compilation and uncompilation. As the last version Jasmin 2 is quite old and not more supported, we'll try to make it envolve to a version 3 level with a better syntax and a complete coverage of the Java 8 JVM.

This means :

A java like declaration for simple code creation, enabeling automatic calculation of
1. Try and catch zones
2. Local variables index and scope
3. Dynamic and static importation of libraries
4. Macro definition for DSL instructions creation

The base data for JVM code representation is EDN compatible to ease to directly use the compiler. Jasmine compiler is made to ease the JVM code writing diretly by hand of the read disassembled code. JVM code creation would be easier made computabily with the internal representation.

A leiningen plugin should be created too...

##License

Copyright (C) 2013-2014 kilroySoft.

Distributed under the GPLv3, see license.md for the full text.
