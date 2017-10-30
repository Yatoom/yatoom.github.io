## RT0 syntax

- A, B, D: principals
- r, r1, r2: role names
- A.r: a role (a principal + a role name)

Four types of credentials:

| Type                                     | Explanation                              |
| ---------------------------------------- | ---------------------------------------- |
| Type 1: A.r $\leftarrow$ D               | Role A.r contains principal D as a member |
| Type 2: A.r $\leftarrow$ B.r1            | A.r contains role B.r1 as a subset       |
| Type 3: A.r $\leftarrow$ A.r1.r2         | A.r $\supseteq$ B.r2 for each B in A.r1  |
| Type 4: A.r $\leftarrow$ A1.r1 $\cap$ A2.r2 | A.r contains the intersection            |

| Example                                  | semantics                                | definition                               |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Epub.discount $\leftarrow$ Alice         | Alice $\in$ [[Epub.discount]]            | Alice belongs to the role Epu.discount   |
| Epub.discount $\leftarrow$ StateU.student | [[StateU.student]] $\subseteq$ [[Epub.discount]] | if StateU states that X is a student then I state that X gets a discount |
| Epub.discount $\leftarrow$ AccredBureau.university.student | For every $X \in$ [[AccredBureau.university]], [[X.student]] $\subseteq$ [[Epub.discount]] | If AccredBureau states that $X$ is an accredited university and  $X$ states that $Y$ is a student  then I state that $Y$ gets a discount |
| ITbizz.maysign $\leftarrow$ ITbizz.manager $\cap$ ITbizz.senior | [[ITbizz.manager]] $\cap$ [[ITbizz.senior]] $\subseteq$ [[ITbizz.maysign]] | Anyone showing a manager certificate and a senior certificate, both signed by ITbizz may sign |

__Find the semantics__
- Alice.s $\leftarrow$ Alice.u.v
- Alice.u $\leftarrow$ Bob
- Bob.v $\leftarrow$ Charlie
- Bob.v $\leftarrow$ Charlie.s
- Charlie.s $\leftarrow$ David
- Charlie.s $\leftarrow$ Edward

__Solution__

- [[Charlie.s]] = {David, Edward}
- [[Bob.v]] = {Charlie, David, Edward}
- [[Alice.u]] = {Bob}
- [[Alice.s]] = {Charlie, David, Edward}