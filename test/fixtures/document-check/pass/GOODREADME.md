```ts
import { foo } from 'dep-we-do-not-have'

// should not cause an error because we ignore TS2307
foo()

export const a = 1
```