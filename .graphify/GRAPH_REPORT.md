# Graph Report - .  (2026-04-20)

## Corpus Check
- 15 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1157 nodes · 5345 edges · 29 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `index-DouDGVkN.js` - 1127 edges
2. `i()` - 101 edges
3. `error()` - 94 edges
4. `resolve()` - 91 edges
5. `forEach()` - 87 edges
6. `l()` - 68 edges
7. `a()` - 65 edges
8. `constructor()` - 64 edges
9. `t()` - 63 edges
10. `delete()` - 58 edges

## Surprising Connections (you probably didn't know these)
- `index-DouDGVkN.js` --calls--> `g()`  [EXTRACTED]
  C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js → C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js  _Bridges community 2 → community 1_
- `index-DouDGVkN.js` --calls--> `Dh()`  [EXTRACTED]
  C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js → C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js  _Bridges community 2 → community 10_
- `n()` --calls--> `t()`  [EXTRACTED]
  C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js → C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js  _Bridges community 1 → community 3_
- `n()` --calls--> `fetch()`  [EXTRACTED]
  C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js → C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js  _Bridges community 1 → community 16_
- `le()` --calls--> `o()`  [EXTRACTED]
  C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js → C:\Users\juanp\Documents\Proyectos\reviewshield-dashboard\dist\assets\index-DouDGVkN.js  _Bridges community 6 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (214): a(), aa(), ac(), _addListener(), Ai(), ao(), as(), assertedPersistence() (+206 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (179): add(), addEntry(), addLocalQueryTarget(), addPendingMutation(), addReference(), ag(), ap(), applyChanges() (+171 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (53): index-DouDGVkN.js, addPostProcessor(), assertion(), assertionForEnrollment(), assertionForSignIn(), beforeAuthStateChanged(), check(), checkMaxDepth() (+45 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (112): addDetector(), addScope(), an(), Ar(), b(), bn(), Bt(), cacheUserLanguage() (+104 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (86): addCached(), applyToRemoteDocument(), Au(), av(), bu(), cd(), comparator(), _compareTo() (+78 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (58): addUsedNamespaces(), apply(), changeLanguage(), convertObject(), convertObjectMap(), deprecate(), detect(), dir() (+50 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (57): addNamespaces(), addResource(), addResourceBundle(), addResources(), ae(), be(), C(), canonicalString() (+49 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (50): af(), al(), applyToLocalDocumentSet(), at(), Bf(), Bl(), cl(), createWebChannelTransport() (+42 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (43): addFieldIndex(), addMatchingKeys(), addMutationBatch(), addTargetData(), addToCollectionParentIndex(), checkEmpty(), cleanUp(), createTargetIndexes() (+35 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (32): ah(), allocateTargetId(), calculateTargetCount(), complete(), computeViews(), dr(), forEachObserver(), getAllFromCache() (+24 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (30): addComponent(), addOrOverwriteComponent(), createDatastore(), createEventManager(), createSyncEngine(), Dh(), Dl(), Fh() (+22 more)

### Community 11 - "Community 11"
Cohesion: 0.1
Nodes (21): _assign(), _copy(), detachListener(), forAllChangedKeys(), getCustomParameters(), getDataByLanguage(), getScopes(), getUsedNamespaces() (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (20): child(), containsKey(), covers(), firstAfterOrEqual(), forEachInRange(), forEachWhile(), getAllMutationBatchesAffectingDocumentKey(), getAllMutationBatchesAffectingQuery() (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (18): compareSegments(), credential(), credentialFromError(), credentialFromResult(), credentialFromTaggedObject(), credentialWithLink(), extractNumericId(), fromBase64String() (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (17): addAuthTokenListener(), assertAuthConfigured(), auth(), enqueueRetryable(), getInterval(), getToken(), getUid(), iteration() (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (8): App.jsx, Dashboard.jsx, firebase.js, Login.jsx, Onboarding.jsx, ReviewCard.jsx, Settings.jsx, StatsBar.jsx

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (14): colorFlip(), docChanges(), fetch(), fixUp(), hasPendingWrites(), isEmpty(), isRed(), moveRedLeft() (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.2
Nodes (12): collect(), debug(), Ei(), getCacheSize(), getNextMutationBatchAfterBatchId(), getRemoteDocumentCache(), getSize(), newChangeBuffer() (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (12): bp(), fromTimestamp(), Fu(), getResource(), getResourceBundle(), pe(), Pu(), rp() (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.2
Nodes (10): am(), Bd(), cm(), dm(), fromServerFormat(), getFilters(), rm(), sm() (+2 more)

### Community 20 - "Community 20"
Cohesion: 0.4
Nodes (5): automaticDataCollectionEnabled(), checkDestroyed(), config(), name(), options()

### Community 21 - "Community 21"
Cohesion: 0.4
Nodes (5): _getPasswordPolicyInternal(), updatePasswordCharacterOptionsStatuses(), validatePassword(), validatePasswordCharacterOptions(), validatePasswordLengthOptions()

### Community 22 - "Community 22"
Cohesion: 0.5
Nodes (4): _getInstance(), initializeReceiver(), initializeSender(), initializeServiceWorkerMessaging()

### Community 23 - "Community 23"
Cohesion: 1
Nodes (1): eslint.config.js

### Community 24 - "Community 24"
Cohesion: 1
Nodes (1): postcss.config.js

### Community 25 - "Community 25"
Cohesion: 1
Nodes (1): index.js

### Community 26 - "Community 26"
Cohesion: 1
Nodes (1): main.jsx

### Community 27 - "Community 27"
Cohesion: 1
Nodes (1): tailwind.config.js

### Community 28 - "Community 28"
Cohesion: 1
Nodes (1): vite.config.js

## Knowledge Gaps
- **6 isolated node(s):** `eslint.config.js`, `postcss.config.js`, `index.js`, `main.jsx`, `tailwind.config.js` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 23`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index-DouDGVkN.js` connect `Community 2` to `Community 3`, `Community 1`, `Community 4`, `Community 6`, `Community 0`, `Community 7`, `Community 9`, `Community 17`, `Community 8`, `Community 10`, `Community 11`, `Community 5`, `Community 18`, `Community 19`, `Community 16`, `Community 20`, `Community 14`, `Community 13`, `Community 21`, `Community 22`, `Community 12`?**
  _High betweenness centrality (0.906) - this node is a cross-community bridge._
- **Why does `i()` connect `Community 0` to `Community 2`, `Community 3`, `Community 1`, `Community 4`, `Community 7`, `Community 10`, `Community 6`, `Community 5`, `Community 14`, `Community 18`, `Community 19`, `Community 17`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `resolve()` connect `Community 8` to `Community 2`, `Community 6`, `Community 5`, `Community 3`, `Community 10`, `Community 14`, `Community 0`, `Community 1`, `Community 16`, `Community 9`, `Community 17`, `Community 18`, `Community 12`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `eslint.config.js`, `postcss.config.js`, `index.js` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._