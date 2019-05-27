module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    "extends": ['plugin:prettier/recommended'],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
        "prettier/prettier": [
            "error", 
            { 
                "singleQuote": true,
                "semicolons": true,
                "tabWidth": 4
            }
        ]
    }
};