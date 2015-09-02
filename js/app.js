(function () {
    var app = angular.module('Compilador', []);

    app.controller('CompiladorCtrl', function () {
        this.entradas = areaDeTexto;

    });

    var areaDeTexto = [
        {id: 'taOutput', placeHolder: 'Output will be shown here.', titulo: 'Resultado da Compilação'},
        {id: 'parseTree', placeHolder: 'Concrete Syntax Tree will be shown here.', titulo: 'Árvore Sintática Concreta'},
        {id: 'ASTTree', placeHolder: 'Abstract Syntax Tree will be shown here.', titulo: 'Árvore Sintática Abstrata'},
        {id: 'taSymbolTable', placeHolder: 'Symbol table will be shown here.', titulo: 'Tabela de Símbolos'}
    ];

})();