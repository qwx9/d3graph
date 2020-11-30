#!/bin/bash
files=(\
ts/fns.ts \
ts/dom.expr.ts \
ts/dom.option.ts \
ts/dom.parse.ts \
ts/dom.sym.ts \
ts/dom.val.ts \
ts/dom.ts \
ts/expr.ts \
ts/option.ts \
ts/parse.ts \
ts/rule.ts \
ts/sym.ts \
ts/val.ts \
\
ts/main.ts \
)
cat ${files[@]} >static/app.ts
npx tsc \
	-t ES5 \
	-m commonjs \
	--strict \
	--noImplicitAny \
	--strictNullChecks \
	--strictFunctionTypes \
	--strictBindCallApply \
	--strictPropertyInitialization \
	--noImplicitThis \
	--alwaysStrict \
	--noUnusedLocals \
	--noUnusedParameters \
	--noImplicitReturns \
	--noFallthroughCasesInSwitch \
	static/app.ts
