/*
* parser.js
*/

function Parser(tokenStream){

	// Private attributes.
	var tokens = tokenStream;
	var tokenIndex = 0;
	var currentToken = null;
	var tree = new Tree();
	var scope = new ScopeTree();

	// Public attributes.
	this.tree = tree;
	this.scope = scope;

	this.parse = function(){
		// Display tokens to be parsed.
		putMessage("Analisando [" + getTokenValues(tokens) + "]");

		// Grab the next token.
		currentToken = getNextToken();

		if(verboseMode){
			putMessage("Criando primeiro escopo.");
		}
		// Add first scope.
		scope.newScope();

		// A valid parse derives the Statement production, so begin there.
		parseStatement();

		scope.endScope();

		var endIndex = tokenIndex - 1;

		if(endIndex !== (tokens.length )){
			putErrorMessage("Token inesperado",currentToken.line, currentToken.position);
		}

		if(verboseMode){
			putMessage("Criando tabela de simbolos.");
		}

		// Report the results.
		putMessage("A análise encontrou " + errorCount + " erro(s)");

	}; // End parse.

	function parseStatement(){
	if(verboseMode){
		putMessage("Adicionando novo galho para a árvore de análise.");
	}
		tree.addBranchNode("Estado");

		if(currentToken.kind == TOKEN_PRINT){
			if(verboseMode){
				putMessage("Impressão da análise.");
			}// End if

			parsePrint();

		} else if(currentToken.kind == TOKEN_IDENTIFIER){

			var idenName = currentToken.value;

			// Save pointer to current scope.
			var currentScope = scope.currentScope;

			// Flag if variable found in a parent scope.
			var scopeFound = false;

			// Check scopes until we are at the root.(No more parents)
			while(scope.currentScope.parent && !scopeFound){
				if(scope.currentScope.entries[currentToken["valor"]]){
					// Scope found, variable has been declared.
					scopeFound = true;
				} // End if

				scope.currentScope = scope.currentScope.parent;
			} // End  while.

			if(!scopeFound){
				putErrorMessage("Identificador não declarado", tokens[tokenIndex-1].line, tokens[tokenIndex-1].position);
			} // End if

			// Return back to current scope.
			scope.currentScope = currentScope;

			var idStart = currentToken.position;

			if(verboseMode){
				putMessage("Analisando identificador.");
			} // End if

			parseId();

			tokenValueStart = tokenIndex;

			match(TOKEN_EQUAL_SIGN);

			if(verboseMode){
				putMessage("Analisando expressão.");
			} // End if

			parseExpr();

			tokenValueEnd = tokenIndex;

			var tokenContent = getTokenContent(tokens, tokenValueStart, tokenValueEnd);

			if(tokens[tokenIndex -1].value == "\"" && tokens[tokenIndex + 1].value == "\""){

				tokenContent = "\"" + tokenContent + "\"";
			}else if(isChar(tokenContent)){ // Check if an identifier is being set to another identifier.
				scopeFound = false;

			// Check scopes until we are at the root.(No more parents)
				while(scope.currentScope.parent && !scopeFound){
					if(scope.currentScope.entries[tokenContent]){
						// Scope found, variable has been declared.
						scopeFound = true;
					} // End if

					scope.currentScope = scope.currentScope.parent;
				} // End  while.

				if(verboseMode){
					putMessage("Checando identificadores não declarados.");
				}

				if(!scopeFound){
					putErrorMessage("Identificador não declarado", tokens[tokenIndex-1].line, tokens[tokenIndex-1].position);
				} // End if

				// Return back to current scope.
				scope.currentScope = currentScope;
			}

			scopeFound = false;

			// Check scopes until we are at the root.(No more parents)
				while(scope.currentScope.parent && !scopeFound){
					if(scope.currentScope.entries[idenName]){
						// Scope found, variable has been declared.
						scopeFound = true;
					} // End if
					else{
						scope.currentScope = scope.currentScope.parent;
					}

				} // End  while.

				if(verboseMode){
					putMessage("Procurando por identificadores não declarados.");
				}

				if(!scopeFound){
					putErrorMessage("Identificador não declarado", tokens[tokenIndex-1].line, tokens[tokenIndex-1].position);
				} // End if

			// Store the value of the identifer.
			if(scope.currentScope.entries[idenName]){
				scope.currentScope.entries[idenName].value = tokenContent;
				scope.currentScope.entries[idenName].isUsed = true;
				// Return back to current scope.
				scope.currentScope = currentScope;
			}
			else
			{
				putErrorMessage("Erro ao inicializar variável");
			}

			varValues[idName] = tokenContent;

			if(verboseMode){
				putMessage("Procurando por variáveis não declaradas.");
			} // End if

		} else if(currentToken.kind == TOKEN_TYPE){
			if(verboseMode){
				putMessage("Analisando declaraçãod e variável.");
			} // End if

			parseVarDecl();

		} else if(currentToken.kind == TOKEN_OPEN_CURLY_BRACE){
			match(TOKEN_OPEN_CURLY_BRACE);

			// Add new entry into a symbol table.
			scope.newScope();

			if(verboseMode){
				putMessage("Analisando lista de instruções.");
			} // End if

			parseStatementList();

			match(TOKEN_CLOSE_CURLY_BRACE);

			scope.endScope();
		} else if(currentToken.kind == TOKEN_WHILE){
			//debugger;
			parseWhileStatement();

		} else if(currentToken.kind == TOKEN_IF){
			parseIfStatement();
		} else{
			// Found unknown statement.
			putErrorMessage("Instrução desconhecida", tokens[tokenIndex-1].line, tokens[tokenIndex-1].position);
		} // End else

		tree.endChildren();
	} // End parseStatement.

function parseWhileStatement(){

	tree.addBranchNode("WhileLoop");

	match(TOKEN_WHILE);

	if(verboseMode){
		putMessage("Analisando expressão booleana.");
	} // End if

	parseBooleanExpr();

	match(TOKEN_OPEN_CURLY_BRACE);

	// Add new entry into a symbol table.
	scope.newScope();

	if(verboseMode){
		putMessage("Analisando lista de instruções.");
	} // End if

	parseStatementList();

	match(TOKEN_CLOSE_CURLY_BRACE);

	scope.endScope();

	tree.endChildren();
}

function parseIfStatement(){

	tree.addBranchNode("IfStatement");

	match(TOKEN_IF);

	if(verboseMode){
		putMessage("Analisando expressão booleana.");
	} // End if

	parseBooleanExpr();

	match(TOKEN_OPEN_CURLY_BRACE);

	// Add new entry into a symbol table.
	scope.newScope();

	if(verboseMode){
		putMessage("Analisando lista de instruções.");
	} // End if

	parseStatementList();

	match(TOKEN_CLOSE_CURLY_BRACE);

	scope.endScope();

	tree.endChildren();
}

function parseBooleanExpr(){

	tree.addBranchNode("BoolExpr");

	// Match the pattern for testing for equality.
	if(currentToken.kind == TOKEN_OPEN_PARENTHESIS){
		match(TOKEN_OPEN_PARENTHESIS);

		parseExpr();

		match(TOKEN_EQUALITY);

		parseExpr();

		match(TOKEN_CLOSE_PARENTHESIS);
	} else{ // Match the pattern for a boolval.
		match(TOKEN_BOOLEAN);
	}

	tree.endChildren();

}

function parseStatementList(){
	if(verboseMode){
		putMessage("Adding StatementList branch to parse tree.");
	}
	tree.addBranchNode("StatementList");

	if(currentToken.kind !== EOF && currentToken.kind !== TOKEN_CLOSE_CURLY_BRACE){
		if(verboseMode){
			putMessage("Parsing statement.");
		} //  End if

		parseStatement();

		if(verboseMode){
			putMessage("Parsing statement list.");
		} // End if

		parseStatementList();
	} // End if

	tree.endChildren();
} // End parseStatementList

function parsePrint(){

	if(verboseMode){
		putMessage("Adding Print branch to parse tree.");
	}
	tree.addBranchNode("Print");

	match(TOKEN_PRINT);
	match(TOKEN_OPEN_PARENTHESIS);
	if(verboseMode){
			putMessage("Parsing expression.");
	} // End if

	parseExpr();
	match(TOKEN_CLOSE_PARENTHESIS);

	tree.endChildren();
} // End parsePrint

function parseExpr(){
	if(verboseMode){
		putMessage("Adding Expression branch to parse tree.");
	}

	tree.addBranchNode("Expression");

	if(currentToken.kind == TOKEN_DIGIT){
		if(verboseMode){
			putMessage("Parsing Int expression.");
		} // End if
		parseIntExpr();
	} else if(currentToken.kind == TOKEN_QUOTE){
		if(verboseMode){
			putMessage("Parsing Char expression.");
		} // End if

		parseCharExpr();
	} else if(currentToken.kind == TOKEN_IDENTIFIER){
		if(verboseMode){
			putMessage("Parsing Identifier.");
		} // End else if
		parseId();
	} else if(currentToken.kind == TOKEN_BOOLEAN){
		if(verboseMode){
			putMessage("Parsing Boolean expression.");
		} // End else if
		parseBooleanExpr();
	} else if(currentToken.kind == TOKEN_OPEN_PARENTHESIS && tokens[tokenIndex].kind == TOKEN_BOOLEAN){
		if(verboseMode){
			putMessage("Parsing Boolean expression.");
		} // End else if
		parseBooleanExpr();
	}else{
		putErrorMessage("Unknown expression.", tokens[tokenIndex-1].line, tokens[tokenIndex-1].position);
	} // End if

	tree.endChildren();
} // End parseExpr

function parseIntExpr(){
	if(verboseMode){
		putMessage("Adding IntExpr branch to parse tree.");
	}
	tree.addBranchNode("IntExpr");

	if(tokenIndex < tokens.length){
		if(tokens[tokenIndex].kind == TOKEN_OP){
			match(TOKEN_DIGIT);
			match(TOKEN_OP);
			if(verboseMode){
				putMessage("Parsing expression.");
			} // End if
			parseExpr();
		} // End if
		else{
			match(TOKEN_DIGIT);
		} // End else
	}// End token check.
	else{
		match(TOKEN_DIGIT);
	} // End else

	tree.endChildren();

} // End parseIntExpr

function parseCharExpr(){
	if(verboseMode){
		putMessage("Adding CharExpr branch to parse tree.");
	}
	tree.addBranchNode("CharExpr");

	match(TOKEN_QUOTE);
	match(TOKEN_CHARLIST);
	match(TOKEN_QUOTE);

	tree.endChildren();
} // End parseCharExpr

function parseId(){
	if(verboseMode){
		putMessage("Adding Id branch to parse tree.");
	}
	tree.addBranchNode("Id");
	currentScope = scope.currentScope;
	scopeFound = false;

	// Check scopes until we are at the root.(No more parents)
	while(scope.currentScope.parent && !scopeFound){
		if(scope.currentScope.entries[currentToken["value"]]){
			// Scope found, variable has been declared.
			scopeFound = true;
		} // End if

		scope.currentScope = scope.currentScope.parent;
	} // End  while.

	if(!scopeFound){
		putErrorMessage("Undeclared Identifier", tokens[tokenIndex-1].line, tokens[tokenIndex-1].position);
	} // End if

	// Return back to current scope.
	scope.currentScope = currentScope;


	idName = currentToken.value;
	match(TOKEN_IDENTIFIER);

	tree.endChildren();
} // End parseId

function parseVarDecl(){
	tree.addBranchNode("VarDecl");

	// Create an identifier object.
	var id = new Identifier();

	// Set the identifier type.
	id.type = currentToken.value;

	idType = currentToken.value;
	match(TOKEN_TYPE);
	if(verboseMode){
		putMessage("Parsing Identifier.");
	} // End if

	// Set the identifer name.
	id.name = currentToken.value;

	// Set scope level.
	id.scope = scope.currentScope.name;

	// Set token
	id.token = currentToken;


	// Add entry into symbol table, if it doesn't already exist in the current scope.
	if(!scope.currentScope.entries[currentToken["value"]]){
		scope.currentScope.entries[currentToken["value"]] = id;
	} else{
		if(verboseMode){
			putMessage("Checking for redeclared identifiers.");
		}
		// Redeclared identifer.
		putErrorMessage("Redeclared identifer",currentToken.line, currentToken.position);
	}

	parseId();

	varTypes[idName] = idType;

	tree.endChildren();
} //  End parseVarDecl

function match(expectedKind){
	putMessage("Esperando: " + expectedKind);

	if(currentToken.kind == expectedKind){
		tree.addLeafNode(currentToken.value);
		putMessage("Recebido: " + currentToken.kind);

		currentToken = getNextToken();
	} else{
		if(verboseMode){
			putMessage("Foi encontrado um token de tipo desconhecido.");
		}
		putErrorMessage("Era esperado um token do tipo: " + expectedKind + " mas foi recebido do tipo " + currentToken.kind + ".",currentToken.line, currentToken.position);
	} // End else
} // End match

function getNextToken(){
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length){
            putMessage("Buscando novo token.");
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("Token Atual:" + thisToken.value);
        } // End if

        tokenIndex++;

        return thisToken;
    } // End getNextToken

} // End Parser.