/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/one-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("one-var", rule, {
    valid: [
        "function foo() { var bar = true; }",
        "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",
        "var foo = function() { var bar = true; baz(); }",
        {
            code: "function foo() { var bar = true, baz = false; }",
            options: ["always"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            options: ["never"]
        },
        {
            code: "for (var i = 0, len = arr.length; i < len; i++) {}",
            options: ["never"]
        },
        {
            code: "var bar = true; var baz = false;",
            options: [{ initialized: "never" }]
        },
        {
            code: "var bar = true, baz = false;",
            options: [{ initialized: "always" }]
        },
        {
            code: "var bar, baz;",
            options: [{ initialized: "never" }]
        },
        {
            code: "var bar; var baz;",
            options: [{ uninitialized: "never" }]
        },
        {
            code: "var bar, baz;",
            options: [{ uninitialized: "always" }]
        },
        {
            code: "var bar = true, baz = false;",
            options: [{ uninitialized: "never" }]
        },
        {
            code: "var bar = true, baz = false, a, b;",
            options: [{ uninitialized: "always", initialized: "always" }]
        },
        {
            code: "var bar = true; var baz = false; var a; var b;",
            options: [{ uninitialized: "never", initialized: "never" }]
        },
        {
            code: "var bar, baz; var a = true; var b = false;",
            options: [{ uninitialized: "always", initialized: "never" }]
        },
        {
            code: "var bar = true, baz = false; var a; var b;",
            options: [{ uninitialized: "never", initialized: "always" }]
        },
        {
            code: "var bar; var baz; var a = true, b = false;",
            options: [{ uninitialized: "never", initialized: "always" }]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1; var c = true; if (a) {let c = true; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { const a = 1; var c = true; if (a) {const c = true; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { if (true) { const a = 1; }; if (true) {const a = true; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1; let b = true; }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { const a = 1; const b = true; }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1, b = false; var c = true; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1; let b = 2; const c = false; const d = true; var e = true, f = false; }",
            options: [{ var: "always", let: "never", const: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            options: [{ var: "always", let: "always", const: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            options: [{ var: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = true, bar = false;",
            options: [{ var: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = true, bar = false;",
            options: [{ const: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = true, bar = false;",
            options: [{ uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo, bar",
            options: [{ initialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = true, bar = false; let a; let b;",
            options: [{ uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo, bar; let a = true; let b = true;",
            options: [{ initialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo, bar; const a=1; const b=2; let c, d",
            options: [{ var: "always", let: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo; var bar; const a=1, b=2; let c; let d",
            options: [{ const: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (let x of foo) {}; for (let y of foo) {}",
            options: [{ uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (let x in foo) {}; for (let y in foo) {}",
            options: [{ uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x; for (var y in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x, y; for (y in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x, y; for (var z in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x; for (var y in foo) {var bar = y; for (var z in bar) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 1; var b = 2; var x, y; for (var z in foo) {var baz = z; for (var d in baz) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x; for (var y of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x, y; for (y of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x, y; for (var z of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x; for (var y of foo) {var bar = y; for (var z of bar) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 1; var b = 2; var x, y; for (var z of foo) {var baz = z; for (var d of baz) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "function foo() { var bar = true, baz = false; }",
            options: ["never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var a = 1; for (var b = 2;;) {}",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var foo = true, bar = false; }",
            options: [{ initialized: "never" }],
            errors: [
                {
                    message: "Split initialized 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var foo, bar; }",
            options: [{ uninitialized: "never" }],
            errors: [
                {
                    message: "Split uninitialized 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar, baz; var a = true; var b = false; var c, d;}",
            options: [{ uninitialized: "always", initialized: "never" }],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement with uninitialized variables.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; var a; var b; var c = true, d = false; }",
            options: [{ uninitialized: "never", initialized: "always" }],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement with initialized variables.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; var a, b;}",
            options: [{ uninitialized: "never", initialized: "never" }],
            errors: [
                {
                    message: "Split 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Split 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true; var baz = false; var a; var b;}",
            options: [{ uninitialized: "always", initialized: "always" }],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            options: [{ let: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            options: [{ const: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            options: [{ let: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            options: [{ initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a, b; }",
            options: [{ uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            options: [{ initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'const' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            options: [{ const: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split 'const' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "let foo = true; switch(foo) { case true: let bar = 2; break; case false: let baz = 3; break; }",
            options: [{ var: "always", let: "always", const: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 74
            }]
        },
        {
            code: "var one = 1, two = 2;\nvar three;",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 2,
                column: 1
            }]
        },
        {
            code: "var i = [0], j;",
            options: [{ initialized: "never" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var i = [0], j;",
            options: [{ uninitialized: "never" }],
            errors: [{
                message: "Split uninitialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var x of foo) {}; for (var y of foo) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var x in foo) {}; for (var y in foo) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var foo = function() { var bar = true; var baz = false; }",
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 40
            }]
        },
        {
            code: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 45
            }, {
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 71
            }]
        },
        {
            code: "var foo = () => { var bar = true; var baz = false; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 35
            }]
        },
        {
            code: "var foo = function() { var bar = true; if (qux) { var baz = false; } }",
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 51
            }]
        },
        {
            code: "var foo; var bar;",
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 10
            }]
        },
        {
            code: "var x = 1, y = 2; for (var z in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var x = 1, y = 2; for (var z of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var x; var y; for (var z in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var x; var y; for (var z of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var x; for (var y in foo) {var bar = y; var a; for (var z of bar) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 41
            }]
        },
        {
            code: "var a = 1; var b = 2; var x, y; for (var z of foo) {var c = 3, baz = z; for (var d in baz) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 53
            }]
        }
    ]
});
