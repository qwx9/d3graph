#!/bin/sh

files=(\
dom.expr.ts \
dom.obj.ts \
dom.option.ts \
dom.sym.ts \
dom.ts \
expr.ts \
fns.ts \
obj.ts \
option.ts \
rule.ts \
sym.ts \
val.ts \
\
main.ts \
)

cat ${files[@]} >app.ts
npx tsc app.ts
