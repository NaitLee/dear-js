// deno-lint-ignore-file no-explicit-any

export const VALUES_EASY: Record<string, any> = {
    '0': 0,
    '"0"': "0",
    '1': 1,
    '"1"': "1",
    '""': "",
    'true': true,
    'false': false,
    'undefined': undefined,
    'null': null
};

export const VALUES_NORMAL: Record<string, any> = {
    ...VALUES_EASY,
    '-1': -1,
    '"-1"': "-1",
    '"true"': "true",
    '"false"': "false",
    '""': "",
    '[]': [],
    '{}': {}
};

export const VALUES_HARD: Record<string, any> = {
    ...VALUES_NORMAL,
    '[[]]': [[]],
    '[0]': [0],
    '[1]': [1],
    '[-1]': [-1],
    'Infinity': Infinity,
    '-Infinity': -Infinity,
    'NaN': NaN
};

export const VALUES_INSANE: Record<string, any> = {
    ...VALUES_HARD,
    'Boolean(false)': Boolean(false),
    'String("")': String(""),
    'Number(0)': Number(0),
    'String("0")': String("0"),
    'Boolean(true)': Boolean(true),
    'Number(1)': Number(1),
    'String("1")': String("1"),
    'Number(-1)': Number(-1),
    'String("-1")': String("-1"),
    'Object()': Object()
};
