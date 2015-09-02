CompiladorJS
========

Um compilador simples escrito em JavaScript.

Baseado em: https://github.com/kristofer-escobar/Compiler

Exemplos de código:

```
// Deve gerar: 0
{
  int a
  string b
  show(a) 
  show(b)
}

//Deve Gerar: 15teste
{
  int a
  string b
  a = 1+2+3+4+5
  b = "teste"
  show(a)
  show(b)
}

//Deve Gerar: 20compilador
{
  int a
  string b
  int c
  string d
  c = 5
  a = 1+2+3+4+5+c
  b = "teste"
  d = "compilador"
  show(a)
  show(d)
}

//Deve Gerar: 7
{
  int a
  int b
  a = 5
  b = 2 +3
  if( a == b ) { 
    int c
    c = 2 + a
    show(c)
  }
}

//Deve fazer um loop enquanto imprime: compilador
{
  int a
  int b
  a = 8
  b = 2 + 6
  while( a == b ) { 
    string c
    c = "compilador"
    show(c)
  }
}
```
