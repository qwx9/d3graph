#!/bin/bash

files=(\
dom.expr.ts \
dom.option.ts \
dom.sym.ts \
dom.val.ts \
dom.ts \
expr.ts \
fns.ts \
option.ts \
rule.ts \
sym.ts \
val.ts \
\
main.ts \
)

cat ${files[@]} >app.ts
#npx tsc app.ts 2>&1 | less
npx tsc app.ts
