/*
 * globals.js contains global variables and constants.
 */

/*********************
 * GLOBAL VARIABLES
 *********************
 */
var lexemeStartPosition = 0;

var currentLexeme = "";

var errorCount = 0;

var warningCount = 0;

var EOF = "End";

var REGEX_SPACE = /\s/;

var lexemeIndex = 0;

var sourceLines = [];

var charList = "";

var charListValue = "";

var startQuotePosition = 0;

var endQuotePosition = 0;

var inCharList = false;

var errorsFound = false;

var idName = "";

var idAddr = 0;

var idValue = "";

var idType = "";

var idIsUsed = "";

var idScope = "";

var idLifetime = "";

var idCategory = "";

var idVisibility = "";

var tokenValueStart = 0;

var tokenValueEnd = 0;

var varTypes = [];

var varValues = [];
/***********************
 * TEST PROGRAMS
 ***********************
 */
 // Test different types of expressions, variable 'a' never declared.
var smallTest1 = '{ a = "hello"\n{ P ( 5 + 6 )\n{ int b\n{ }\n}\n}\n}';

// Introduces a reserved word inside a charList.
var smallTest2 = '{ int c\n{ c = "int"\n{ char a\n{ a = " b "\n{ { }\n}\n}\n}\n}\n}';

// Test use undeclared variable.
var smallTest3 = 'a = " hello "';

// Test no source code
var smallTest4 ='';

//Test only passing lexer.
var smallTest5 ='} { 5 6 b = ( int';

//Test a lex error.
var smallTest6 = '{ a5 = "h"\n}';

//Test a parse error.
var smallTest7 = '{ int int a\n{ a 5\n}\n}';

// Test only curly braces.
var smallTest8 = '{ { } }';

var smallTest9 = 'P(2)$';

var smallTest10 = '{}';

var smallTest11 = '{{{{{{}}}}}}$';

var smallTest12 = 'P(a)$';

/***********************
 * SYMBOL TABLE - store the values of all the identifiers.
 ***********************
 */
var symbolTable = {};

/***********************
 * TOKEN KIND CONSTANTS
 ***********************
*/
var TOKEN_PRINT = "show";

var TOKEN_IDENTIFIER = "identificador";

var TOKEN_CHARLIST = "charList";

var TOKEN_DIGIT = "digito";

var TOKEN_OPERATOR = "operador";

var TOKEN_TYPE = "tipo";

var TOKEN_QUOTE = "citação";

var TOKEN_OPEN_CURLY_BRACE = "abre_chaves";

var TOKEN_CLOSE_CURLY_BRACE = "fecha_chaves";

var TOKEN_OPEN_PARENTHESIS = "abre_parênteses";

var TOKEN_CLOSE_PARENTHESIS = "fecha_parênteses";

var TOKEN_EQUAL_SIGN = "igual";

var TOKEN_EOF = "eof";

var TOKEN_OP = "operador";

var TOKEN_IF = "if";

var TOKEN_WHILE = "while";

var TOKEN_EQUALITY = "igualdade";

var TOKEN_BOOLEAN = "boolean";

/*********************
 * LEXICON - stores the reserved keywords for the grammer.
 *********************
*/
var lexicon = {"IF":TOKEN_IF, "WHILE":TOKEN_WHILE ,"SHOW":TOKEN_PRINT, "INT":TOKEN_TYPE, "STRING":TOKEN_TYPE, "BOOLEAN":TOKEN_TYPE, "P":TOKEN_PRINT, "(":TOKEN_OPEN_PARENTHESIS, ")":TOKEN_CLOSE_PARENTHESIS, "=":TOKEN_EQUAL_SIGN, "{":TOKEN_OPEN_CURLY_BRACE, "}":TOKEN_CLOSE_CURLY_BRACE, "+":TOKEN_OP, "-":TOKEN_OP, "TRUE":TOKEN_BOOLEAN, "FALSE":TOKEN_BOOLEAN };

var terminals = {"P":TOKEN_PRINT, "(":TOKEN_OPEN_PARENTHESIS, ")":TOKEN_CLOSE_PARENTHESIS, "{":TOKEN_OPEN_CURLY_BRACE, "}":TOKEN_CLOSE_CURLY_BRACE, "+":TOKEN_OP, "-":TOKEN_OP, "=":TOKEN_EQUAL_SIGN, "==":TOKEN_EQUALITY};

