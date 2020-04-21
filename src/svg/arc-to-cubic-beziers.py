
# This code is a modified version of code from 
# http://www.mare.ee/indrek/misc/2d.pdf

from sympy import Poly, resultant, Symbol, sympify, expand, solve
from sympy import Matrix, det, binomial, sin, cos, pi, evalf, nonlinsolve

# see https://math.stackexchange.com/a/434482/130809 for general ellipse equation
# or see https://en.wikipedia.org/wiki/Ellipse
'''
def arc_to_cubic():
    x, y = map(Symbol, ['x','y'])
    a, b, k, h = map(Symbol, ['a','b','k','h'])
    sinA, cosA = map(Symbol, ['sinA','cosA'])
    Qkk1, Qhh1, Qhk1, Q01 = map(Symbol, ['Qkk1', 'Qhh1', 'Qhk1', 'Q01'])
    Qkk2, Qhh2, Qhk2, Q02 = map(Symbol, ['Qkk2', 'Qhh2', 'Qhk2', 'Q02'])

    S1 = (b**2) * ((x-h)*cosA + (y-k)*sinA)**2
    S2 = (a**2) * ((x-h)*sinA - (y-k)*cosA)**2
    S3 = (a**2)*(b**2)
    
    P = S1 + S2 - S3

    a_ = 1
    b_ = 1
    A = (10 * (pi / 180)).evalf()
    sinA_ = sin(A) 
    cosA_ = cos(A)

    #P = P.subs(a,a_).subs(b,b_).subs(sinA,sinA_).subs(cosA,cosA_)
    #P = P.subs(x,0).subs(y,0)
    P = expand(P)

    #Qkk1 = a**2*cosA**2 + b**2*sinA**2
    #Qhk1 = -2*a**2*cosA*sinA + 2*b**2*cosA*sinA
    #Qhh1 = a**2*sinA**2 + b**2*cosA**2
    #Q01  = -a**2*b**2

    #Qkk2 = 
    #Qhk2 = 
    #Qhh2 = 
    #Q02  = 

    Q1 = Qkk1*k**2 + Qhh1*h**2 + Qhk1*h*k + Q01
    Q2 = Qkk2*k**2 + Qhh2*h**2 + Qhk2*h*k + Q02

    r = nonlinsolve([Q1, Q2], [h, k])
    print(r)

    #print(solve(Q,h))
    #print(solve(Q,k))
    #print(P)

    return P
'''

def arc_to_cubic():
    x,y = map(Symbol, ['x','y'])
    a,b,k,h = map(Symbol, ['a','b','k','h'])
    x0,y0 = map(Symbol, ['x0','y0'])

    e = (x-h)**2 + (y-k)**2 - a**2

    e1 = e.subs(x,0).subs(y,0)
    e2 = e.subs(x,x0).subs(y,y0)

    e1 = expand(e1)
    e2 = expand(e2)

    print(e1)
    print(e2)

    return e1,e2


arc_to_cubic()


# expanded: (incl x and y)
# -a**2*b**2 + a**2*cosA**2*k**2 - 2*a**2*cosA**2*k*y + a**2*cosA**2*y**2 - 
# 2*a**2*cosA*h*k*sinA + 2*a**2*cosA*h*sinA*y + 2*a**2*cosA*k*sinA*x - 
# 2*a**2*cosA*sinA*x*y + a**2*h**2*sinA**2 - 2*a**2*h*sinA**2*x + 
# a**2*sinA**2*x**2 + b**2*cosA**2*h**2 - 2*b**2*cosA**2*h*x + 
# b**2*cosA**2*x**2 + 2*b**2*cosA*h*k*sinA - 2*b**2*cosA*h*sinA*y - 
# 2*b**2*cosA*k*sinA*x + 2*b**2*cosA*sinA*x*y + b**2*k**2*sinA**2 - 
# 2*b**2*k*sinA**2*y + b**2*sinA**2*y**2

# expanded: (x,y = 0)
# -a**2*b**2 + a**2*cosA**2*k**2 - 2*a**2*cosA*h*k*sinA + a**2*h**2*sinA**2 + 
# b**2*cosA**2*h**2 + 2*b**2*cosA*h*k*sinA + b**2*k**2*sinA**2