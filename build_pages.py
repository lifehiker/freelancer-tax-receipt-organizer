import os
b="/Users/shannonkempenich/CascadeProjects/freelancer-tax-receipt-organizer"
def w(r,c):
    p=os.path.join(b,r)
    os.makedirs(os.path.dirname(p),exist_ok=True)
    open(p,"w").write(c)
    print("OK:",r)
