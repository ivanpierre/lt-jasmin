# JVM and Jasmin Tutorial

Source : http://www.ceng.metu.edu.tr/courses/ceng444/link/f3jasmintutorial.html

This tutorial covers only a subset of JVM specification, which is enough for a person who will use JVM as a target language for F3.

## 1. Overview

JVM (Java Virtual Machine) is a piece of software, a "virtual" processor, by which Java programs are run. It is an interface between your Java program and the hardware your system uses. It is not a Java compiler, it is the machine which runs the compiled Java code. It is the mechanism which makes Java portable.

By virtue of being a virtual machine, JVM, can as well be an interface between another programming language and the hardware, which will also make that language portable. So, 'F3 is a portable programming language' is perfectly a true statement, for anyone who is saying 'Java is a portable programming language'.

Like all other virtual machines, JVM has an instruction set. There are nearly 255 instructions in this set, however you will not be dealing with all of them.

JVM takes "class" files as input. Class files are binary files, so it is not an easy job to write a class file from scratch. So what you need is a tool to convert an ASCII JVM code to a binary class file. Here's where Jasmin comes into picture. You can think of Jasmin as a Java Assembler. So, in the second phase of your project, you will be producing Jasmin files instead of binary "class" files, which will ease your job a lot.

## 2. A Simple F3 Example Translated into Jasmin

The following is a quick introduction to JVM and Jasmin.

A simple program in F3 :


    int func main()
         var x:int;

         read x;
         x := x + 3;
         print x;
         return 0;
    endfunc


The same program in Jasmin :

    .class public simple
    .super java/lang/Object
    .method public <init>()V
        aload_0
        invokespecial java/lang/Object/<init>()V
        return
    .end method
    .method public static main([Ljava/lang/String;)V
        .limit stack 5
        .limit locals 100
        ldc 0
        istore 1      ; initialize x to zero and store it in local variable 1

                      ; the read function starts at this point
        ldc 0
        istore 50     ; storage for a dummy integer for reading it by read
     Label1:
        getstatic java/lang/System/in Ljava/io/InputStream;
        invokevirtual java/io/InputStream/read()I
        istore 51
        iload 51
        ldc 10
        isub
        ifeq Label2
        iload 51
        ldc 32
        isub
        ifeq Label2
        iload 51
        ldc 48
        isub
        ldc 10
        iload 50
        imul
        iadd
        istore 50
        goto Label1
      Label2:          ; now our dummy integer contains the
                       ; integer read from the keyboard
        iload 50       ; read function ends here
        istore 1       ; store this value in x
        iload 1
        ldc 3
        iadd
        istore 1       ; x=x+3
        iload 1
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/println(I)V   ; print x
        return        ; return from main
    .end method


The Jasmin code for the program looks quite complicated compared to the F3 version, but you do not need to know all the things around. Most of the code you see above will be present in all of the files you generate. So you can consider the above Jasmin code as a template.

A Jasmin file consists of directives, labels and instructions. The lines beginning with a "." (dot) are directives, labels are names followed by a ":", and a new line. The rest are considered as instructions.

.class directive tells Jasmin the name of the class being defined.

.super directive tells Jasmin the class which our class is extending. It will be java/lang/Object for all F3 programs.

The method (function) definitions begin with a .method directive and end with .end method directive.

The \<init> method is an instance initialization method and again will be present for all F3 programs. It is used to initialize a new instance of the class. This is a process, which also includes initialization of the inherited class, which, in this case, is java/lang/Object.

The main method is where the translated code of your F3 program resides. Notice that the main function has a parameter which is an array of strings and it returns void. The main function for JVM has to have these specifications to qualify as an entry point to the program.

.limit stack 5 directive in main method sets the size of the operand stack for method main to 5. This means, we can push up to five items on that method's operand stack during the execution of the method. Each method has its own operand stack in JVM.

.limit locals 100 directive sets the number of local variables in method main to 100. It is set to 1 by default. Use this directive in a method which has more than one local variable.

The rest in the above code are the instructions, which are explained in detail in 'The Instruction Set' section.

## 3. Type Descriptors

When you are defining a method (function) with a .method directive, you specify the type of parameters and the return type by using type descriptors. You will not be using these directives in your program since your only method declaration will be the main method. Other than main method you can declare read and print methods by default in every Jasmin file you produce. The Jasmin code for these built-in functions are given at the end of this tutorial. Anyway, to help you understand the function calls used in a Jasmin program for the built-in F3 functions, read and print, here are the basic type descriptors that may used in a Jasmin program:

    F 		Single precision IEEE 754 float.
    I 		Integer.
    L<classname>; 		An instance of the class.
    [ 		One array dimension.
    V 		void for return type.

For example int f(int a, string b, float c) will have a descriptor .method public static f(ILjava/lang/String;F)I.

Now, take a look at the simple program's main method: .method public static main([Ljava/lang/String;)V. It is a method which takes an array of strings as a parameter and returns no results. Notice that string is not a primitive type in JVM, so we have to use the Ljava/lang/String descriptor for strings, which represents the String object of Java.

## 4. The Instruction Set

The instructions of JVM are presented in the following format:

    mnemonic {parameters}
        Brief description.
        (stack before »»»» stack after)

Following are the instructions you may need to use.

### Load and Store Instructions :

    iload <local variable number>
        Pushes the value of the local variable which is an integer.
        (..... »»»» .....value)
    istore <local variable number>
        Pops the value which is an integer and stores it in local variable.
        (.....value »»»» ......)
    fload <local variable number>
        Pushes the value of the local variable which is a float.
        (..... »»»» ......value)
    fstore <local variable number>
        Pops the value which is a float and stores it in local variable.
        (.....value »»»» ......)
    ldc <constant>
        Push constant on the stack.
        (..... »»»» .....constant)

### Stack Manipulation Instructions :

    dup
        The word on top of the stack is duplicated.
        (.....word »»»» .....word word)
    pop
        Pop top word off the operand stack.
        (.....word »»»» .....)
    swap
        Swap two operand stack words.
        (.....word1 word2 »»»» .....word2 word1)

### Arithmetic Instructions :

    iadd
        Add two integers.
        (.....value1 value2 »»»» .....value1+value2)
    idiv
        Divide two integers.
        (.....value1 value2 »»»» .....value1/value2)
    imul
        Multiply two integers.
        (.....value1 value2 »»»» .....value1*value2)
    isub
        Subtract two integers.
        (.....value1 value2 »»»» .....value1-value2)
    fadd
        Add two floats.
        (.....value1 value2 »»»» .....value1+value2)
    fdiv
        Divide two floats.
        (.....value1 value2 »»»» .....value1/value2)
    fmul
        Multiply two floats.
        (.....value1 value2 »»»» .....value1*value2)
    fsub
        Subtract two floats.
        (.....value1 value2 »»»» .....value1-value2)

### Branch Instructions :

    goto <label>
        Jump to label.
        (no changes in stack)
    ifeq <label>
        Jump to label if the value on top of stack is 0.
        (.....value »»»» .....)
    ifge <label>
        Jump to label if the value on top of the stack is grater than or equal to 0.
        (.....value »»»» .....)
    ifgt <label>
        Jump to label if the value on top of the stack is grater than 0.
        (.....value »»»» .....)
    ifle <label>
        Jump to label if the value on top of the stack is less than or equal to 0.
        (.....value »»»» .....)
    iflt <label>
        Jump to label if the value on top of the stack is less than 0.
        (.....value »»»» .....)
    ifne <label>
        Jump to label if the value on top of the stack is not equal to 0.
        (.....value »»»» .....)

### Logical Instructions :

    iand
        Bitwise AND (conjunction) of two integers.
        (.....value1 value2 »»»» .....result)
    ior
        Bitwise OR (disjunction) of two integers.
        (.....value1 value2 »»»» .....result)

### Conversion Instructions :

    i2f
        Convert integer to float.
        (.....intValue »»»» .....floatValue)
    f2i
        Convert float to integer.
        (.....floatValue »»»» .....intValue)

### Subroutine Instructions :

    jsr <label>
        Pushes the return address on the stack and jumps to subroutine indicated by the label.
        (..... »»»» .....returnAddress)
    ret <local variable number>
        Returns from subroutine to the return address which is stored in a local variable.
        (no changes in stack)

To implement a function in F3 as a subroutine, what you have to do is to push the arguments in the caller statement and jump to the beginning of the function by using jsr. In the beginning of the function you have to pop the return address and store it in a local variable, and pop the argument, store them in local variables. To return, you have to push the return value and use ret instruction to return to the execution point just after the jsr instruction. With ret, you have to use the local variable number that you used to store the return address.

## 5. Standard Library Functions of F3

There's no such thing as functions with variable number of parameters is java. So a direct implementation of the library functions read and print is not possible. You should handle read and print function invocations at the compile time. The Jasmin method declarations for a one parameter read function and a polymorphic one parameter print function are given in this section.

    ; int read()
    .method public static read()I
        .limit locals 10
        .limit stack 10
        ldc 0
        istore 1  ; this will hold our final integer
    Label1:
        getstatic java/lang/System/in Ljava/io/InputStream;
        invokevirtual java/io/InputStream/read()I
        istore 2
        iload 2
        ldc 10   ; the newline delimiter
        isub
        ifeq Label2
        iload 2
        ldc 32   ; the space delimiter
        isub
        ifeq Label2
        iload 2
        ldc 48   ; we have our digit in ASCII, have to subtract it from 48
        isub
        ldc 10
        iload 1
        imul
        iadd
        istore 1
        goto Label1
    Label2:
        ;when we come here we have our integer computed in Local Variable 1
        iload 1
        ireturn
    .end method

    ; void print(int)
    .method public static print(I)V
        .limit locals 5
        .limit stack 5
        iload 0
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/print(I)V
        return
    .end method

    ; void print(float)
    .method public static print(F)V
        .limit locals 5
        .limit stack 5
        fload 0
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/print(F)V
        return
    .end method

    ; void print(string)
    .method public static print(Ljava/lang/String;)V
        .limit locals 5
        .limit stack 5
        aload 0
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/print(Ljava/lang/String;)V
        return
    .end method

## 6. An Example of F3 to Jasmin Translation

In this section a F3 program which has a recursive function is translated into Jasmin. This example will give you an idea on handling function calls, especially recursive ones. Here is our F3 code for the example:

    var x:int, y:int;

    int func gcd(u:int, v:int)
         var tmp:int;
         if u < v then
              tmp := u;
              u := v;
              v := tmp;
         endif;
         if v = 0 then
              return u;
         else
              return gcd(v, u - v);
         endif;
    endfunc /* gcd */

    int func main()
         read "Enter two numbers: ", x, y;
         print x/y, " ", gcd(x, y), "\n";
         return 0;
    endfunc /* main */

Here is the Jasmin code for the above F3 program:

    .class public gcd
    .super java/lang/Object
    .method public ()V
        aload_0
        invokespecial java/lang/Object/()V
        return
    .end method

    ; int read()
    .method public static read()I
        .limit locals 10
        .limit stack 10
        ldc 0
        istore 1  ; this will hold our final integer
    Label1:
        getstatic java/lang/System/in Ljava/io/InputStream;
        invokevirtual java/io/InputStream/read()I
        istore 2
        iload 2
        ldc 10   ; the newline delimiter
        isub
        ifeq Label2
        iload 2
        ldc 32   ; the space delimiter
        isub
        ifeq Label2
        iload 2
        ldc 48   ; we have our digit in ASCII, have to subtract it from 48
        isub
        ldc 10
        iload 1
        imul
        iadd
        istore 1
        goto Label1
    Label2:
        ;when we come here we have our integer computed in Local Variable 1
        iload 1
        ireturn
    .end method

    ; void print(int)
    .method public static print(I)V
        .limit locals 5
        .limit stack 5
        iload 0
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/print(I)V
        return
    .end method

    ; void print(float)
    .method public static print(F)V
        .limit locals 5
        .limit stack 5
        fload 0
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/print(F)V
        return
    .end method

    ; void print(string)
    .method public static print(Ljava/lang/String;)V
        .limit locals 5
        .limit stack 5
        aload 0
        getstatic java/lang/System/out Ljava/io/PrintStream;
        swap
        invokevirtual java/io/PrintStream/print(Ljava/lang/String;)V
        return
    .end method

    .method public static main([Ljava/lang/String;)V
        .limit stack  150
        .limit locals 150
        ldc 0
        istore 0  ; initialize x
        ldc 0
        istore 1  ; initialize y
        goto Lmain
     Lgcd:
        istore 10   ; store return address in local variable 10
        istore 12   ; store y in local variable 12 (v in this scope)
        istore 11   ; store x in local variable 11 (u in this scope)
        ldc 0
        istore 13   ; initialize tmp
        iload 11
        iload 12
        isub      ; u-v
        iflt label1
        goto label2
     label1:
        iload 11
        istore 13 ; tmp=u
        iload 12
        istore 11 ; u=v
        iload 13
        istore 12 ; v=tmp
     label2:
        ldc 0
        iload 12
        isub
        ifeq label3
        goto label4
     label3:
        iload 11
        ret 10       ; return from gcd call
     label4:
        iload 10
        iload 11
        iload 12
        iload 13  ; push all locals on stack before the recursive call
        iload 12  ; push argument v
        iload 11
        iload 12
        isub      ; push argument u-v
        jsr Lgcd  ; the recursive call
        swap      ; this is for restoring the locals we pushed before jsr
        istore 13 ; the stack is (....locals,returned_result)
        swap      ; this "swap" solution works since our recursive
        istore 12 ; function has one return value
        swap      ; as all other F^3 functions.
        istore 11
        swap
        istore 10
                  ; now we have restored our locals
                  ; the stack is (....returned_result)
        ret 10    ; we return the returned_result of the recursive call

    Lmain:

        ldc "Enter two numbers: "
        invokestatic gcd.print(Ljava/lang/String;)V
        invokestatic gcd.read()I
        istore 0                 ; read x;
        invokestatic gcd.read()I
        istore 1                 ; read y;
        iload 0
        i2f
        iload 1
        i2f
        fdiv
        invokestatic gcd.print(F)V
        ldc " "
        invokestatic gcd.print(Ljava/lang/String;)V
        iload 0
        iload 1  ; note : y is on top of x
        jsr Lgcd
        invokestatic gcd.print(I)V ; we have the result of gcd on the stack
        ldc "\n"
        invokestatic gcd.print(Ljava/lang/String;)V
        return
    .end method
