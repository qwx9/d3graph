# Query page implementation reference

- 3 graph structure
- recursivity
- container divs
- push/pop, popchild, pop el
- syms, compilation
- "expression", "symbol", "option", etc
- visualization (via dom) decoupled from model state and vis ideas

- note: as stateless as possible (which also means redundancies)
- but no real performance hit, certainly less than browser display
- root elements break genericity, must be treated differently
- no error recovery
- compilation process, required elements
- specification language
- avoiding conflicts when altering state
- ruleset and data driven programming
- comments from main.ts and elsewhere
- rule types and tree, data types, value types and tree, dom elements types and tree
- symbol id's cannot be relied on; removing elements and updates
- references: how
