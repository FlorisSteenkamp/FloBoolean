
from sympy import Poly, resultant, Symbol, sympify, expand, solve
from sympy import Matrix, det, binomial, factor, collect, terms_gcd
from sympy import simplify


def crossing():
    t,d = map(Symbol, ['t','d'])

    a3, a2, a1, a0 = map(Symbol, ['a3','a2','a1','a0'])

    # parametric equation
    x = a3*t**3 + a2*t**2 + a1*t + a0

    x1 = x
    x2 = x.subs(t,t+d)

    # 'forward difference'
    dX = x2 - x1

    dX = expand(dX)
    dX = collect(dX,t)

    print(dX)

    # a1*d + a2*d**2 + a3*d**3 + 3*a3*d*t**2 + t*(2*a2*d + 3*a3*d**2)


crossing()

