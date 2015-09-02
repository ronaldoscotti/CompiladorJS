//main.js

/*
 * This is executed as a result of the user pressing the 
 *"compile" button.
 */

var verboseMode = false;

function run() {
    // Initialize variable and text areas.
    init();

    // Display  starting message.
    putMessage("O processo de compilação foi iniciado.");

    // Create an instance of a lexer object.
    var lexer = new Lexer();

    // Grab the tokens from the lexer.
    var tokens = lexer.lex();

    // If tokens is null then lex did not succeed.
    if (tokens !== null) {
        // Display errors and warning for lex.
        putMessage("Análise léxica encontrou " + warningCount + " alerta(s)" + " e " + errorCount + " erro(s).");

        // If there are no lex errors, then parse.
        if (!errorsFound) {
            // Create a string of the tokens returned by lex.
            var tokenString = getTokenValues(tokens);

            // Display tokens returned from lex.
            putMessage("Análise léxica retornou: [" + tokenString + "]");

            // Create an instance of a parser object.
            var parser = new Parser(tokens);

            // Begin parsing tokens.
            parser.parse();

            // Check if parse produced any errors. 
            if (!errorsFound) {
                // Create AST

                // Display symbol table.
                document.getElementById("taSymbolTable").value += "";

                document.getElementById("taSymbolTable").value += "\n" + parser.scope.buildSymbolTable();

                document.getElementById("parseTree").value += "";

                if (verboseMode) {
                    putMessage("Mostrando árvore sintática concreta.");
                }

                // Display parse tree.
                document.getElementById("parseTree").value += "\n" + parser.tree.toString();

                var ast = new AST(parser.tree);

                document.getElementById("ASTTree").value += "";

                if (verboseMode) {
                    putMessage("Displaying abstract syntax tree.");
                }

                document.getElementById("ASTTree").value += "\n" + ast.toString();

                var codeGen = new CodeGeneration(ast);

                document.getElementById("taCodeGen").value += "CODE GENERATED: \n";

                document.getElementById("taCodeGen").value += "\n" + codeGen.toString();

            } // End if       
        } else { // Parse errors were found.
            // Display parse errors.
            putMessage("Funciona porra!.");
        } // End else

    }// End null check.

} // End run.