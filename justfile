build:
    node scripts/build.mjs

check: build
    git diff --exit-code -- dist sheet/tokens.html

test:
    node --test test/*.test.mjs

gate blocks:
    BLOCKS={{blocks}} node scripts/gate.mjs

render blocks: build
    BLOCKS={{blocks}} node sheet/render.mjs
